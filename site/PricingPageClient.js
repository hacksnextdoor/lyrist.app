'use client';
import {useQueryState} from 'next-usequerystate';
import {useEffect} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {useAuthContext} from '../packages/context';
import {TURQUOISE} from '../packages/constants';
import {PricingCard} from './PricingCard';
import {useScale} from '../packages/hooks/useScale';

export function PricingPageClient() {
  const [checkoutSessionId] = useQueryState('checkout-session-id');
  const {user, plusLoading, setPlusStatus} = useAuthContext();
  const {small} = useScale();

  useEffect(() => {
    // handle purchase completion via checkoutSessionId
    if (user && checkoutSessionId) {
      setPlusStatus(user.uid);
    }
  }, [user, checkoutSessionId]);

  if (plusLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', padding: 48}}>
        <ActivityIndicator color={TURQUOISE} />
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: TURQUOISE,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: small ? 16 : 24,
        minHeight: 600,
      }}>
      <PricingCard isActive intensity={1} returnUrl="/pricing" />
    </View>
  );
}
