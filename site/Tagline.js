'use client';
import {useMemo, memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {useScale, useHydratedDimensions} from 'packages/hooks/useScale';
import {LyristText} from 'packages/components';
import {TryInput} from './TryInput';

const MAX_WIDTH = 1400;
const BASE_FONT_SIZE = 80;
const START_COLOR = '#000000';

export const Tagline = memo(function Tagline() {
  const {large} = useScale();
  const {width} = useHydratedDimensions();
  const viewportWidth = useMemo(() => width || MAX_WIDTH, [width]);
  const scaledFontSize = useMemo(
    () => Math.min(BASE_FONT_SIZE, (viewportWidth / MAX_WIDTH) * BASE_FONT_SIZE),
    [viewportWidth],
  );
  const heroMarginTop = useMemo(() => (large ? 24 : 8), [large]);

  return (
    <View style={styles.section}>
      <h1 style={{margin: 0, padding: 0, display: 'contents'}}>
        <View style={styles.taglineRow}>
          <LyristText style={[styles.line1, {fontSize: scaledFontSize}]} weight={'Medium'}>
            Find{' '}
          </LyristText>
          <TryInput showStamp />
        </View>
        <LyristText
          style={{fontSize: scaledFontSize, marginTop: heroMarginTop, alignSelf: 'center'}}
          weight={'Medium'}>
          beat writer's block
        </LyristText>
      </h1>
    </View>
  );
});

const styles = StyleSheet.create({
  section: {
    maxWidth: MAX_WIDTH,
    alignSelf: 'center',
  },
  taglineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'nowrap',
    whiteSpace: 'nowrap',
  },
  line1: {
    color: START_COLOR,
    textAlign: 'center',
    flexShrink: 0,
  },
});
