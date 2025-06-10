import {StyleSheet, View} from 'react-native';
import YouTube from 'react-youtube';
import {useScale} from '../hooks';
import {Badges} from './Badges';
import {Reviews} from './Reviews';

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
  return (
    <View style={styles.section}>
      <View style={[styles.subSection, medium && {flexDirection: 'column'}]}>
        <View style={[styles.leftContent, medium && {width: '100%'}]}>
          <Badges />
          <Reviews />
        </View>
        <View
          style={[
            styles.rightContent,
            {width: '30%'},
            medium && {width: '100%', alignItems: 'center'},
            small && {width: '100%', gap: 24},
          ]}>
          <YouTube
            role="youtube"
            videoId="NUhlzDv9m9g"
            opts={opts}
            onReady={onPlayerReady}
            style={{height: 600, width: '100%'}}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    maxWidth: 1400,
    width: '100%',
    alignSelf: 'center',
  },
  subSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  leftContent: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexDirection: 'column',
    gap: 48,
    width: '65%',
  },
});
