'use client';
import {StyleSheet, View} from 'react-native';

export default function RecordsLayout({children}: {children: React.ReactNode}) {
  return <View style={styles.wrapper}>{children as any}</View>;
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#fff',
    minHeight: '100%',
  },
});
