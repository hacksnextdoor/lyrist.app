import Link from 'next/link';
import {useEffect, useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {Badges, Footer, Features, Header, Main, Navbar, Roadmap, Tagline} from '../components';
import {useScale} from '../hooks';
import {LyristText} from '../packages/components';
import {CREAM_BACKGROUND, TURQUOISE} from '../packages/constants';

export function Landing() {
  const {small, medium} = useScale();
  const [line0, setLine0] = useState(false);
  const [picked] = useState(() => {
    const choices = ['unlimited storage', 'unlimited AI-powered suggestions'];
    return choices[Math.floor(Math.random() * choices.length)];
  });

  // HACK FOR AVOIDING HYDRATION FAILURES
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  // DELETE THIS EVENTUALLY

  return (
    <View style={{backgroundColor: CREAM_BACKGROUND}}>
      <View
        style={[
          small ? {gap: 32, padding: 32} : medium ? {gap: 48, padding: 40} : {gap: 64, padding: 48},
        ]}>
        <Header />
        <Tagline />
        <Main />
        <Features />
        <View style={{maxWidth: 1400, width: '100%', alignSelf: 'center'}}>
          <Link role="link" href={'/pricing'} style={{textDecoration: 'none'}}>
            <Pressable
              style={[styles.card, styles.cardShadow, {padding: small ? 16 : medium ? 20 : 24}]}>
              <LyristText
                style={{
                  color: 'white',
                  fontSize: small ? 16 : medium ? 24 : 32,
                  textAlign: 'center',
                }}>
                We would like to stay{' '}
                <LyristText
                  style={{color: 'white', fontSize: small ? 16 : medium ? 24 : 32}}
                  weight={'Medium'}>
                  ad-free
                </LyristText>{' '}
                for as long as possible.{small || medium ? ' ' : '\n'}Consider supporting Lyrist by
                purchasing Plus.
              </LyristText>
            </Pressable>
          </Link>
        </View>
        <Roadmap />
        <Link
          role="link"
          href={'/redirect'}
          style={{
            alignSelf: 'center',
            textDecoration: 'none',
            paddingTop: 24,
          }}>
          <LyristText
            style={[
              styles.tryApp,
              small && {paddingVertical: 10, paddingHorizontal: 12, alignSelf: 'center'},
              {fontSize: small ? 16 : 24},
            ]}>
            Try the web app
          </LyristText>
        </Link>
        <Badges />
        <Navbar />
        <Footer />
        <View />
        <View />
        <View />
      </View>
      <View
        style={[
          styles.footer,
          {
            marginHorizontal: small ? 32 : medium ? 40 : 48,
            padding: small ? 16 : medium ? 20 : 24,
          },
        ]}>
        <Link role="link" href={'/pricing'} style={{textDecoration: 'none'}}>
          <Pressable onHoverIn={() => setLine0(true)} onHoverOut={() => setLine0(false)}>
            <LyristText
              style={[
                {fontSize: small ? 16 : medium ? 24 : 32},
                line0 && {textDecorationLine: 'underline'},
                {textAlign: 'center'},
              ]}
              weight={'Medium'}>
              Get{' '}
              <LyristText
                style={[
                  {color: TURQUOISE, fontSize: small ? 16 : medium ? 24 : 32},
                  line0 && {textDecorationLine: 'underline'},
                ]}
                weight={'Medium'}>
                {picked}
              </LyristText>{' '}
              for $9.99 per month
            </LyristText>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    justifyContent: 'center',
    borderRadius: 8,
    gap: 16,
    backgroundColor: TURQUOISE,
  },
  cardShadow: {
    shadowColor: '#171717',
    shadowOffset: {width: 0.3, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  tryApp: {
    backgroundColor: 'white',
    borderColor: 'black',
    borderRadius: 8,
    borderWidth: 2,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  footer: {
    maxWidth: 1400,
    alignSelf: 'center',
    position: 'sticky',
    bottom: 32,
    zIndex: 10,
    borderRadius: 64,
    borderColor: TURQUOISE,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden', // clip the blur to the rounded border
    // frost-glass:
    backgroundColor: 'rgba(255,255,255,0.3)',
    backdropFilter: 'blur(10px)', // <-- key
    WebkitBackdropFilter: 'blur(10px)', // <-- for Safari
  },
});
