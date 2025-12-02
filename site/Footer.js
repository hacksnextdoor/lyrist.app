'use client';
import {StyleSheet, View} from 'react-native';
import {useScale} from '../packages/hooks/useScale';
import {LyristText} from '../packages/components';

export function Footer() {
  const {small} = useScale();
  return (
    <View style={styles.section}>
      <LyristText style={{color: 'gray', fontSize: small ? 16 : 24}}>ⓒ 2025 Lyrist LLC</LyristText>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    alignSelf: 'center',
    maxWidth: 1400,
    width: '100%',
  },
});
