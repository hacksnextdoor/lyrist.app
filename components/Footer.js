import {StyleSheet, Text, View} from 'react-native';

export function Footer() {
  return (
    <View style={styles.section}>
      <Text style={styles.copyright}>ⓒ 2023 Lyrist LLC</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    alignSelf: 'center',
    maxWidth: 1000,
    width: '100%',
  },
  copyright: {
    color: 'gray',
    fontFamily: 'Fira Sans',
    fontSize: 16,
  },
});
