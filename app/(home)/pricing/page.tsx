'use client';
import {useQueryState} from 'next-usequerystate';
import {useEffect, useState} from 'react';
import {ActivityIndicator, Pressable, StyleSheet, View} from 'react-native';
import Stripe from 'stripe';
import {LyristText} from '../../../packages/components';
import {useAuthContext} from '../../../packages/context';
import {normalize} from '../../../packages/utils';
import {LYRIST_BLUE} from '../../../packages/constants';
import {formatAmountForDisplay} from '../../../utils/stripe-helpers';
import createCheckoutSession from '../../actions/stripe';
import {Features} from '../../../packages/components/Features';

type Package = {
  price: Stripe.Price;
  product: Stripe.Product;
};

export default function Page() {
  const [checkoutSessionId] = useQueryState('checkout-session-id');
  const [pricesLoading, setPricesLoading] = useState(true);
  const [pricesError, setPricesError] = useState<Error | null>(null);
  const [packages, setPackages] = useState<Package[]>([]);
  const {user, setOpenAuthModal, plusLoading, setPlusStatus, hasPlus} = useAuthContext();

  const handlePurchasePackage = (purchasesPackage: Package) => {
    if (user) {
      createCheckoutSession(
        {price: purchasesPackage.product.default_price!.toString(), quantity: 1},
        purchasesPackage.price.recurring!,
        user.uid,
        user.email!,
      );
    } else {
      setOpenAuthModal(true);
    }
  };

  useEffect(() => {
    const getSubscriptionOptions = async () => {
      try {
        const pricingResponse = await fetch('api/pricing');
        const offerings: Package[] = await pricingResponse.json();
        offerings.sort((a, b) => a.price.unit_amount! - b.price.unit_amount!);
        // if (offerings.current !== null && offerings.current.availablePackages.length !== 0) {
        //   setPackages(offerings.current.availablePackages);
        // }
        setPackages(offerings);
      } catch (e) {
        setPricesError(e);
      } finally {
        setPricesLoading(false);
      }
    };

    getSubscriptionOptions();
  }, []);

  useEffect(() => {
    // handle purchase completion via checkoutSessionId
    if (user && checkoutSessionId) {
      setPlusStatus(user.uid);
    }
  }, [user, checkoutSessionId]);

  if (plusLoading) {
    return <ActivityIndicator color={LYRIST_BLUE} />;
  }

  if (hasPlus) {
    return (
      <LyristText style={{textAlign: 'center'}}>Thanks for purchasing Lyrist Plus!</LyristText>
    );
  }

  return (
    <View
      style={{
        alignContent: 'center',
        // flexDirection: "row",
        flexWrap: 'wrap',
        padding: normalize(12),
        gap: normalize(12),
      }}>
      <LyristText style={{alignSelf: 'center', fontSize: normalize(24)}}>
        Choose your plan
      </LyristText>
      {pricesLoading ? (
        <ActivityIndicator color={LYRIST_BLUE} />
      ) : pricesError ? (
        <LyristText>{pricesError.message}</LyristText>
      ) : (
        packages.map((pkg, index) => (
          <Pressable
            key={index}
            onPress={() => handlePurchasePackage(pkg)}
            style={{
              // flex: 1,
              // alignSelf: "center",
              borderColor: 'black',
              borderRadius: 5,
              borderWidth: 1,
              // justifyContent: "space-between",
              padding: 20,
              // maxWidth: 400,
            }}>
            <LyristText style={{fontSize: normalize(24)}}>
              {/* expect unit_amount to be populated because billing schemes are per unit */}
              {formatAmountForDisplay(pkg.price.unit_amount! / 100, pkg.price.currency)}{' '}
              {pkg.price.recurring ? `/ ${pkg.price.recurring.interval}` : 'once'}
            </LyristText>
            <LyristText>{pkg.product.description}</LyristText>
          </Pressable>
        ))
      )}
      <Features />
    </View>
  );
}
