'use client';
import {useMemo} from 'react';
import {View} from 'react-native';
import {CREAM_BACKGROUND} from 'packages/constants';
import {useScale} from 'packages/hooks/useScale';
import {Badges} from './Badges';
import {FaqSection} from './FaqSection';
import {Footer} from './Footer';
import {Header} from './Header';
import {Metrics} from './Metrics';
import {Navbar} from './Navbar';
import {PricingSection} from './PricingSection';
import {Roadmap} from './Roadmap';
import {Tagline} from './Tagline';
import {Reviews} from './Reviews';
import {TryInput} from './TryInput';

export function Landing() {
  const {small, medium} = useScale();

  const pagePadding = useMemo(() => (small ? 32 : medium ? 40 : 48), [small, medium]);
  const pageGap = useMemo(() => (small ? 32 : medium ? 48 : 64), [small, medium]);

  return (
    <View style={{backgroundColor: CREAM_BACKGROUND}}>
      <View
        style={{
          gap: pageGap,
          padding: pagePadding,
          maxWidth: 1400,
          width: '100%',
          alignSelf: 'center',
        }}>
        <Header />
        <Tagline />
        <Badges />
        <View id="reviews" style={{paddingVertical: pageGap}}>
          <Reviews />
        </View>
        <View id="pricing" style={{paddingVertical: pageGap}}>
          <PricingSection header={'Get the ultimate Lyrist experience with Plus'} />
        </View>
        <View id="faq" style={{paddingVertical: pageGap}}>
          <FaqSection collapsible={true} />
        </View>
      </View>
      <Metrics />
      <View id="roadmap" style={{backgroundColor: 'white', paddingVertical: pageGap}}>
        <View
          style={{
            gap: pageGap,
            padding: pagePadding,
            maxWidth: 1400,
            width: '100%',
            alignSelf: 'center',
          }}>
          <Roadmap />
          <TryInput showStamp />
          <Badges />
          <Navbar />
          <Footer />
          <View />
          <View />
          <View />
        </View>
      </View>
    </View>
  );
}
