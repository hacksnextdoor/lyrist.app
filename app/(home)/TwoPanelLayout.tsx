'use client';
import {useState, useEffect, useCallback, useRef, Suspense} from 'react';
import {View, StyleSheet, TextInput, Pressable, ScrollView, ActivityIndicator, Platform} from 'react-native';
import Image from 'next/image';
import Link from 'next/link';
import {useRouter, useSearchParams} from 'next/navigation';
import {useQueryState} from 'next-usequerystate';
import {FaSistrix} from 'react-icons/fa';
import {SlSocialSoundcloud, SlSocialYoutube} from 'react-icons/sl';
import {useScale} from '../../packages/hooks/useScale';
import {MyLibraryScreen} from '../../packages/screens/MyLibraryScreen';
import {AudioItem, LyristText, PlusButton} from '../../packages/components';
import {useAuthContext, usePagesContext} from '../../packages/context';
import {logFirebaseEvent} from '../../packages/firebase';
import auth from '../../packages/firebase/firebase-auth-web';
import {LYRIST_BLUE, QUERY_EXECUTED, SEARCH_RESULT_SELECTED, USER_SIGNED_OUT} from '../../packages/constants';
import {Audio} from '../../packages/types';

const AUDIO_PLATFORMS = ['YouTube', 'SoundCloud'];

// Inner component that uses useSearchParams - must be wrapped in Suspense
function TwoPanelLayoutInner() {
  const {large} = useScale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const {hasPlus, user, userLoading, setOpenAuthModal, setOpenPricingModal} = useAuthContext();
  const {findPageFromAudio} = usePagesContext();

  // Mounted state to avoid hydration mismatch for auth-dependent UI
  const [mounted, setMounted] = useState(false);

  // Search state
  const [selectedPlatform, setPlatform] = useQueryState('plat', {defaultValue: 'youtube'});
  const [q, setQ] = useQueryState('q', {defaultValue: ''});
  const [searchResults, setSearchResults] = useState<Audio[]>([]);
  const [resultsPlatform, setResultsPlatform] = useState<string | null>(null); // Platform used for current results
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<Error | null>(null);

  // Responsive sidebar width
  const sidebarWidth = large ? 380 : 280;

  // Track what query we've loaded to prevent duplicate fetches
  const loadedQueryRef = useRef<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Load search results on mount - from URL params first, then localStorage
  useEffect(() => {
    if (!mounted) return;

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
  }, [mounted, searchParams, setQ, setPlatform]);

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

  const handleSelectAudio = useCallback((item: Audio) => {
    const pageResult = findPageFromAudio(item.id);
    const pageId = pageResult?.id ?? null;
    logFirebaseEvent(SEARCH_RESULT_SELECTED, {title: item.title});

    const editorUrl = `/editor?${new URLSearchParams(
      pageId
        ? {id: pageId, source: item.platform, ['source-id']: item.id}
        : {audio: `${item.platform === 'soundcloud' ? 'sc' : 'yt'}:${item.id}`},
    ).toString()}`;
    router.push(editorUrl);
  }, [findPageFromAudio, router]);

  return (
    <View style={styles.container}>
      {/* Top Header with Search - search aligned with second panel */}
      <View style={styles.topHeader}>
        {/* Logo section takes same width as sidebar */}
        <View style={[styles.headerLogoSection, {width: sidebarWidth}]}>
          <Link href="/" style={styles.headerLogo}>
            <Image src="/logo-black.png" width={28} height={28} alt="Lyrist" />
          </Link>
        </View>
        {/* Search section aligned with main content */}
        <View style={styles.headerMainSection}>
          <View style={styles.headerSearchInputWrapper}>
            <FaSistrix size={14} color="#999" />
            <TextInput
              autoFocus
              defaultValue={q}
              onSubmitEditing={e => executeQuery(e.nativeEvent.text)}
              placeholder="Search for audio..."
              placeholderTextColor="#999"
              style={styles.headerSearchInput}
            />
          </View>
          {/* Auth section - only render after mount */}
          {!mounted || userLoading ? (
            <View style={styles.authPlaceholder} />
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
      {/* Two Panel Content */}
      <View style={styles.panelsContainer}>
        {/* Floating Library sidebar */}
        <View style={[styles.sidebarWrapper, {width: sidebarWidth}]}>
          <View style={styles.sidebar}>
            <MyLibraryScreen panelMode />
          </View>
        </View>
        {/* Search Results */}
        <View style={styles.mainContent}>
          <View style={styles.resultsHeader}>
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
          <ScrollView style={styles.resultsScroll} contentContainerStyle={styles.resultsContent}>
            {searchLoading ? (
              <ActivityIndicator color={LYRIST_BLUE} style={{marginTop: 20}} />
            ) : searchError ? (
              <LyristText style={styles.errorText}>{searchError.message}</LyristText>
            ) : searchResults.length > 0 ? (
              <>
                {resultsPlatform && (
                  <View style={styles.platformIndicator}>
                    {resultsPlatform === 'youtube' ? (
                      <SlSocialYoutube color="#999" size={12} />
                    ) : (
                      <SlSocialSoundcloud color="#999" size={12} />
                    )}
                    <LyristText style={styles.platformIndicatorText}>
                      {searchResults.length} {resultsPlatform === 'youtube' ? 'YouTube' : 'SoundCloud'} result{searchResults.length !== 1 ? 's' : ''}
                    </LyristText>
                  </View>
                )}
                {searchResults.map((item, index) => (
                  <AudioItem
                    key={index}
                    audio={item}
                    index={index}
                    compact
                    onPressItem={() => handleSelectAudio(item)}
                    pageId={findPageFromAudio(item.id)?.id ?? null}
                  />
                ))}
              </>
            ) : (
              <View style={styles.emptyState}>
                <LyristText weight="Medium" style={styles.hintsTitle}>Try searching for</LyristText>
                <LyristText style={styles.hintText}>"lo-fi" type beats</LyristText>
                <LyristText style={styles.hintText}>"drake" instrumentals</LyristText>
                <LyristText style={styles.hintText}>"song name" lyrics</LyristText>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

// Export wrapper with Suspense for useSearchParams
export function TwoPanelLayout() {
  return (
    <Suspense fallback={<View style={styles.container}><ActivityIndicator color={LYRIST_BLUE} /></View>}>
      <TwoPanelLayoutInner />
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
  headerLogoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  headerLogo: {
    padding: 4,
    display: 'flex',
    alignItems: 'center',
  },
  headerMainSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 16,
  },
  authPlaceholder: {
    width: 120,
    height: 32,
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
  panelsContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebarWrapper: {
    padding: 12,
    overflow: 'hidden',
  },
  sidebar: {
    flex: 1,
    backgroundColor: '#F5F5F7',
    borderRadius: 12,
    overflow: 'hidden',
    minHeight: 0,
  },
  mainContent: {
    flex: 1,
    backgroundColor: '#FFF',
    overflow: 'hidden',
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
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
  resultsScroll: {
    flex: 1,
    minHeight: 0,
  },
  resultsContent: {
    paddingBottom: 48,
  },
  errorText: {
    color: '#666',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  emptyState: {
    paddingHorizontal: 16,
    paddingTop: 24,
    gap: 8,
  },
  hintsTitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  hintText: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
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
