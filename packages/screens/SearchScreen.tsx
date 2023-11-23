import {usePathname, useRouter} from 'next/navigation';
import {useQueryState} from 'next-usequerystate';
import {useCallback, useEffect, useState} from 'react';
import {FaSistrix} from 'react-icons/fa';
import {SlSocialSoundcloud, SlSocialYoutube} from 'react-icons/sl';
import {ActivityIndicator, Platform, Pressable, TextInput, View} from 'react-native';
import {AudioItem, LyristText} from '../components';
import {LYRIST_BLUE, QUERY_EXECUTED, SEARCH_RESULT_SELECTED} from '../constants';
import {usePagesContext} from '../context';
import {logFirebaseEvent} from '../firebase';
import {normalize} from '../utils';

export const AUDIO_PLATFORMS = ['YouTube', 'SoundCloud'];

export function SearchScreen() {
  /* STYLES */

  /* NAVIGATOR */
  const router = useRouter();
  const pathname = usePathname();

  /* STATE */
  const [selectedPlatform, setPlatform] = useQueryState('plat', {defaultValue: 'youtube'});
  const [q, setQ] = useQueryState('q', {defaultValue: ''});
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<Error | null>(null);
  const {findPageFromAudio} = usePagesContext();

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

  /* JSX */
  return (
    <View style={{flex: 1, gap: 8, paddingVertical: normalize(12)}}>
      <LyristText style={{paddingHorizontal: normalize(12)}} weight={'Medium'}>
        Search
      </LyristText>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          paddingHorizontal: normalize(12),
          maxHeight: normalize(50),
        }}>
        {AUDIO_PLATFORMS.map(platform => {
          const plat = platform.toLowerCase();
          const SocialIcon = plat === 'youtube' ? SlSocialYoutube : SlSocialSoundcloud;
          return (
            <Pressable
              key={plat}
              disabled={selectedPlatform === plat}
              onPress={() => setPlatform(plat)}
              style={{flexDirection: 'row', alignItems: 'center', marginRight: normalize(8)}}>
              <SocialIcon color={selectedPlatform === plat ? 'black' : 'gray'} size={20} />
              <LyristText
                style={[
                  // styles.exampleText,
                  {marginLeft: 8},
                  {color: selectedPlatform === plat ? 'black' : 'gray'},
                ]}>
                {platform}
              </LyristText>
            </Pressable>
          );
        })}
      </View>
      <View style={{flexDirection: 'row', gap: 8, paddingHorizontal: normalize(12)}}>
        {/* <Pressable onPress={() => executeQuery()}> */}
        <FaSistrix size={16} />
        {/* </Pressable> */}
        <TextInput
          defaultValue={q}
          onSubmitEditing={e => executeQuery(e.nativeEvent.text)}
          placeholder="What do you want to listen to?"
          placeholderTextColor={'gray'}
          style={[
            {flex: 1, fontFamily: 'Fira Sans'},
            Platform.OS === 'web' && ({outline: 'none'} as any),
          ]}
        />
      </View>
      <View style={{flex: 1, paddingBottom: normalize(48)}}>
        {searchResults.length > 0 ? (
          searchResults.map((item, index) => handleRenderItem({item, index}))
        ) : searchLoading ? (
          <ActivityIndicator color={LYRIST_BLUE} />
        ) : searchError ? (
          <LyristText>{searchError.message}</LyristText>
        ) : (
          <View style={{gap: 4, paddingHorizontal: normalize(12)}}>
            <LyristText>"genre" instrumentals</LyristText>
            <LyristText>"artist name" type beats</LyristText>
            <LyristText>"song name" lyrics</LyristText>
          </View>
        )}
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
    </View>
  );
}
