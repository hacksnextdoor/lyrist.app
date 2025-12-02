'use client';
import {useMemo} from 'react';
import {useHydratedDimensions} from 'packages/hooks/useScale';
import {LyristText} from 'packages/components';

const MAX_WIDTH = 1400;
const BASE_FONT_SIZE = 48;

export function SectionTitle({children, style}) {
  const {width} = useHydratedDimensions();

  const scaledFontSize = useMemo(() => {
    const viewportWidth = width || MAX_WIDTH;
    return Math.max(24, Math.min(BASE_FONT_SIZE, (viewportWidth / MAX_WIDTH) * BASE_FONT_SIZE));
  }, [width]);

  return (
    <LyristText style={[{fontSize: scaledFontSize, textAlign: 'center'}, style]} weight="Medium">
      {children}
    </LyristText>
  );
}
