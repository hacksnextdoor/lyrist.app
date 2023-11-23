'use client';
import {useEffect, useState} from 'react';
import {ActivityIndicator, Pressable, StyleSheet, View} from 'react-native';
import Stripe from 'stripe';
import {LyristText} from '../../../packages/components';
import {useAuthContext} from '../../../packages/context';
import {normalize} from '../../../packages/utils';
import {LYRIST_BLUE, TURQUOISE} from '../../../packages/constants';
import {formatAmountForDisplay} from '../../../utils/stripe-helpers';
import createCheckoutSession from '../../actions/stripe';

type Package = {
  price: Stripe.Price;
  product: Stripe.Product;
};

export default function Page() {
  const styles = StyleSheet.create({
    featureText: {flexDirection: 'row', alignItems: 'center', paddingTop: 4},
  });
  const [pricesLoading, setPricesLoading] = useState(true);
  const [pricesError, setPricesError] = useState<Error | null>(null);
  const [packages, setPackages] = useState<Package[]>([]);
  const {user, setOpenAuthModal} = useAuthContext();

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
      <View style={{gap: 4}}>
        <LyristText style={{fontSize: normalize(24)}} weight={'Medium'}>
          Plus
        </LyristText>
        <View style={styles.featureText}>
          <LyristText style={{fontSize: normalize(14), color: TURQUOISE}} weight={'SemiBold'}>
            +{' '}
          </LyristText>
          <LyristText>Everything in Basic</LyristText>
        </View>
        <View style={styles.featureText}>
          <LyristText style={{fontSize: normalize(14), color: TURQUOISE}} weight={'SemiBold'}>
            +{' '}
          </LyristText>
          <LyristText>Unlimited pages</LyristText>
        </View>
        <View style={styles.featureText}>
          <LyristText style={{fontSize: normalize(14), color: TURQUOISE}} weight={'SemiBold'}>
            🔜{' '}
          </LyristText>
          <LyristText>Smart suggestions</LyristText>
        </View>
        <View style={styles.featureText}>
          <LyristText>and more!</LyristText>
        </View>
      </View>
      <View>
        <LyristText style={{fontSize: normalize(24)}} weight={'Medium'}>
          Basic (Free tier)
        </LyristText>
        <View style={styles.featureText}>
          <LyristText style={{fontSize: normalize(14)}} weight={'SemiBold'}>
            ·{' '}
          </LyristText>
          <LyristText>Cross-platform access (iOS, Android, 🔜 Web)</LyristText>
        </View>
        <View style={styles.featureText}>
          <LyristText style={{fontSize: normalize(14)}} weight={'SemiBold'}>
            ·{' '}
          </LyristText>
          <LyristText>Sync across multiple devices</LyristText>
        </View>
        <View style={styles.featureText}>
          <LyristText style={{fontSize: normalize(14)}} weight={'SemiBold'}>
            ·{' '}
          </LyristText>
          <LyristText>Encrypted page content</LyristText>
        </View>
        <View style={styles.featureText}>
          <LyristText style={{fontSize: normalize(14)}} weight={'SemiBold'}>
            ·{' '}
          </LyristText>
          <LyristText>Writer's Block</LyristText>
        </View>
        <View style={styles.featureText}>
          <LyristText style={{fontSize: normalize(14)}} weight={'SemiBold'}>
            🔜{' '}
          </LyristText>
          <LyristText>Import via links</LyristText>
        </View>
        <View style={styles.featureText}>
          <LyristText style={{fontSize: normalize(14)}} weight={'SemiBold'}>
            🔜{' '}
          </LyristText>
          <LyristText>Data export</LyristText>
        </View>
      </View>
    </View>
  );
}
