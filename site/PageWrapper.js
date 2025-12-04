'use client';
import {View} from 'react-native';
import {CREAM_BACKGROUND} from '../packages/constants';

export function PageWrapper({children, maxWidth = 1400}) {
  return (
    <View
      style={{
        backgroundColor: CREAM_BACKGROUND,
        minHeight: '100vh',
        paddingVertical: 48,
      }}>
      <View
        style={{
          maxWidth,
          width: '100%',
          alignSelf: 'center',
        }}>
        {children}
      </View>
    </View>
  );
}
