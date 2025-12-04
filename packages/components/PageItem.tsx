import {memo} from 'react';
import {SlShare, SlSocialSoundcloud, SlSocialYoutube, SlTrash} from 'react-icons/sl';
import {
  Animated,
  ImageBackground,
  ListRenderItemInfo,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import {decrypt} from '../encryption/crypt';
import {getFormattedDate, normalize} from '../utils';
import {LyristText} from './LyristText';
import {Page} from '../types';

export type PageItemProps = {
  animatedValue?: Animated.Value;
  index: ListRenderItemInfo<typeof PageItem>['index'];
  onDelete: () => void;
  onShare: () => void;
  onPressItem: (page: Page, index: number) => void;
  page: Page;
};

export const PAGE_ITEM_HEIGHT = 75;

export const PageItem = memo(PageItemUnmemoized);

export function PageItemUnmemoized({
  animatedValue,
  index,
  onDelete,
  onShare,
  onPressItem,
  page,
}: PageItemProps) {
  const styles = StyleSheet.create({
    rowContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      // height: PAGE_ITEM_HEIGHT,
      // backgroundColor: colors.background,
      paddingVertical: normalize(12),
      paddingHorizontal: normalize(12),
    },
    dot: {alignSelf: 'center', marginRight: normalize(8)},
    audioView: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    overlay: {
      backgroundColor: 'rgba(0,0,0,0.4)',
      borderRadius: 5,
      minHeight: normalize(40),
      alignItems: 'center',
      justifyContent: 'center',
    },
    meta: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'flex-start',
      marginHorizontal: 8,
    },
    image: {
      width: normalize(40),
      height: normalize(40),
    },
    title: {
      // color: colors.text,
      fontSize: normalize(12),
    },
    preView: {flexDirection: 'row'},
    lyrics: {
      flex: 1,
      color: '#656565',
      fontSize: normalize(12),
    },
    dateModified: {
      color: '#656565',
      fontSize: normalize(12),
      paddingRight: 8,
    },
  });

  return (
    <Pressable
      onPress={() => onPressItem(page, index)}
      testID="page-item"
      // underlayColor={"#AAAAAA"}
    >
      <Animated.View
        style={{
          height: animatedValue?.interpolate({
            inputRange: [0, 1],
            outputRange: [0, PAGE_ITEM_HEIGHT],
          }),
        }}>
        <View style={styles.rowContainer}>
          {page.audio && (
            <View style={styles.audioView}>
              <ImageBackground
                borderRadius={4}
                style={styles.image}
                source={{
                  uri: page.audio.img_url ?? `https://i.ytimg.com/vi/${page.audio.id}/default.jpg`,
                }}>
                <View style={styles.overlay}>
                  {page.audio.platform === 'soundcloud' ? (
                    <SlSocialSoundcloud color={'white'} size={20} />
                  ) : (
                    <SlSocialYoutube color={'white'} size={20} />
                  )}
                </View>
              </ImageBackground>
            </View>
          )}
          <View style={styles.meta}>
            <LyristText style={styles.title} numberOfLines={2}>
              {page.title}
            </LyristText>
            <View style={styles.preView}>
              <LyristText style={styles.dateModified}>
                {getFormattedDate(page.dateLastModified)}
              </LyristText>
              <LyristText style={styles.lyrics} numberOfLines={1} ellipsizeMode={'tail'}>
                {decrypt(page.preview)}
              </LyristText>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              paddingVertical: normalize(8),
              gap: 16,
              alignSelf: 'center',
            }}>
            <Pressable onPress={() => onShare()}>
              <SlShare size={20} />
            </Pressable>
            <Pressable onPress={() => onDelete()}>
              <SlTrash size={20} />
            </Pressable>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}
