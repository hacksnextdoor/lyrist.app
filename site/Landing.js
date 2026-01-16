'use client';
import {useMemo, useEffect} from 'react';
import {View} from 'react-native';
import {CREAM_BACKGROUND} from 'packages/constants';
import {useScale} from 'packages/hooks/useScale';
import {Badges} from './Badges';
import {Footer} from './Footer';
import {Header} from './Header';
import {Metrics} from './Metrics';
import {PricingSection} from './PricingCard';
import {Tagline} from './Tagline';
import {Reviews} from './Reviews';

export function Landing() {
  const {small, medium} = useScale();

  // Enable scroll snap for landing page
  useEffect(() => {
    document.documentElement.classList.add('landing-scroll-snap');
    return () => document.documentElement.classList.remove('landing-scroll-snap');
  }, []);

  const pagePadding = useMemo(() => (small ? 24 : medium ? 48 : 48), [small, medium]);
  const pageGap = useMemo(() => (small ? 16 : medium ? 48 : 64), [small, medium]);

  return (
    <View style={{backgroundColor: CREAM_BACKGROUND}}>
      {/* First fold - use flexbox with 100dvh to spread content */}
      <View
        style={{
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
        }}>
        <View
          style={{
            flex: 1,
            padding: pagePadding,
            maxWidth: 1400,
            width: '100%',
            alignSelf: 'center',
            overflow: 'visible',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: pageGap,
          }}>
          <Header />
          <View style={{alignItems: 'center', gap: small ? 24 : 32}}>
            <Tagline />
            <Badges />
          </View>
          <View id="reviews" style={{overflow: 'visible'}}>
            <Reviews />
          </View>
        </View>
        <Metrics />
      </View>

      {/* Pricing - full width with scroll-triggered color animation */}
      <PricingSection pageGap={pageGap} />

      <View
        style={{
          padding: pagePadding,
          maxWidth: 1400,
          width: '100%',
          alignSelf: 'center',
        }}>
        <Footer showTryInput />
      </View>
    </View>
  );
}
