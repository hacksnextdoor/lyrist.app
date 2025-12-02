import {useRouter, usePathname} from 'next/navigation';
import Link from 'next/link';
import {useQueryState} from 'next-usequerystate';
import {useState, useRef, useEffect, useCallback} from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  Platform,
  ActivityIndicator,
  Clipboard,
  Animated,
  Image,
} from 'react-native';
import ReactPlayer from 'react-player';
import {useDebouncedCallback} from 'use-debounce';
import {AudioItem, Editor, LyristText, PageItem} from '../components';
import {
  LYRICS_PAGE_ENTERED,
  LYRICS_PAGE_EXITED,
  LYRIST_BLUE,
  MAX_PAGES,
  TURQUOISE,
  QUERY_EXECUTED,
  SEARCH_RESULT_SELECTED,
  USER_SIGNED_OUT,
  LYRIST_PINK,
} from '../constants';
import {useAuthContext, usePagesContext} from '../context';
import {decrypt} from '../encryption';
import {logFirebaseEvent, PageManager} from '../firebase';
import auth from '../firebase/firebase-auth-web';
import database, {generateId} from '../firebase/firebase-database-web';
import {Audio, AudioPlatform, Page} from '../types';
import {inDevEnv, normalize} from '../utils';
import {useScale} from '../hooks/useScale';
import {FaSistrix} from 'react-icons/fa';
import {SlSocialSoundcloud, SlSocialYoutube} from 'react-icons/sl';

const AUDIO_PLATFORMS = ['YouTube', 'SoundCloud'];

function getUrl(platform: AudioPlatform, audioId: string) {
  return platform === 'soundcloud'
    ? `https://api.soundcloud.com/tracks/${audioId}`
    : `https://youtube.com/watch?v=${audioId}`;
}

export function PageScreen() {
  const {large} = useScale();
  const router = useRouter();
  const pathname = usePathname();

  /* QUERY STATE */
  const [audioStr, setAudio] = useQueryState('audio');
  const [pageId, setId] = useQueryState('id');
  const [source, setSource] = useQueryState('source');
  const [sourceId, setSourceId] = useQueryState('source-id');

  /* SEARCH STATE */
  const [selectedPlatform, setPlatform] = useQueryState('plat', {defaultValue: 'youtube'});
  const [q, setQ] = useQueryState('q', {defaultValue: ''});
  const [searchResults, setSearchResults] = useState<Audio[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<Error | null>(null);

  /* LIBRARY STATE */
  const [pageToDelete, setPageToDelete] = useState<Page | null>(null);
  const [copiedTitle, setCopiedTitle] = useState<string | null>(null);

  let url: string | null = null;
  let audio: Audio | null = null;

  if (source && sourceId) {
    url = getUrl(source as AudioPlatform, sourceId);
  }

  if (audioStr) {
    audio = JSON.parse(audioStr);
    if (audio) {
      url = getUrl(audio.platform, audio.id);
    }
  }

  const [playerLoading, setPlayerLoading] = useState(true);
  const [message, setMessage] = useState('player status');
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);

  const [body, setBody] = useState('');
  const [editorMessage, setEditorMessage] = useState('editor status');
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [editorLoading, setEditorLoading] = useState(true);
  const {hasPlus, user, userLoading, setOpenAuthModal} = useAuthContext();
  const {findPageFromPageId, findPageFromAudio, pages, pagesLoading, error} = usePagesContext();
  const pagesLeftBasicUser = Math.max(0, MAX_PAGES - (pages?.length ?? 0));
  const pagesToFilter = pages?.sort((a, b) => (a.dateLastModified > b.dateLastModified ? -1 : 1));

  /* REFS */
  const playerRef = useRef<ReactPlayer>(null);
  const editorRef = useRef<TextInput>(null);
  const lockEditor = useRef<boolean | null>(null);
  const animatedValues = useRef<Map<string, Animated.Value>>();

  if (pages) {
    animatedValues.current = new Map(pages.map(page => [page.id!, new Animated.Value(1)]));
  }

  let isInFreeSet = false;
  if (lockEditor.current == null && pages) {
    if (audioStr) {
      lockEditor.current = pages.length >= MAX_PAGES && !hasPlus;
    }
    if (pageId) {
      isInFreeSet = pages
        .sort((a, b) => (a.dateLastModified > b.dateLastModified ? -1 : 1))
        .slice(0, Math.min(MAX_PAGES, pages.length))
        .some(page => page.id === pageId);
      lockEditor.current = !hasPlus && !isInFreeSet;
    }
  }

  /* EVENTS */
  const handlePlay = () => setPlaying(true);
  const handlePause = () => setPlaying(false);

  const OPERATION_DELAY = 3000;
  const handleChangeTextDebounced = useDebouncedCallback(async text => {
    if (pageId && text.length === 0) {
      const currentPage = findPageFromPageId(pageId)!;
      const {audio} = currentPage;
      await PageManager.removePage(pageId);
      setEditorMessage('UNSAVED');
      setId(null);
      if (audio) {
        setAudio(JSON.stringify(audio));
        setSource(null);
        setSourceId(null);
      }
      return;
    }
    if (!pageId) {
      const newId = generateId();
      await PageManager.createPage(newId, audio, '', text);
      setEditorMessage('CREATED');
      setId(newId);
      if (audio) {
        setAudio(null);
        setSource(audio.platform);
        setSourceId(audio.id);
      }
      return;
    }
    await PageManager.updatePage(pageId, text);
    setEditorMessage('UPDATED');
  }, OPERATION_DELAY);

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
      const pageResult = findPageFromAudio(item.id);
      const existingPageId = pageResult?.id ?? null;
      logFirebaseEvent(SEARCH_RESULT_SELECTED, {title: item.title});

      // Always set source and sourceId so url is computed
      setSource(item.platform);
      setSourceId(item.id);

      if (existingPageId) {
        // Existing page - navigate to it
        setId(existingPageId);
        setAudio(null);
      } else {
        // New audio - set audio state for editor
        setAudio(JSON.stringify(item));
        setId(null);
      }
    },
    [findPageFromAudio, setId, setSource, setSourceId, setAudio],
  );

  const handleSelectPage = useCallback(
    (item: Page) => {
      setId(item.id!);
      if (item.audio) {
        setSource(item.audio.platform);
        setSourceId(item.audio.id);
      }
      setAudio(null);
    },
    [setId, setSource, setSourceId, setAudio],
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
      handleChangeTextDebounced.flush();
      logFirebaseEvent(LYRICS_PAGE_EXITED);
    };
  }, []);

  useEffect(() => {
    if (!user) {
      setEditorMessage('user has not synced');
      setEditorLoading(false);
      return;
    }
    let ref = database().ref(`pages/${pageId}/body`);
    const onValue = snapshot => {
      if (snapshot && snapshot.val()) {
        setBody(decrypt(snapshot.val()));
      } else {
        setBody('');
      }
      if (editorLoading) setEditorLoading(false);
      setEditorMessage('synced body with database');
    };
    const onError = (a: Error) => {
      setEditorMessage(a.message);
      if (editorLoading) setEditorLoading(false);
    };
    ref.on('value', onValue, onError);
    return () => ref.off('value', onValue);
  }, [editorLoading, user, pageId]);

  useEffect(() => {
    if (playerLoading) setPlayerLoading(false);
  }, [playerLoading]);

  useEffect(() => {
    const localSearch = window.localStorage.getItem('search');
    if (localSearch) {
      const parsed = JSON.parse(localSearch);
      setSearchResults(parsed.results || []);
      if (parsed.q) setQ(parsed.q);
      if (parsed.plat) setPlatform(parsed.plat);
    }
  }, []);

  /* RENDER PANELS */
  const renderLibraryPanel = () => (
    <View style={styles.panel}>
      <View style={styles.panelHeader}>
        <LyristText weight="Medium" style={styles.panelTitle}>
          My Library
        </LyristText>
        {!hasPlus && user && (
          <LyristText style={styles.pagesLeft} onPress={() => router.push('/pricing')}>
            {pagesLeftBasicUser} left
          </LyristText>
        )}
      </View>
      <ScrollView
        style={styles.panelContent}
        showsVerticalScrollIndicator={false}
        {...(Platform.OS === 'web' && ({className: 'pagescreen-panel-scroll'} as any))}>
        {pagesLoading ? (
          <ActivityIndicator color={LYRIST_BLUE} style={{marginTop: 20}} />
        ) : !user ? (
          <LyristText style={styles.emptyText} onPress={() => setOpenAuthModal(true)}>
            Sign in to see your library
          </LyristText>
        ) : error ? (
          <LyristText style={styles.emptyText}>{error.message}</LyristText>
        ) : pagesToFilter && pagesToFilter.length > 0 ? (
          pagesToFilter.map((item, index) => (
            <Pressable
              key={item.id}
              onPress={() => handleSelectPage(item)}
              style={[styles.libraryItem, pageId === item.id && styles.libraryItemActive]}>
              <LyristText
                weight={pageId === item.id ? 'Medium' : 'Regular'}
                style={styles.libraryItemTitle}
                numberOfLines={1}>
                {item.title || 'Untitled'}
              </LyristText>
              <LyristText style={styles.libraryItemDate} numberOfLines={1}>
                {new Date(item.dateLastModified).toLocaleDateString()}
              </LyristText>
            </Pressable>
          ))
        ) : (
          <LyristText style={styles.emptyText}>Search for audio to start writing</LyristText>
        )}
      </ScrollView>
    </View>
  );

  const renderEditorPanel = () => (
    <View style={[styles.panel, styles.editorPanel]}>
      {inDevEnv() && (
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
        ) : lockEditor.current ? (
          <Pressable onPress={() => router.push('/pricing')} style={styles.lockedBanner}>
            <LyristText style={styles.lockedText}>Get Lyrist Plus for unlimited pages</LyristText>
          </Pressable>
        ) : user == null ? (
          <Pressable onPress={() => setOpenAuthModal(true)} style={styles.signInBanner}>
            <LyristText style={styles.signInText}>Sign in to use the editor</LyristText>
          </Pressable>
        ) : !url ? (
          <View style={styles.noAudioMessage}>
            <LyristText style={styles.noAudioText}>
              Select audio from search to start writing
            </LyristText>
          </View>
        ) : (
          <Editor
            color={'black'}
            inputAccessoryViewID={'PageScreen'}
            onChangeText={(text: string) => {
              setEditorMessage('TYPING');
              if (!lockEditor.current && !hasPlus && text.length > 10000) {
                editorRef.current?.blur();
                setShowSizeModal(true);
                return;
              }
              handleChangeTextDebounced(text);
            }}
            placeholder={'Start typing your lyrics...'}
            ref={editorRef}
            text={body}
          />
        )}
      </View>
    </View>
  );

  const renderSearchPanel = () => (
    <View style={styles.panel}>
      <View style={styles.platformTabs}>
        {AUDIO_PLATFORMS.map(platform => {
          const plat = platform.toLowerCase();
          const isSelected = selectedPlatform === plat;
          const SocialIcon = plat === 'youtube' ? SlSocialYoutube : SlSocialSoundcloud;
          return (
            <Pressable
              key={plat}
              onPress={() => setPlatform(plat)}
              style={[styles.platformTab, isSelected && styles.platformTabActive]}>
              <SocialIcon color={isSelected ? 'white' : '#666'} size={16} />
              <LyristText style={[styles.platformText, isSelected && styles.platformTextActive]}>
                {platform}
              </LyristText>
            </Pressable>
          );
        })}
      </View>
      <View style={styles.searchInputWrapper}>
        <FaSistrix size={14} color="#999" />
        <TextInput
          defaultValue={q}
          onSubmitEditing={e => executeQuery(e.nativeEvent.text)}
          placeholder="Artist, genre, or song..."
          placeholderTextColor="#999"
          style={styles.searchInput}
        />
      </View>
      <ScrollView style={styles.panelContent} showsVerticalScrollIndicator={false}>
        {searchLoading ? (
          <ActivityIndicator color={LYRIST_BLUE} style={{marginTop: 20}} />
        ) : searchError ? (
          <LyristText style={styles.emptyText}>{searchError.message}</LyristText>
        ) : searchResults.length > 0 ? (
          searchResults.map((item, index) => {
            const isCurrentlyPlaying = sourceId === item.id;
            return (
              <View
                key={index}
                style={[
                  styles.audioItemWrapper,
                  isCurrentlyPlaying && styles.audioItemWrapperActive,
                ]}>
                <AudioItem
                  audio={item}
                  index={index}
                  onPressItem={() => handleSelectAudio(item)}
                  pageId={findPageFromAudio(item.id)?.id ?? null}
                />
              </View>
            );
          })
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

  /* MAIN RENDER */
  if (large) {
    return (
      <View style={styles.container}>
        {/* Top Header Bar */}
        <View style={styles.topHeader}>
          <Link href="/" style={styles.logoWrapper}>
            <img src="/logo-black.png" alt="Lyrist" style={{height: 28, width: 'auto'}} />
          </Link>
          <View style={styles.headerRight}>
            {user ? (
              <Pressable
                onPress={async () => {
                  await auth().signOut();
                  window.localStorage.clear();
                  logFirebaseEvent(USER_SIGNED_OUT);
                  router.push('/');
                }}
                style={styles.signOutButton}>
                <LyristText style={styles.signOutText}>Sign out</LyristText>
              </Pressable>
            ) : (
              <Pressable onPress={() => setOpenAuthModal(true)} style={styles.signInButton}>
                <LyristText style={styles.signInButtonText}>Sign in</LyristText>
              </Pressable>
            )}
          </View>
        </View>
        {/* Three Panel Layout */}
        <View style={styles.threePanel}>
          {renderLibraryPanel()}
          <View style={styles.divider} />
          {renderEditorPanel()}
          <View style={styles.divider} />
          {renderSearchPanel()}
        </View>
        {/* Modals */}
        <Modal animationType="fade" transparent visible={!!showSizeModal}>
          <Pressable onPress={() => setShowSizeModal(false)} style={styles.modalOverlay} />
          <View style={styles.modalCard}>
            <LyristText weight="SemiBold">Character limit exceeded</LyristText>
            <LyristText>Get Plus for unlimited pages!</LyristText>
            <View style={styles.modalButtons}>
              <LyristText onPress={() => setShowSizeModal(false)}>No thanks</LyristText>
              <LyristText
                onPress={() => {
                  setShowSizeModal(false);
                  router.push('/pricing');
                }}>
                Get Plus
              </LyristText>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  // Small/Medium screens - single column, use existing nav
  return (
    <View style={styles.containerMobile}>
      <View style={styles.mobileContent}>
        {url ? (
          <>
            <View style={styles.playerWrapperMobile}>
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
            <View style={styles.editorWrapperMobile}>
              {editorLoading || pagesLoading || userLoading ? (
                <ActivityIndicator color={LYRIST_BLUE} />
              ) : lockEditor.current ? (
                <Pressable onPress={() => router.push('/pricing')} style={styles.lockedBanner}>
                  <LyristText style={styles.lockedText}>Get Lyrist Plus</LyristText>
                </Pressable>
              ) : user == null ? (
                <Pressable onPress={() => setOpenAuthModal(true)} style={styles.signInBanner}>
                  <LyristText style={styles.signInText}>Sign in to use the editor</LyristText>
                </Pressable>
              ) : (
                <Editor
                  color={'black'}
                  inputAccessoryViewID={'PageScreen'}
                  onChangeText={(text: string) => {
                    setEditorMessage('TYPING');
                    if (!lockEditor.current && !hasPlus && text.length > 10000) {
                      editorRef.current?.blur();
                      setShowSizeModal(true);
                      return;
                    }
                    handleChangeTextDebounced(text);
                  }}
                  placeholder={'Start typing your lyrics...'}
                  ref={editorRef}
                  text={body}
                />
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
      </View>
      <Modal animationType="fade" transparent visible={!!showSizeModal}>
        <Pressable onPress={() => setShowSizeModal(false)} style={styles.modalOverlay} />
        <View style={styles.modalCard}>
          <LyristText weight="SemiBold">Character limit exceeded</LyristText>
          <LyristText>Get Plus for unlimited pages!</LyristText>
          <View style={styles.modalButtons}>
            <LyristText onPress={() => setShowSizeModal(false)}>No thanks</LyristText>
            <LyristText
              onPress={() => {
                setShowSizeModal(false);
                router.push('/pricing');
              }}>
              Get Plus
            </LyristText>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  containerMobile: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  logoWrapper: {
    padding: 4,
  },
  logo: {
    width: 32,
    height: 32,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
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
  panel: {
    flex: 1,
    backgroundColor: '#FFF',
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
  pagesLeft: {
    fontSize: 12,
    color: TURQUOISE,
  },
  panelContent: {
    flex: 1,
    paddingHorizontal: 8,
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
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
    maxHeight: 220,
  },
  editorWrapper: {
    flex: 1,
  },
  editorWrapperMobile: {
    flex: 1,
  },
  lockedBanner: {
    backgroundColor: TURQUOISE,
    paddingVertical: 12,
    alignItems: 'center',
  },
  lockedText: {
    color: 'white',
  },
  signInBanner: {
    backgroundColor: LYRIST_BLUE,
    paddingVertical: 12,
    alignItems: 'center',
  },
  signInText: {
    color: 'white',
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
    backgroundColor: LYRIST_PINK,
  },
  platformText: {
    fontSize: 13,
    color: '#666',
  },
  platformTextActive: {
    color: 'white',
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
});
