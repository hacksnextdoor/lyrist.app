'use client';
import {useQueryState} from 'next-usequerystate';
import {useEffect} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {LyristText} from '../packages/components';
import {useAuthContext} from '../packages/context';
import {LYRIST_BLUE} from '../packages/constants';
import {PricingSection} from './PricingSection';

export function PricingPageClient() {
  const [checkoutSessionId] = useQueryState('checkout-session-id');
  const {user, plusLoading, setPlusStatus, hasPlus} = useAuthContext();

  useEffect(() => {
    // handle purchase completion via checkoutSessionId
    if (user && checkoutSessionId) {
      setPlusStatus(user.uid);
    }
  }, [user, checkoutSessionId]);

  if (plusLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', padding: 48}}>
        <ActivityIndicator color={LYRIST_BLUE} />
      </View>
    );
  }

  if (hasPlus) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', padding: 48}}>
        <LyristText style={{textAlign: 'center', fontSize: 24}}>
          Thanks for purchasing Lyrist Plus!
        </LyristText>
      </View>
    );
  }

  return <PricingSection />;
}
