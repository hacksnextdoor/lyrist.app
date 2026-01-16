import {useRouter, usePathname, useSearchParams} from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {useQueryState} from 'next-usequerystate';
import {useState, useRef, useEffect, useLayoutEffect, useCallback, useMemo, Suspense} from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  Platform,
  ActivityIndicator,
} from 'react-native';
import ReactPlayer from 'react-player';
import {Editor, LyristText, AudioItem, TitleInput, PlusButton} from '../components';
import {MyLibraryScreen} from './MyLibraryScreen';
import {
  LYRICS_PAGE_ENTERED,
  LYRICS_PAGE_EXITED,
  LYRIST_BLUE,
  MAX_PAGES,
  TURQUOISE,
  QUERY_EXECUTED,
  SEARCH_RESULT_SELECTED,
  USER_SIGNED_OUT,
} from '../constants';
import {useAuthContext, usePagesContext} from '../context';
import {logFirebaseEvent} from '../firebase';
import auth from '../firebase/firebase-auth-web';
import {Audio, AudioPlatform, Page} from '../types';
import {isDevMode} from '../firebase/emulator-utils';
import {useScale} from '../hooks/useScale';
import {useSave, useBatchedSave} from '../hooks/useSave';
import {FaSistrix, FaRegLightbulb} from 'react-icons/fa';
import {SlSocialSoundcloud, SlSocialYoutube} from 'react-icons/sl';

const LOG_PREFIX = '[PageScreen]';

/**
 * TODO: Next iterations
 *
 * 1. COLLECTIONS SUPPORT
 *    - Add CollectionContext/Provider for web
 *    - Allow creating pages within collections
 *    - Show collection hierarchy in library panel
 *
 * 2. OPTIMISTIC UPDATES
 *    - Update UI immediately on save, rollback on error
 *    - Use React Query's optimistic update pattern
 *
 * 3. OFFLINE SUPPORT
 *    - Queue saves when offline
 *    - Sync when back online
 *    - Show offline indicator
 *
 * 4. TITLE EDITING
 *    - Add inline title editor like mobile app
 *    - Use batchedSave for title changes
 *
 * 5. DELETE PAGES
 *    - Add swipe-to-delete or context menu
 *    - Use useDeletePageMutation from page.api.ts
 *
 * 6. KEYBOARD SHORTCUTS
 *    - Cmd+S to force save
 *    - Cmd+N for new page
 *    - Cmd+/ for search focus
 */

const AUDIO_PLATFORMS = ['YouTube', 'SoundCloud'];
const SAVE_DELAY_MS = 2000;

/**
 * Parse audio param from URL
 * Format: platform:id (e.g., "yt:dQw4w9WgXcQ" or "sc:123456789")
 */
function parseAudioParam(audioStr: string | null): {platform: AudioPlatform; id: string} | null {
  if (!audioStr) return null;
  const [platformPrefix, ...idParts] = audioStr.split(':');
  const id = idParts.join(':'); // Handle ids that might contain colons
  if (!id) return null;

  const platform = platformPrefix === 'sc' ? 'soundcloud' : 'youtube';
  return {platform, id};
}

/**
 * Create audio param string for URL
 */
function createAudioParam(platform: AudioPlatform, id: string): string {
  const prefix = platform === 'soundcloud' ? 'sc' : 'yt';
  return `${prefix}:${id}`;
}

function getUrl(platform: AudioPlatform, audioId: string) {
  return platform === 'soundcloud'
    ? `https://api.soundcloud.com/tracks/${audioId}`
    : `https://youtube.com/watch?v=${audioId}`;
}

function PageScreenInner() {
  const {large} = useScale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  /*
   * URL STATE - Clean params
   * - audio: "yt:xyz" or "sc:123" format (platform:id)
   * - q: search query
   * - plat: search platform
   *
   * pageId is derived from audio via findPageFromAudio() - not stored in URL
   *
   * Also supports legacy params from MyLibraryScreen:
   * - id: pageId (used to look up audio)
   * - source: platform (youtube/soundcloud)
   * - source-id: audio id
   */
  const [audioParam, setAudioParam] = useQueryState('audio');
  const [pageIdParam, setPageIdParam] = useQueryState('pageId');

  // Legacy params from MyLibraryScreen navigation
  const [legacyId] = useQueryState('id');
  const [legacySource] = useQueryState('source');
  const [legacySourceId] = useQueryState('source-id');

  // Set mounted state to avoid hydration mismatch for auth-dependent UI
  useEffect(() => {
    setMounted(true);
  }, []);

  // Trigger panel animations after DOM is ready - uses forced reflow
  useLayoutEffect(() => {
    // Force browser to commit pre-animate state by reading offsetHeight
    if (typeof document !== 'undefined') {
      void document.body.offsetHeight;
    }
    // Now the transition will animate properly
    setAnimateReady(true);
  }, []);

  // Migrate legacy params to new format on mount
  useEffect(() => {
    if (legacyId || legacySourceId) {
      console.log(
        `${LOG_PREFIX} Migrating legacy params: id=${legacyId}, source=${legacySource}, source-id=${legacySourceId}`,
      );

      // Build new URL with clean params (audio only, pageId derived internally)
      const params = new URLSearchParams();
      if (legacySourceId && legacySource) {
        const prefix = legacySource === 'soundcloud' ? 'sc' : 'yt';
        params.set('audio', `${prefix}:${legacySourceId}`);
      }

      // Replace URL without adding to history
      const newUrl = `${pathname}?${params.toString()}`;
      router.replace(newUrl);
    }
  }, [legacyId, legacySource, legacySourceId, pathname, router]);

  // Use legacy params as fallback until migration completes
  const effectiveAudioParam =
    audioParam ||
    (legacySourceId && legacySource
      ? `${legacySource === 'soundcloud' ? 'sc' : 'yt'}:${legacySourceId}`
      : null);

  /* SEARCH STATE */
  const [selectedPlatform, setPlatform] = useQueryState('plat', {defaultValue: 'youtube'});
  const [q, setQ] = useQueryState('q', {defaultValue: ''});
  const [searchResults, setSearchResults] = useState<Audio[]>([]);
  const [resultsPlatform, setResultsPlatform] = useState<string | null>(null); // Platform used for current results
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<Error | null>(null);

  /* LIBRARY STATE */
  const [focusMode, setFocusMode] = useState(false); // Dims side panels
  const PAGE_SIZE = 100;

  // Parse audio from URL param into Audio object for useSave
  const initialAudio = useMemo((): Audio | undefined => {
    if (!effectiveAudioParam) return undefined;
    const parsed = parseAudioParam(effectiveAudioParam);
    if (!parsed) return undefined;
    // Find full audio object from search results or create minimal one
    const fromSearch = searchResults.find(r => r.id === parsed.id);
    if (fromSearch) return fromSearch;
    return {
      id: parsed.id,
      platform: parsed.platform,
      title: '',
    } as Audio;
  }, [effectiveAudioParam, searchResults]);

  // Compute player URL from audio
  const url = useMemo(() => {
    if (initialAudio) {
      return getUrl(initialAudio.platform, initialAudio.id);
    }
    return null;
  }, [initialAudio]);

  const [playerLoading, setPlayerLoading] = useState(true);
  const [message, setMessage] = useState('player status');
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);

  const [editorMessage, setEditorMessage] = useState('editor status');
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [animateReady, setAnimateReady] = useState(false);
  const {hasPlus, user, userLoading, setOpenAuthModal, setOpenPricingModal} = useAuthContext();
  const {findPageFromPageId, findPageFromAudio, pages, pagesLoading, error} = usePagesContext();

  const effectivePageId = useMemo(() => {
    if (pageIdParam) return pageIdParam;
    if (!initialAudio?.id) return null;
    const page = findPageFromAudio(initialAudio.id);
    return page?.id ?? null;
  }, [pageIdParam, initialAudio?.id, findPageFromAudio]);

  console.log(
    `${LOG_PREFIX} URL PARAMS: audioParam=${audioParam}, legacyId=${legacyId}, legacySource=${legacySource}, legacySourceId=${legacySourceId}`,
  );
  console.log(
    `${LOG_PREFIX} EFFECTIVE: effectivePageId=${effectivePageId}, effectiveAudioParam=${effectiveAudioParam}`,
  );

  /*
   * USE SAVE - matches mobile exactly
   * Handles: Firebase listeners, auto-save, page creation
   * Only attaches listeners when user is authenticated
   */
  const {
    currentId,
    currentTitle,
    currentAudio,
    currentBody,
    editorLoading,
    editorKey,
    triggerSave,
  } = useSave({
    initialPage: {id: effectivePageId, audio: initialAudio},
    userId: user?.uid ?? null,
  });

  // Batched save for debouncing
  const {batchedSave, flush} = useBatchedSave(triggerSave, SAVE_DELAY_MS);
  console.log(
    `${LOG_PREFIX} RENDER: pageIdParam=${effectivePageId}, audioParam=${effectiveAudioParam}, currentId=${currentId}, editorLoading=${editorLoading}`,
  );

  const pagesLeftBasicUser = Math.max(0, MAX_PAGES - (pages?.length ?? 0));

  // Sort by dateLastModified descending (most recent first) - this is the display order
  const pagesToFilter = useMemo(() => {
    if (!pages) return [];
    return [...pages].sort((a, b) => (a.dateLastModified > b.dateLastModified ? -1 : 1));
  }, [pages]);

  // Unlocked pages = first N from the display order (most recently modified)
  // This matches what the user sees in the library panel
  const unlockedPages = useMemo(() => {
    return pagesToFilter.slice(0, MAX_PAGES);
  }, [pagesToFilter]);

  // reachedFreeLimit: user is NOT Plus AND has >= MAX_PAGES
  const reachedFreeLimit = !hasPlus && (pages?.length ?? 0) >= MAX_PAGES;

  /* REFS */
  const playerRef = useRef<ReactPlayer>(null);
  const editorRef = useRef<TextInput>(null);

  // Compute lockEditor EXACTLY like mobile:
  // - For NEW pages (no effectivePageId): lock if reachedFreeLimit
  // - For EXISTING pages: lock if reachedFreeLimit AND page is NOT in unlocked set
  // This is computed fresh each render (not stored in ref) so it updates when page changes
  const lockEditor = useMemo(() => {
    if (!pages) return false;

    if (effectiveAudioParam && !effectivePageId) {
      // New page - check if user can create more (same as SearchScreen)
      return reachedFreeLimit;
    }
    if (effectivePageId) {
      // Existing page - check if it's in the "unlocked" set (same as MyLibraryScreen)
      const isUnlocked = unlockedPages.some(page => page.id === effectivePageId);
      return reachedFreeLimit && !isUnlocked;
    }
    return false;
  }, [pages, effectiveAudioParam, effectivePageId, reachedFreeLimit, unlockedPages]);

  // Note: No URL sync needed - pageId is derived from audio via findPageFromAudio
  // When a new page is created, it automatically becomes associated with the audio

  /* EVENTS */
  const handlePlay = () => setPlaying(true);
  const handlePause = () => setPlaying(false);

  /**
   * Handle title changes - uses batchedSave like mobile
   */
  const handleTitleChange = useCallback(
    (text: string) => {
      console.log(`${LOG_PREFIX} handleTitleChange: "${text}"`);
      batchedSave('title', text);
    },
    [batchedSave],
  );

  /**
   * Handle text changes - uses batchedSave like mobile
   */
  const handleChangeText = useCallback(
    (text: string) => {
      console.log(
        `${LOG_PREFIX} handleChangeText: length=${text.length}, preview="${text.substring(
          0,
          30,
        )}..."`,
      );
      setEditorMessage('TYPING');

      // Character limit for non-Plus users
      if (!lockEditor && !hasPlus && text.length > 10000) {
        editorRef.current?.blur();
        setShowSizeModal(true);
        return;
      }

      // Auto-save using batched save (handles both new and existing pages)
      batchedSave('body', text);
      setEditorMessage('SAVING...');
    },
    [hasPlus, batchedSave],
  );

  const executeQuery = async (query: string) => {
    const trimmedQuery = query.trim();
    if (trimmedQuery.length > 0) {
      try {
        setSearchLoading(true);
        const searchPath = `/api/search?${new URLSearchParams({
          q: trimmedQuery,
          plat: selectedPlatform,
        }).toString()}`;
        let data = await fetch(searchPath, {cache: 'no-store'});
        let json = await data.json();
        setQ(trimmedQuery);
        setSearchResults(json);
        setResultsPlatform(selectedPlatform); // Track which platform these results are from
        logFirebaseEvent(QUERY_EXECUTED, {query: trimmedQuery});
        window.localStorage.setItem(
          'search',
          JSON.stringify({results: json, q: trimmedQuery, plat: selectedPlatform}),
        );
        setSearchError(null);
      } catch (e) {
        setSearchError(e as Error);
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }
  };

  const handleSelectAudio = useCallback(
    (item: Audio) => {
      console.log(
        `${LOG_PREFIX} handleSelectAudio: id=${item.id}, title="${item.title}", platform=${item.platform}`,
      );

      // CRITICAL: Flush any pending saves before switching (prevents data loss)
      flush();

      const pageResult = findPageFromAudio(item.id);
      const existingPageId = pageResult?.id ?? null;
      console.log(`${LOG_PREFIX} handleSelectAudio: existingPageId=${existingPageId}`);
      logFirebaseEvent(SEARCH_RESULT_SELECTED, {title: item.title});

      // Set audio param - pageId is derived automatically via findPageFromAudio
      const audioStr = createAudioParam(item.platform, item.id);
      setAudioParam(audioStr);
    },
    [findPageFromAudio, setAudioParam, flush],
  );

  const handleSelectPage = useCallback(
    (item: Page) => {
      console.log(
        `${LOG_PREFIX} handleSelectPage: id=${item.id}, title="${item.title}", audio=${item.audio?.id}`,
      );

      flush();

      if (item.audio) {
        const audioStr = createAudioParam(item.audio.platform, item.audio.id);
        console.log(`${LOG_PREFIX} handleSelectPage: Setting audioParam=${audioStr}`);
        setAudioParam(audioStr);
        setPageIdParam(null);
      } else {
        setPageIdParam(item.id);
        setAudioParam(null);
      }
    },
    [setAudioParam, setPageIdParam, flush],
  );

  const [mobile, setMobile] = useState(false);

  /* EFFECTS */
  useEffect(() => {
    const isMobile = () => {
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      return mobileRegex.test(window.navigator.userAgent);
    };
    const handleResize = () => setMobile(isMobile());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    logFirebaseEvent(LYRICS_PAGE_ENTERED);
    return () => {
      // Flush pending saves before leaving
      flush();
      logFirebaseEvent(LYRICS_PAGE_EXITED);
    };
  }, [flush]);

  useEffect(() => {
    if (playerLoading) setPlayerLoading(false);
  }, [playerLoading]);

  // Autofocus editor when signed in and editor is ready
  useEffect(() => {
    if (user && !editorLoading && url && large && !lockEditor) {
      editorRef.current?.focus();
    }
  }, [user, editorLoading, url, large]);

  // Track what query we've loaded to prevent duplicate fetches
  const loadedQueryRef = useRef<string | null>(null);

  // Load search results on mount - from URL params first, then localStorage
  useEffect(() => {
    const loadSearch = async () => {
      // Read directly from searchParams to avoid useQueryState hydration race
      const urlQuery = searchParams.get('q');
      const urlPlatform = searchParams.get('plat') || 'youtube';
      const queryKey = `${urlQuery}:${urlPlatform}`;

      // Skip if we've already loaded this query
      if (loadedQueryRef.current === queryKey) return;

      // If URL has a query, execute it
      if (urlQuery && urlQuery.trim().length > 0) {
        loadedQueryRef.current = queryKey;
        try {
          setSearchLoading(true);
          const searchPath = `/api/search?${new URLSearchParams({
            q: urlQuery.trim(),
            plat: urlPlatform,
          }).toString()}`;
          const data = await fetch(searchPath, {cache: 'no-store'});
          const json = await data.json();
          setSearchResults(json);
          setResultsPlatform(urlPlatform);
          setQ(urlQuery.trim());
          setPlatform(urlPlatform);
          window.localStorage.setItem(
            'search',
            JSON.stringify({results: json, q: urlQuery.trim(), plat: urlPlatform}),
          );
          setSearchError(null);
        } catch (e) {
          setSearchError(e as Error);
        } finally {
          setSearchLoading(false);
        }
        return;
      }
      // Otherwise load from localStorage (only once)
      if (loadedQueryRef.current === null) {
        loadedQueryRef.current = 'localStorage';
        const localSearch = window.localStorage.getItem('search');
        if (localSearch) {
          const parsed = JSON.parse(localSearch);
          setSearchResults(parsed.results || []);
          if (parsed.plat) {
            setResultsPlatform(parsed.plat);
            setPlatform(parsed.plat);
          }
          if (parsed.q) setQ(parsed.q);
        }
      }
    };
    loadSearch();
  }, [searchParams, setQ, setPlatform]);

  /* RENDER PANELS */
  const renderEditorPanel = () => (
    <View style={[styles.panel, styles.editorPanel]}>
      {isDevMode() && (
        <View style={styles.debugInfo}>
          <LyristText style={styles.debugText}>player: {message}</LyristText>
          <LyristText style={styles.debugText}>editor: {editorMessage}</LyristText>
        </View>
      )}
      {url && (
        <View style={styles.playerWrapper}>
          <View style={styles.playerInner}>
            <ReactPlayer
              url={url}
              width="100%"
              height="100%"
              playing={playing}
              volume={1.0}
              muted={muted}
              ref={playerRef}
              style={{backgroundColor: '#000'}}
              controls={true}
              loop={true}
              onPlay={handlePlay}
              onPause={handlePause}
              onStart={() => !mobile && setMuted(false)}
              onReady={() => setMessage('ready')}
              onBuffer={() => setMessage('buffering')}
              onBufferEnd={() => setMessage('buffering finished')}
              onEnded={() => setMessage('ended')}
              onError={err => setMessage(JSON.stringify(err))}
            />
          </View>
        </View>
      )}
      <View style={styles.editorWrapper}>
        {editorLoading || pagesLoading || userLoading ? (
          <ActivityIndicator color={LYRIST_BLUE} style={{marginTop: 40}} />
        ) : lockEditor ? (
          <Pressable style={styles.ctaContainer} onPress={() => setOpenPricingModal(true)}>
            <LyristText weight="Medium" style={styles.ctaTitle}>
              Unlock unlimited pages
            </LyristText>
            <LyristText style={styles.ctaSubtitle}>
              You get 3 pages on the free tier. Get Plus for more.
            </LyristText>
            <View style={styles.ctaButtonPlus}>
              <LyristText weight="Medium" style={styles.ctaButtonText}>
                Get Lyrist Plus
              </LyristText>
            </View>
          </Pressable>
        ) : user == null ? (
          <Pressable style={styles.ctaContainer} onPress={() => setOpenAuthModal(true)}>
            <LyristText weight="Medium" style={styles.ctaTitle}>
              Your lyrics, synced everywhere
            </LyristText>
            <LyristText style={styles.ctaSubtitle}>
              Save your work and pick up where you left off
            </LyristText>
            <View style={styles.ctaButton}>
              <LyristText weight="Medium" style={styles.ctaButtonText}>
                Sign in to use the editor
              </LyristText>
            </View>
          </Pressable>
        ) : !url ? (
          <View style={styles.noAudioMessage}>
            <LyristText style={styles.noAudioText}>
              Select audio from search to start writing
            </LyristText>
          </View>
        ) : (
          <>
            <View style={styles.titleRow}>
              <View style={styles.titleInputWrapper}>
                <TitleInput
                  key={`title-${editorKey}`}
                  color={'black'}
                  inputAccessoryViewID={'PageScreen'}
                  onChangeText={handleTitleChange}
                  testID="title-input"
                  text={currentTitle || currentAudio?.title || ''}
                />
              </View>
              <Pressable
                onPress={() => setFocusMode(!focusMode)}
                style={styles.focusModeButton}
                accessibilityLabel={focusMode ? 'Exit focus mode' : 'Enter focus mode'}>
                <FaRegLightbulb size={14} color="#666" />
                <LyristText style={styles.focusModeText}>Focus</LyristText>
              </Pressable>
            </View>
            <Editor
              key={`editor-${editorKey}`}
              color={'black'}
              inputAccessoryViewID={'PageScreen'}
              onChangeText={handleChangeText}
              placeholder={'Start typing your lyrics...'}
              ref={editorRef}
              text={currentBody}
            />
          </>
        )}
      </View>
    </View>
  );


  /* RENDER SEARCH RESULTS ONLY (input is in header) */
  const renderSearchResults = () => {
    const displayResults = searchResults.slice(0, PAGE_SIZE);
    const hasMoreResults = searchResults.length > PAGE_SIZE;

    return (
      <View style={styles.searchResultsPanel}>
        <View style={styles.searchResultsHeader}>
          {AUDIO_PLATFORMS.map(platform => {
            const plat = platform.toLowerCase();
            const isSelected = selectedPlatform === plat;
            const SocialIcon = plat === 'youtube' ? SlSocialYoutube : SlSocialSoundcloud;
            return (
              <Pressable
                key={plat}
                onPress={() => setPlatform(plat)}
                style={[styles.platformTab, isSelected && styles.platformTabActive]}>
                <SocialIcon color={isSelected ? 'white' : '#666'} size={14} />
                <LyristText style={[styles.platformTabText, isSelected && styles.platformTabTextActive]}>
                  {platform}
                </LyristText>
              </Pressable>
            );
          })}
        </View>
        <ScrollView style={styles.panelContentScrollable} showsVerticalScrollIndicator={true}>
          {searchLoading ? (
            <ActivityIndicator color={LYRIST_BLUE} style={{marginTop: 20}} />
          ) : searchError ? (
            <LyristText style={styles.emptyText}>{searchError.message}</LyristText>
          ) : displayResults.length > 0 ? (
            <>
              {resultsPlatform && (
                <View style={styles.platformIndicator}>
                  {resultsPlatform === 'youtube' ? (
                    <SlSocialYoutube color="#999" size={12} />
                  ) : (
                    <SlSocialSoundcloud color="#999" size={12} />
                  )}
                  <LyristText style={styles.platformIndicatorText}>
                    {displayResults.length} {resultsPlatform === 'youtube' ? 'YouTube' : 'SoundCloud'} result{displayResults.length !== 1 ? 's' : ''}
                  </LyristText>
                </View>
              )}
              {displayResults.map((item, index) => {
                const isCurrentlyPlaying = initialAudio?.id === item.id;
                return (
                  <View
                    key={index}
                    style={[styles.audioItemWrapper, isCurrentlyPlaying && styles.audioItemWrapperActive]}>
                    <AudioItem
                      audio={item}
                      index={index}
                      compact
                      onPressItem={() => handleSelectAudio(item)}
                      pageId={findPageFromAudio(item.id)?.id ?? null}
                    />
                  </View>
                );
              })}
              {hasMoreResults && (
                <LyristText style={styles.moreItemsText}>
                  +{searchResults.length - PAGE_SIZE} more results
                </LyristText>
              )}
            </>
          ) : (
            <View style={styles.searchHints}>
              <LyristText style={styles.hintText}>"lo-fi" type beats</LyristText>
              <LyristText style={styles.hintText}>"drake" instrumentals</LyristText>
              <LyristText style={styles.hintText}>"song name" lyrics</LyristText>
            </View>
          )}
        </ScrollView>
      </View>
    );
  };

  /* MAIN RENDER */
  if (large) {
    return (
      <View style={styles.container}>
        {/* Top Header */}
        <View style={[styles.topHeader, focusMode && styles.focusModeDimmed]}>
          {/* Logo section aligned with library sidebar */}
          <View style={styles.headerLeftSection}>
            <Link href="/" style={styles.headerLogo}>
              <Image src="/logo-black.png" width={28} height={28} alt="Lyrist" />
            </Link>
          </View>
          {/* Center: Search input */}
          <View style={styles.headerCenterSection}>
            <View style={styles.headerSearchInputWrapper}>
              <FaSistrix size={14} color="#999" />
              <TextInput
                defaultValue={q}
                onSubmitEditing={e => executeQuery(e.nativeEvent.text)}
                placeholder="Search for audio..."
                placeholderTextColor="#999"
                style={styles.headerSearchInput}
              />
            </View>
          </View>
          {/* Right: Auth buttons */}
          <View style={styles.headerRightSection}>
            {!mounted || userLoading ? (
              <View style={{width: 120, height: 32}} />
            ) : user ? (
              <>
                {!hasPlus && (
                  <PlusButton text="Get Lyrist Plus" onPress={() => setOpenPricingModal(true)} small />
                )}
                <Pressable
                  onPress={async () => {
                    await auth().signOut();
                    window.localStorage.clear();
                    logFirebaseEvent(USER_SIGNED_OUT);
                    router.push('/');
                  }}
                  style={styles.headerSignOut}>
                  <LyristText style={styles.headerSignOutText}>Sign out</LyristText>
                </Pressable>
              </>
            ) : (
              <Pressable onPress={() => setOpenAuthModal(true)} style={styles.headerSignIn}>
                <LyristText style={styles.headerSignInText}>Sign in</LyristText>
              </Pressable>
            )}
          </View>
        </View>
        {/* Three Panel Content */}
        <View style={styles.threePanel}>
          <View style={[styles.librarySidebarWrapper, focusMode && styles.focusModeDimmed]} {...(Platform.OS === 'web' && {className: animateReady ? 'panel-animate-left' : 'panel-pre-animate'} as any)}>
            <View style={styles.librarySidebar}>
              <MyLibraryScreen panelMode onSelectPage={handleSelectPage} />
            </View>
          </View>
          <View style={styles.panelCenter} {...(Platform.OS === 'web' && {className: animateReady ? 'panel-animate-fade' : 'panel-pre-animate'} as any)}>{renderEditorPanel()}</View>
          <View style={[styles.panelRight, focusMode && styles.focusModeDimmed]} {...(Platform.OS === 'web' && {className: animateReady ? 'panel-animate-right' : 'panel-pre-animate'} as any)}>{renderSearchResults()}</View>
        </View>
        {/* Modal - Only render when needed to avoid portal crash during Fast Refresh */}
        {showSizeModal && (
          <Modal animationType="fade" transparent visible={true}>
            <Pressable onPress={() => setShowSizeModal(false)} style={styles.modalOverlay} />
            <View style={styles.modalCard}>
              <LyristText weight="SemiBold">Character limit exceeded</LyristText>
              <LyristText>Get Plus for unlimited pages!</LyristText>
              <View style={styles.modalButtons}>
                <LyristText onPress={() => setShowSizeModal(false)}>No thanks</LyristText>
                <LyristText
                  onPress={() => {
                    setShowSizeModal(false);
                    setOpenPricingModal(true);
                  }}>
                  Get Plus
                </LyristText>
              </View>
            </View>
          </Modal>
        )}
      </View>
    );
  }

  // Small/Medium screens - single column, use existing nav
  return (
    <View style={styles.containerMobile}>
      {/* AppHeader renders via layout for mobile */}
      {url ? (
        <>
          <View style={styles.playerWrapperMobile}>
            <View style={styles.playerInnerMobile}>
              <ReactPlayer
                url={url}
                width="100%"
                height="100%"
                playing={playing}
                volume={1.0}
                muted={muted}
                ref={playerRef}
                style={{backgroundColor: '#000'}}
                controls={true}
                loop={true}
                onPlay={handlePlay}
                onPause={handlePause}
                onStart={() => !mobile && setMuted(false)}
                onReady={() => setMessage('ready')}
                onBuffer={() => setMessage('buffering')}
                onBufferEnd={() => setMessage('buffering finished')}
                onEnded={() => setMessage('ended')}
                onError={err => setMessage(JSON.stringify(err))}
              />
            </View>
          </View>
          <View style={styles.editorWrapperMobile}>
            {editorLoading || pagesLoading || userLoading ? (
              <ActivityIndicator color={LYRIST_BLUE} />
            ) : lockEditor ? (
              <Pressable style={styles.ctaContainer} onPress={() => setOpenPricingModal(true)}>
                <LyristText weight="Medium" style={styles.ctaTitle}>
                  Unlock unlimited pages
                </LyristText>
                <LyristText style={styles.ctaSubtitle}>
                  Free users get 3 pages. Go Plus for more.
                </LyristText>
                <View style={styles.ctaButtonPlus}>
                  <LyristText weight="Medium" style={styles.ctaButtonText}>
                    Get Lyrist Plus
                  </LyristText>
                </View>
              </Pressable>
            ) : user == null ? (
              <Pressable style={styles.ctaContainer} onPress={() => setOpenAuthModal(true)}>
                <LyristText weight="Medium" style={styles.ctaTitle}>
                  Your lyrics, synced everywhere
                </LyristText>
                <LyristText style={styles.ctaSubtitle}>
                  Save your work and pick up where you left off
                </LyristText>
                <View style={styles.ctaButton}>
                  <LyristText weight="Medium" style={styles.ctaButtonText}>
                    Sign in to use the editor
                  </LyristText>
                </View>
              </Pressable>
            ) : (
              <View style={styles.editorContentMobile}>
                <TitleInput
                  key={`title-${editorKey}`}
                  color={'black'}
                  inputAccessoryViewID={'PageScreen'}
                  onChangeText={handleTitleChange}
                  testID="title-input"
                  text={currentTitle || currentAudio?.title || ''}
                />
                <Editor
                  key={`editor-${editorKey}`}
                  color={'black'}
                  fontSize={16}
                  inputAccessoryViewID={'PageScreen'}
                  onChangeText={handleChangeText}
                  placeholder={'Start typing your lyrics...'}
                  ref={editorRef}
                  text={currentBody}
                />
              </View>
            )}
          </View>
        </>
      ) : (
        <View style={styles.noAudioMobile}>
          <LyristText style={styles.noAudioText}>
            Use Search to find audio and start writing
          </LyristText>
        </View>
      )}
      {/* Modal - Only render when needed to avoid portal crash during Fast Refresh */}
      {showSizeModal && (
        <Modal animationType="fade" transparent visible={true}>
          <Pressable onPress={() => setShowSizeModal(false)} style={styles.modalOverlay} />
          <View style={styles.modalCard}>
            <LyristText weight="SemiBold">Character limit exceeded</LyristText>
            <LyristText>Get Plus for unlimited pages!</LyristText>
            <View style={styles.modalButtons}>
              <LyristText onPress={() => setShowSizeModal(false)}>No thanks</LyristText>
              <LyristText
                onPress={() => {
                  setShowSizeModal(false);
                  setOpenPricingModal(true);
                }}>
                Get Plus
              </LyristText>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

// Export wrapper with Suspense for useSearchParams
export function PageScreen() {
  return (
    <Suspense fallback={<View style={styles.container}><ActivityIndicator color={LYRIST_BLUE} style={{marginTop: 40}} /></View>}>
      <PageScreenInner />
    </Suspense>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerLeftSection: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  headerCenterSection: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  headerRightSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  headerLogo: {
    padding: 4,
    display: 'flex',
    alignItems: 'center',
  },
  platformTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#F5F5F5',
  },
  platformTabActive: {
    backgroundColor: LYRIST_BLUE,
  },
  platformTabText: {
    fontSize: 14,
    color: '#666',
  },
  platformTabTextActive: {
    color: 'white',
  },
  headerSearchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  headerSearchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Fira Sans',
    color: 'black',
    ...(Platform.OS === 'web' && {outlineStyle: 'none' as any}),
  },
  headerSignOut: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  headerSignOutText: {
    fontSize: 14,
    color: '#666',
  },
  headerSignIn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  headerSignInText: {
    fontSize: 14,
    color: LYRIST_BLUE,
  },
  searchResultsPanel: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  searchResultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  containerMobile: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  libraryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.08)',
  },
  logoWrapper: {
    padding: 4,
  },
  logo: {
    width: 32,
    height: 32,
  },
  signOutButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  signOutText: {
    fontSize: 14,
    color: '#666',
  },
  signInButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  signInButtonText: {
    fontSize: 14,
  },
  threePanel: {
    flex: 1,
    flexDirection: 'row',
  },
  librarySidebarWrapper: {
    flex: 1,
    padding: 12,
    overflow: 'hidden',
  },
  librarySidebar: {
    flex: 1,
    backgroundColor: '#F5F5F7',
    borderRadius: 12,
    overflow: 'hidden',
    minHeight: 0,
  },
  panelCenter: {
    flex: 2,
  },
  panelRight: {
    flex: 1,
  },
  panel: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#FFF',
    overflow: 'hidden',
  },
  panelTransparent: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  editorPanel: {
    flex: 1.5,
  },
  divider: {
    width: 1,
    backgroundColor: '#E5E5E5',
  },
  panelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  panelTitle: {
    fontSize: 16,
  },
  panelContent: {
    flex: 1,
    paddingHorizontal: 8,
  },
  panelContentScrollable: {
    flex: 1,
    minHeight: 0,
    paddingHorizontal: 8,
  },
  itemCount: {
    fontSize: 12,
    color: '#999',
  },
  moreItemsText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 12,
    fontStyle: 'italic',
  },
  libraryItem: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginVertical: 2,
  },
  libraryItemActive: {
    backgroundColor: 'rgba(52, 152, 219, 0.1)',
  },
  libraryItemTitle: {
    fontSize: 14,
    marginBottom: 2,
  },
  libraryItemDate: {
    fontSize: 11,
    color: '#999',
  },
  emptyText: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    marginTop: 24,
    paddingHorizontal: 16,
  },
  playerWrapper: {
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  playerInner: {
    width: '66%',
    aspectRatio: 16 / 9,
  },
  playerWrapperMobile: {
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  playerInnerMobile: {
    width: '85%',
    aspectRatio: 16 / 9,
    maxHeight: 180,
  },
  editorWrapper: {
    flex: 1,
  },
  editorWrapperMobile: {
    flex: 1,
    paddingBottom: 16,
  },
  editorContentMobile: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  ctaContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 12,
  },
  ctaTitle: {
    fontSize: 20,
    color: '#333',
  },
  ctaSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  ctaButton: {
    backgroundColor: LYRIST_BLUE,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    marginTop: 8,
  },
  ctaButtonPlus: {
    backgroundColor: TURQUOISE,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    marginTop: 8,
  },
  ctaButtonText: {
    color: 'white',
    fontSize: 12,
  },
  noAudioMessage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  noAudioMobile: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  noAudioText: {
    color: '#666',
    textAlign: 'center',
  },
  platformTabs: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 12,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Fira Sans',
    color: 'black',
    ...(Platform.OS === 'web' && {outlineStyle: 'none' as any}),
  },
  searchHints: {
    paddingHorizontal: 16,
    paddingTop: 24,
    gap: 12,
  },
  hintText: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
  },
  debugInfo: {
    padding: 8,
    backgroundColor: '#FEF3C7',
  },
  debugText: {
    fontSize: 10,
    color: '#92400E',
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    gap: 12,
    maxWidth: 300,
    borderLeftWidth: 4,
    borderLeftColor: LYRIST_BLUE,
    alignSelf: 'center',
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  mobileContent: {
    flex: 1,
  },
  audioItemWrapper: {
    marginVertical: 2,
    marginHorizontal: 4,
    borderRadius: 8,
    overflow: 'hidden',
  },
  audioItemWrapperActive: {
    backgroundColor: 'rgba(52, 152, 219, 0.12)',
    borderLeftWidth: 3,
    borderLeftColor: LYRIST_BLUE,
  },
  saveButton: {
    backgroundColor: LYRIST_BLUE,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 12,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 15,
  },
  // Focus mode styles
  panelDimmed: {
    backgroundColor: '#F5F5F5',
  },
  textDimmed: {
    opacity: 0,
  },
  itemDimmed: {
    opacity: 0,
  },
  panelHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  platformTabsDimmed: {
    opacity: 0,
  },
  platformTabDimmed: {
    opacity: 0,
  },
  searchInputDimmed: {
    opacity: 0,
  },
  searchInputTextDimmed: {
    opacity: 0,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5E5',
  },
  titleInputWrapper: {
    flex: 1,
  },
  focusModeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 4,
    borderRadius: 6,
    backgroundColor: '#F5F5F5',
    ...(Platform.OS === 'web' && {cursor: 'pointer' as any}),
  },
  focusModeText: {
    fontSize: 13,
    color: '#666',
  },
  focusModeDimmed: {
    opacity: 0,
    ...(Platform.OS === 'web' && {
      pointerEvents: 'none' as any,
      transition: 'opacity 0.2s ease',
    }),
  },
  platformIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5E5',
  },
  platformIndicatorText: {
    fontSize: 12,
    color: '#999',
  },
});
