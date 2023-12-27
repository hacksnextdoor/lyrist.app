import Link from 'next/link';
import {useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import YouTube from 'react-youtube';
import {useScale} from '../hooks';
import {Badges} from './Badges';
import {LYRIST_BLUE} from '../packages/constants';
import {LyristText} from '../packages/components';

const onPlayerReady = event => {
  // access to player in all event handlers via event.target
  event.target.pauseVideo();
};

const opts = {
  height: '100%',
  width: '100%',
  playerVars: {
    // https://developers.google.com/youtube/player_parameters
    autoplay: 0,
    cc_load_policy: 1,
  },
};

export function Main() {
  const {small, medium} = useScale();
  const [line0, setLine0] = useState(false);
  return (
    <View style={styles.section}>
      <View style={[styles.subSection, medium && {flexDirection: 'column'}]}>
        <View
          style={[
            styles.leftContent,
            medium && {width: '100%', alignItems: 'center'},
            small && {gap: 24},
          ]}>
          <LyristText style={[styles.title, small && {fontSize: 32, textAlign: 'center'}]}>
            The{' '}
            <Link role="link" href={'#features'} style={{textDecoration: 'none'}}>
              <Pressable onHoverIn={() => setLine0(true)} onHoverOut={() => setLine0(false)}>
                <LyristText
                  style={[
                    styles.title,
                    {color: LYRIST_BLUE},
                    small && {fontSize: 32},
                    line0 && {textDecorationLine: 'underline'},
                  ]}>
                  all-in-one
                </LyristText>
              </Pressable>
            </Link>{' '}
            toolkit for songwriters
          </LyristText>
          <Text style={[styles.subtitle, small && {fontSize: 16, textAlign: 'center'}]}>
            Discover beats, write lyrics, find rhymes, cure your writer's block, and share content
            without tedious app switching!
          </Text>
          <Badges />
        </View>
        <View
          style={[
            styles.rightContent,
            medium && {width: 300, alignSelf: 'center', marginTop: 48},
            small && {marginTop: 24},
          ]}>
          <YouTube
            role="youtube"
            videoId="NUhlzDv9m9g"
            opts={opts}
            onReady={onPlayerReady}
            style={{height: 600}}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    maxWidth: 1000,
    width: '100%',
    alignSelf: 'center',
  },
  subSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftContent: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexDirection: 'column',
    gap: 48,
    width: '60%',
  },
  title: {
    fontFamily: 'Fira Sans',
    fontSize: 64,
    fontWeight: '600',
    width: '100%',
  },
  subtitle: {
    fontFamily: 'Fira Sans',
    fontSize: 32,
    fontWeight: '400',
    width: '100%',
  },
});
