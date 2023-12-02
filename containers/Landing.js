import Link from 'next/link';
import {useEffect, useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {Badges, Footer, Features, Header, Main, Navbar, Reviews} from '../components';
import {useScale} from '../hooks';
import {LyristText} from '../packages/components';
import {LYRIST_BLUE, TURQUOISE} from '../packages/constants';

export function Landing() {
  const {small, medium} = useScale();
  const [line0, setLine0] = useState(false);

  // HACK FOR AVOIDING HYDRATION FAILURES
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  // DELETE THIS EVENTUALLY

  return (
    <>
      <View
        style={
          small ? {gap: 32, padding: 32} : medium ? {gap: 40, padding: 40} : {gap: 48, padding: 48}
        }>
        <Header />
        <Main />
        <Reviews />
        <Features />
        <Link
          role="link"
          href={'/redirect'}
          style={{alignSelf: 'center', textDecoration: 'none', paddingTop: 24}}>
          <LyristText
            style={[
              styles.signIn,
              small && {paddingVertical: 10, paddingHorizontal: 12, alignSelf: 'center'},
            ]}
            weight={'Medium'}>
            Try the web app
          </LyristText>
        </Link>
        <Badges />
        <Navbar />
        <Footer />
        <View />
        <View />
      </View>
      <LyristText style={[styles.title, {fontSize: small ? 16 : medium ? 24 : 32}]}>
        Want unlimited storage? Get{' '}
        <Link role="link" href={'/pricing'} style={{textDecoration: 'none'}}>
          <Pressable onHoverIn={() => setLine0(true)} onHoverOut={() => setLine0(false)}>
            <LyristText
              style={[
                {color: TURQUOISE, fontSize: small ? 16 : medium ? 24 : 32},
                line0 && {textDecorationLine: 'underline'},
              ]}>
              Lyrist Plus
            </LyristText>
          </Pressable>
        </Link>{' '}
        for $9 per month.
      </LyristText>
    </>
  );
}

const styles = StyleSheet.create({
  signIn: {
    backgroundColor: LYRIST_BLUE,
    color: 'white',
    borderRadius: 5,
    fontSize: 16,
    paddingVertical: 20,
    paddingHorizontal: 24,
    color: 'white',
  },
  title: {
    color: 'white',
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: 'black',
    position: 'fixed',
    bottom: 0,
    width: '100%',
    paddingVertical: 20,
  },
});
