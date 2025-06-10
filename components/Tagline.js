import {StyleSheet, useWindowDimensions, View} from 'react-native';
import {useScale} from '../hooks';
import {LyristText} from '../packages/components';

const MAX_WIDTH = 1400;
const BASE_FONT_SIZE = 99.6;
const START_COLOR = '#000000';
const END_COLOR = '#007AFF';

export function Tagline() {
  const {large} = useScale();
  const {width} = useWindowDimensions();
  const scaledFontSize = Math.min(BASE_FONT_SIZE, (width / MAX_WIDTH) * BASE_FONT_SIZE);
  return (
    <View style={styles.section}>
      <LyristText style={[styles.line1, {fontSize: scaledFontSize}]} weight={'Medium'}>
        Find a beat{large ? '\n' : ' '}
        <View style={{transform: [{rotate: '-1.5deg'}], marginTop: large ? 8 : 0}}>
          <LyristText style={[styles.line2, {fontSize: scaledFontSize}]} weight={'Medium'}>
            beat writer's block
          </LyristText>
        </View>
      </LyristText>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    maxWidth: MAX_WIDTH,
    alignSelf: 'center',
    paddingVertical: 16,
  },
  line1: {
    color: START_COLOR,
    textAlign: 'center',
  },
  anchor: {
    color: 'white',
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  line2: {
    backgroundImage: `linear-gradient(160deg, ${START_COLOR} 30%, ${END_COLOR} 70%)`,
    color: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
});
