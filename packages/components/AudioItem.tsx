// import { useTheme } from "@react-navigation/native";
import {memo} from 'react';
import {Image, ListRenderItemInfo, StyleSheet, TouchableHighlight, View} from 'react-native';
import {SlPencil} from 'react-icons/sl';
// import SimpleLineIcon from "react-native-vector-icons/SimpleLineIcons";
// import { useStyles } from "../hooks";
import {useScale} from '../hooks/useScale';
import {Audio, Page} from '../types';
import {normalize} from '../utils';
import {LyristText} from './LyristText';

export type AudioItemProps = {
  audio: Audio;
  index: ListRenderItemInfo<typeof AudioItem>['index'];
  onPressItem: (id: Page['id'], audio: Audio) => void;
  pageId?: Page['id'];
  compact?: boolean;
};

export const AudioItem = memo(AudioItemUnmemoized);

export function AudioItemUnmemoized({index, onPressItem, pageId, audio, compact}: AudioItemProps) {
  const {large} = useScale();

  // Use compact sizing in two-panel mode, large sizing only in three-panel editor
  const useLargeSize = large && !compact;
  const imageWidth = useLargeSize ? 160 : normalize(70);
  const imageHeight = useLargeSize ? 90 : normalize(52.5);
  const fontSize = useLargeSize ? 15 : normalize(12);
  const padding = useLargeSize ? 16 : normalize(12);
  const paddingVertical = useLargeSize ? 12 : normalize(6);
  const channelSize = useLargeSize ? 20 : 16;

  const styles = StyleSheet.create({
    rowContainer: {
      flex: 1,
      // backgroundColor: colors.background,
      flexDirection: 'row',
      paddingHorizontal: padding,
      paddingVertical: paddingVertical,
    },
    image: {
      alignSelf: 'center',
      width: imageWidth,
      height: imageHeight,
      marginRight: large ? 16 : 10,
      borderRadius: large ? 8 : 4,
    },
    textContainer: {
      flex: 1,
      gap: large ? 6 : 4,
      justifyContent: 'center',
    },
    title: {
      // color: colors.text,
      color: 'black',
      fontSize: fontSize,
    },
    stats: {
      color: '#656565',
      fontSize: fontSize,
    },
    author: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: large ? 6 : 4,
    },
    channelThumbnail: {
      borderRadius: channelSize / 2,
      height: channelSize,
      width: channelSize,
    },
    authorName: {
      color: '#656565',
      fontSize: fontSize,
    },
  });
  //   const { colors } = useTheme();
  return (
    <TouchableHighlight
      testID="audio-item"
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
        {pageId && <SlPencil size={useLargeSize ? 20 : normalize(16)} color={'black'} />}
      </View>
    </TouchableHighlight>
  );
}
