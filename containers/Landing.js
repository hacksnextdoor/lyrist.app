import {StyleSheet, Text, View} from 'react-native';
import {Badges, Footer, Features, Header, Main, Navbar, Pricing, Reviews} from '../components';
import {useScale} from '../hooks';

export function Landing() {
  const {small} = useScale();
  return (
    <View style={small ? {gap: 24, padding: 24} : {gap: 48, padding: 48}}>
      <Header />
      <Main />
      <Reviews />
      <Features />
      <Pricing />
      <Text
        // should probably be based on height, not width
        style={[styles.call, {alignSelf: 'center', fontSize: 32}, small && {fontSize: 16}]}>
        {'Try it out for free!'}
      </Text>
      <Badges />
      <Navbar />
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  call: {
    fontFamily: 'Fira Sans',
    fontSize: 16,
    fontWeight: '600',
  },
});
