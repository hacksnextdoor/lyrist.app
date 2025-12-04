'use client';
import {StyleSheet, View} from 'react-native';
import {useScale} from '../packages/hooks/useScale';
import {LyristText} from '../packages/components';

export function Footer() {
  const {small} = useScale();
  return (
    <View style={styles.container}>
      <View style={styles.divider} />
      <View style={[styles.content, small && styles.contentMobile]}>
        <LyristText style={styles.copyright}>© 2025 Lyrist LLC. All rights reserved.</LyristText>
        <LyristText style={styles.tagline}>Built for artists, by an artist</LyristText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingTop: 16,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginBottom: 24,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contentMobile: {
    flexDirection: 'column',
    gap: 8,
    alignItems: 'center',
  },
  copyright: {
    fontSize: 13,
    color: '#666',
  },
  tagline: {
    fontSize: 13,
    color: '#999',
  },
});
