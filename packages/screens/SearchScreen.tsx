import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {useQueryState} from 'next-usequerystate';
import {useCallback, useEffect, useState} from 'react';
import {FaCheck, FaSistrix} from 'react-icons/fa';
import {SlSocialSoundcloud, SlSocialYoutube} from 'react-icons/sl';
import {
  ActivityIndicator,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import {AudioItem, LyristText} from '../components';
import {LYRIST_BLUE, QUERY_EXECUTED, SEARCH_RESULT_SELECTED, TURQUOISE} from '../constants';
import {useAuthContext, usePagesContext} from '../context';
import {logFirebaseEvent} from '../firebase';
import {normalize} from '../utils';

export const AUDIO_PLATFORMS = ['YouTube', 'SoundCloud'];
const PLUS_FEATURES = [
  'Unlimited pages',
  'Unlimited AI-powered suggestions',
  'Organize your work with folders',
  'Record your ideas (soon)',
  'LyrAssist (soon)',
  'Lyrist Connect (soon)',
];

export function SearchScreen() {
  /* STYLES */

  /* NAVIGATOR */
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  /* STATE */
  const [selectedPlatform, setPlatform] = useQueryState('plat', {defaultValue: 'youtube'});
  const [q, setQ] = useQueryState('q', {defaultValue: ''});
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<Error | null>(null);
  const {findPageFromAudio} = usePagesContext();
  const {user, setPlusStatus} = useAuthContext();
  const checkoutSessionId = searchParams.get('checkout-session-id');
  const searchParamsString = searchParams.toString();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [subscriptionActive, setSubscriptionActive] = useState(false);
  const [activationError, setActivationError] = useState<string | null>(null);

  /* REFS */

  /* EVENTS */
  const executeQuery = async (query: string) => {
    const trimmedQuery = query.trim();
    if (trimmedQuery.length > 0) {
      try {
        setSearchLoading(true);
        const searchPath = `/api${pathname}?${new URLSearchParams({
          q: trimmedQuery,
          plat: selectedPlatform,
        }).toString()}`;
        let data = await fetch(searchPath, {cache: 'no-store'});
        let json = await data.json();
        setQ(trimmedQuery);
        setSearchResults(json);
        // temporary solution in favor of some variant of redux
        logFirebaseEvent(QUERY_EXECUTED, {query: trimmedQuery});
        window.localStorage.setItem(
          'search',
          JSON.stringify({
            results: json,
            q: trimmedQuery,
            plat: selectedPlatform,
          }),
        );
        setSearchError(null);
      } catch (e) {
        setSearchError(e);
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }
  };

  const handleRenderItem = useCallback(({item, index}) => {
    const pageResult = findPageFromAudio(item.id);
    const pageId = pageResult?.id ?? null;
    return (
      <AudioItem
        key={index}
        audio={item}
        index={index}
        onPressItem={() => {
          const editorUrl = `/editor?${new URLSearchParams(
            pageId
              ? {
                  id: pageId,
                  source: item.platform,
                  ['source-id']: item.id,
                }
              : {audio: JSON.stringify(item)},
          ).toString()}`;
          const {title} = item;
          logFirebaseEvent(SEARCH_RESULT_SELECTED, {title});
          router.push(editorUrl);
        }}
        pageId={pageId}
      />
    );
  }, []);

  /* EFFECTS */
  useEffect(() => {
    const localSearch = window.localStorage.getItem('search');
    if (localSearch) {
      const parsedLocalSearch = JSON.parse(localSearch);
      setSearchResults(parsedLocalSearch.results);
      setQ(parsedLocalSearch.q);
      setPlatform(parsedLocalSearch.plat);
    }
  }, []);

  useEffect(() => {
    if (!checkoutSessionId || !user) {
      return;
    }

    let cancelled = false;
    setShowSuccessModal(true);
    setSubscriptionActive(false);
    setActivationError(null);

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    const confirmActivation = async () => {
      try {
        const maxAttempts = 5;
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
          const response = await fetch(`/api/plus/${user.uid}`, {
            cache: 'no-store',
          });
          if (!response.ok) {
            throw new Error('Activation status check failed');
          }
          const hasPlus = await response.json();
          if (hasPlus) {
            await setPlusStatus(user.uid);
            if (!cancelled) {
              setSubscriptionActive(true);
            }
            return;
          }
          await delay(2000);
        }
        throw new Error('Subscription still activating');
      } catch (error) {
        console.error('Failed to confirm subscription after checkout:', error);
        if (!cancelled) {
          setActivationError('We are still finalizing your subscription. Please try again.');
        }
      } finally {
        if (!cancelled) {
          const params = new URLSearchParams(searchParamsString);
          params.delete('checkout-session-id');
          const nextQuery = params.toString();
          router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname);
        }
      }
    };

    confirmActivation();
    return () => {
      cancelled = true;
    };
  }, [checkoutSessionId, pathname, router, searchParamsString, setPlusStatus, user]);

  /* JSX */
  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.platformTabs}>
          {AUDIO_PLATFORMS.map(platform => {
            const plat = platform.toLowerCase();
            const isSelected = selectedPlatform === plat;
            const SocialIcon = plat === 'youtube' ? SlSocialYoutube : SlSocialSoundcloud;
            return (
              <Pressable
                key={plat}
                disabled={isSelected}
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
            autoFocus
            defaultValue={q}
            onSubmitEditing={e => executeQuery(e.nativeEvent.text)}
            placeholder="What do you want to listen to?"
            placeholderTextColor="#999"
            style={styles.searchInput}
          />
        </View>
        <View style={styles.resultsContainer}>
          {searchResults.length > 0 ? (
            searchResults.map((item, index) => handleRenderItem({item, index}))
          ) : searchLoading ? (
            <ActivityIndicator color={LYRIST_BLUE} style={{marginTop: 20}} />
          ) : searchError ? (
            <LyristText style={styles.errorText}>{searchError.message}</LyristText>
          ) : (
            <View style={styles.searchHints}>
              <LyristText style={styles.hintText}>"genre" instrumentals</LyristText>
              <LyristText style={styles.hintText}>"artist name" type beats</LyristText>
              <LyristText style={styles.hintText}>"song name" lyrics</LyristText>
            </View>
          )}
        </View>
      </View>
      {/* <FlatList<Audio>
        data={searchResults}
        renderItem={handleRenderItem}
        ListEmptyComponent={
          <View style={{paddingHorizontal: normalize(12)}}>
            <LyristText>"genre" instrumentals</LyristText>
            <LyristText>"artist name" type beats</LyristText>
            <LyristText>"song name" lyrics</LyristText>
          </View>
        }
      /> */}
      <Modal transparent visible={showSuccessModal} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.successCard}>
            {subscriptionActive ? (
              <>
                <View style={styles.successHeading}>
                  <View style={styles.successIcon}>
                    <FaCheck color={TURQUOISE} size={20} />
                  </View>
                  <LyristText style={styles.successTitle} weight="Medium">
                    Success!
                  </LyristText>
                </View>
                <LyristText style={styles.successSubtitle}>
                  Your subscription is now active. Here is everything you just unlocked:
                </LyristText>
                <View style={styles.featureList}>
                  {PLUS_FEATURES.map(feature => (
                    <View key={feature} style={styles.featureRow}>
                      <FaCheck color={TURQUOISE} size={14} />
                      <LyristText style={styles.featureText}>{feature}</LyristText>
                    </View>
                  ))}
                </View>
                <Pressable style={styles.successButton} onPress={() => setShowSuccessModal(false)}>
                  <LyristText style={styles.successButtonText} weight="Medium">
                    Ok, thanks
                  </LyristText>
                </Pressable>
              </>
            ) : activationError ? (
              <>
                <LyristText style={styles.successTitle} weight="Medium">
                  Still activating your subscription
                </LyristText>
                <LyristText style={styles.errorSubtitle}>{activationError}</LyristText>
                <Pressable style={styles.successButton} onPress={() => setShowSuccessModal(false)}>
                  <LyristText style={styles.successButtonText} weight="Medium">
                    Close
                  </LyristText>
                </Pressable>
              </>
            ) : (
              <>
                <LyristText style={styles.successTitle} weight="Medium">
                  Activating your subscription...
                </LyristText>
                <LyristText style={styles.successSubtitle}>
                  This usually takes just a moment.
                </LyristText>
                <ActivityIndicator color={LYRIST_BLUE} />
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  innerContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 600,
    gap: 8,
  },
  title: {
    paddingHorizontal: normalize(12),
    fontSize: 16,
  },
  platformTabs: {
    flexDirection: 'row',
    paddingHorizontal: normalize(12),
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
    backgroundColor: LYRIST_BLUE,
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
    marginHorizontal: normalize(12),
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
  resultsContainer: {
    flex: 1,
    paddingBottom: normalize(48),
  },
  errorText: {
    color: '#666',
    paddingHorizontal: normalize(12),
  },
  searchHints: {
    paddingHorizontal: normalize(16),
    gap: 4,
  },
  hintText: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: normalize(24),
  },
  successCard: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 24,
    backgroundColor: 'white',
    padding: normalize(24),
    gap: 12,
    alignItems: 'center',
  },
  successHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  successIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(64,214,195,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: {
    fontSize: 28,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 18,
    textAlign: 'center',
    opacity: 0.8,
  },
  errorSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.8,
  },
  featureList: {
    width: '100%',
    gap: 12,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    flex: 1,
    fontSize: 16,
  },
  successButton: {
    marginTop: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 999,
    backgroundColor: TURQUOISE,
  },
  successButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
