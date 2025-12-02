// import { useTheme } from "@react-navigation/native";
import {memo} from 'react';
import {Image, ListRenderItemInfo, StyleSheet, TouchableHighlight, View} from 'react-native';
import {SlPencil} from 'react-icons/sl';
// import SimpleLineIcon from "react-native-vector-icons/SimpleLineIcons";
// import { useStyles } from "../hooks";
import {Audio, Page} from '../types';
import {normalize} from '../utils';
import {LyristText} from './LyristText';

export type AudioItemProps = {
  audio: Audio;
  index: ListRenderItemInfo<typeof AudioItem>['index'];
  onPressItem: (id: Page['id'], audio: Audio) => void;
  pageId?: Page['id'];
};

export const AudioItem = memo(AudioItemUnmemoized);

export function AudioItemUnmemoized({index, onPressItem, pageId, audio}: AudioItemProps) {
  const styles = StyleSheet.create({
    rowContainer: {
      flex: 1,
      // backgroundColor: colors.background,
      flexDirection: 'row',
      paddingHorizontal: normalize(12),
      paddingVertical: normalize(6),
    },
    image: {
      alignSelf: 'center',
      width: normalize(70),
      height: normalize(52.5),
      marginRight: 10,
    },
    textContainer: {
      flex: 1,
      gap: 4,
    },
    title: {
      // color: colors.text,
      color: 'black',
      fontSize: normalize(12),
    },
    stats: {
      color: '#656565',
      fontSize: normalize(12),
    },
    author: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: 4,
    },
    channelThumbnail: {
      borderRadius: 16 / 2,
      height: 16,
      width: 16,
    },
    authorName: {
      color: '#656565',
      fontSize: normalize(12),
    },
  });
  //   const { colors } = useTheme();
  return (
    <TouchableHighlight
      testID={`AudioItem${index}`}
      onPress={() => onPressItem(pageId ?? null, audio)}
      underlayColor="#AAAAAA">
      <View style={styles.rowContainer}>
        <Image style={styles.image} source={{uri: audio.img_url}} />
        <View style={styles.textContainer}>
          <LyristText style={styles.title} numberOfLines={2}>
            {audio.title}
          </LyristText>
          <LyristText style={styles.stats} numberOfLines={1}>
            {audio.viewCount === 0
              ? ''
              : `${audio.viewCount} ${audio.platform === 'youtube' ? 'views' : 'plays'} · `}
            {audio.dateUploaded} ago
          </LyristText>
          <View style={styles.author}>
            {audio.channelThumbnail && (
              <Image style={styles.channelThumbnail} source={{uri: audio.channelThumbnail}} />
            )}
            <LyristText style={styles.authorName} numberOfLines={1}>
              {audio.publisher}
            </LyristText>
          </View>
        </View>
        {pageId && <SlPencil size={normalize(16)} color={'black'} />}
      </View>
    </TouchableHighlight>
  );
}
