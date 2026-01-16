'use client';
import {useState, useCallback, useMemo, memo} from 'react';
import {View, Pressable, StyleSheet} from 'react-native';
import {useAuthContext} from '../packages/context';
import {useLoading} from '../packages/context/LoadingProvider';
import {LyristText} from '../packages/components';
import {useScale} from '../packages/hooks/useScale';
import {TURQUOISE} from '../packages/constants';
import {IoDiamond, IoEllipseOutline} from 'react-icons/io5';
import createCheckoutSession from '../app/actions/stripe';
import {SectionTitle} from './SectionTitle';

const isDev = process.env.NODE_ENV === 'development';

const PLANS = [
  {
    name: 'Weekly',
    price: '$2.99',
    period: 'week',
    productId: isDev ? 'prod_Ox9YC2iHmim441' : 'prod_TVAhh6lveiGasR',
    recurring: {interval: 'week', interval_count: 1},
  },
  {
    name: 'Monthly',
    price: '$9.99',
    period: 'month',
    productId: isDev ? 'prod_Ox9WC8qO1iY36o' : 'prod_NPZeELRcg81f06',
    recurring: {interval: 'month', interval_count: 1},
  },
  {
    name: 'Yearly',
    price: '$69.99',
    period: 'year',
    productId: isDev ? 'prod_Ox9rbajpitne7j' : 'prod_NPZe7uNfwmqrAC',
    recurring: {interval: 'year', interval_count: 1},
    discount: '55% off',
  },
];

const BENEFITS = [
  'Unlimited pages',
  'Unlimited smart suggestions',
  'Organize with folders',
  'Cross-device sync',
  'Search YouTube and SoundCloud',
  'Rhyming dictionary',
  'No ads',
  'No AI training on your music',
];

const COMING_SOON = [
  'Voice memos',
  'Use your own beats',
  'Timestamped lyrics',
  'Connect with other artists',
  'Personalize your workspace',
  'Export your pages',
];

export const PricingSection = memo(function PricingSection({
  header,
  showFeatures = true,
  showMessage = true,
}) {
  const {small, medium, large} = useScale();
  const {user, hasPlus, plusLoading, setOpenAuthModal} = useAuthContext();
  const {showLoading, hideLoading, setLoadingMessage} = useLoading();
  const [selectedPlan, setSelectedPlan] = useState(1); // Monthly default
  const [hoveredPlan, setHoveredPlan] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [ctaHovered, setCtaHovered] = useState(false);

  const handleCheckout = useCallback(async () => {
    if (processing || plusLoading) return;

    if (hasPlus) {
      window.location.href = '/search';
      return;
    }

    if (!user) {
      setOpenAuthModal(true);
      return;
    }

    const plan = PLANS[selectedPlan];

    try {
      setProcessing(true);
      showLoading('Preparing checkout...');

      const pricingResponse = await fetch('/api/pricing');
      if (!pricingResponse.ok) throw new Error('Failed to fetch pricing');

      const pricingData = await pricingResponse.json();
      const matchingPrice = pricingData.find(item => item.product.id === plan.productId);

      if (!matchingPrice) {
        throw new Error(`No ${plan.name} subscription found. Please contact support.`);
      }

      if (!user.email) {
        throw new Error('Email not found. Please sign in again.');
      }

      setLoadingMessage('Redirecting to checkout...');

      await createCheckoutSession(
        {price: matchingPrice.price.id, quantity: 1},
        matchingPrice.price.recurring,
        user.uid,
        user.email,
      );
    } catch (error) {
      console.error('Checkout error:', error);
      alert(error.message || 'Failed to start checkout. Please try again.');
    } finally {
      setProcessing(false);
      hideLoading();
    }
  }, [
    user,
    hasPlus,
    plusLoading,
    selectedPlan,
    processing,
    setOpenAuthModal,
    showLoading,
    hideLoading,
    setLoadingMessage,
  ]);

  // Responsive styles - much bigger on desktop
  const responsiveStyles = {
    card: {
      padding: small ? 24 : medium ? 48 : 96,
      maxWidth: small ? '100%' : medium ? 800 : 1400,
    },
    headline: {
      fontSize: small ? 28 : medium ? 40 : 56,
    },
    plans: {
      gap: small ? 8 : medium ? 16 : 24,
      marginBottom: small ? 24 : medium ? 32 : 48,
    },
    planOption: {
      paddingVertical: small ? 12 : medium ? 20 : 28,
    },
    planPrice: {
      fontSize: small ? 28 : medium ? 40 : 56,
    },
    planPeriod: {
      fontSize: small ? 14 : medium ? 18 : 22,
    },
    ctaButton: {
      paddingVertical: small ? 16 : medium ? 24 : 32,
    },
    ctaText: {
      fontSize: small ? 18 : medium ? 24 : 32,
    },
    benefitsHeader: {
      fontSize: small ? 16 : medium ? 20 : 24,
    },
    benefitText: {
      fontSize: small ? 14 : medium ? 16 : 18,
    },
  };

  if (plusLoading) {
    return (
      <View style={[styles.card, responsiveStyles.card]}>
        <LyristText style={styles.loading}>Loading...</LyristText>
      </View>
    );
  }

  if (hasPlus) {
    return (
      <View style={[styles.card, responsiveStyles.card, {alignItems: 'center'}]}>
        <LyristText style={styles.title}>LYRIST PLUS</LyristText>
        <LyristText style={styles.hasPlus}>You have Plus!</LyristText>
        <Pressable
          style={[styles.ctaButton, responsiveStyles.ctaButton]}
          onPress={() => (window.location.href = '/search')}>
          <LyristText style={[styles.ctaText, responsiveStyles.ctaText]} weight="Medium">
            Go to app
          </LyristText>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.card, responsiveStyles.card]}>
      {header && (
        <View style={{marginBottom: 24, alignItems: 'center'}}>
          <SectionTitle>{header}</SectionTitle>
        </View>
      )}

      <View style={styles.content}>
        {/* Plan selector */}
        <View style={[styles.plans, responsiveStyles.plans]}>
          {PLANS.map((plan, i) => {
            const isSelected = selectedPlan === i;
            const isHovered = hoveredPlan === i && !isSelected;
            return (
              <Pressable
                key={i}
                onPress={() => setSelectedPlan(i)}
                onHoverIn={() => setHoveredPlan(i)}
                onHoverOut={() => setHoveredPlan(null)}
                style={[
                  styles.planOption,
                  responsiveStyles.planOption,
                  isSelected && styles.planSelected,
                  isHovered && styles.planHovered,
                ]}>
                <LyristText
                  style={[
                    styles.planPrice,
                    responsiveStyles.planPrice,
                    isSelected && styles.planPriceSelected,
                  ]}
                  weight="Medium">
                  {plan.price}
                </LyristText>
                <LyristText
                  style={[
                    styles.planPeriod,
                    responsiveStyles.planPeriod,
                    isSelected && styles.planPeriodSelected,
                  ]}>
                  {plan.period}
                </LyristText>
              </Pressable>
            );
          })}
        </View>

        {/* CTA Button */}
        <Pressable
          style={[
            styles.ctaButton,
            responsiveStyles.ctaButton,
            processing && styles.ctaDisabled,
            ctaHovered && styles.ctaButtonHovered,
          ]}
          onPress={handleCheckout}
          onHoverIn={() => setCtaHovered(true)}
          onHoverOut={() => setCtaHovered(false)}
          disabled={processing}>
          <LyristText style={[styles.ctaText, responsiveStyles.ctaText]} weight="Medium">
            {processing ? 'Loading...' : 'Start 3-day free trial'}
          </LyristText>
        </Pressable>

        {/* Benefits - two columns */}
        {showFeatures && (
          <View style={[styles.benefitsContainer, small && styles.benefitsContainerMobile, {marginTop: large ? 48 : 32}]}>
            {/* Current benefits */}
            <View style={styles.benefitsColumn}>
              <LyristText style={[styles.benefitsHeader, {fontSize: responsiveStyles.benefitsHeader.fontSize}]} weight="Medium">
                What you get
              </LyristText>
              <View style={[styles.benefits, {gap: large ? 12 : 8}]}>
                {BENEFITS.map((benefit, i) => (
                  <View key={i} style={[styles.benefitItem, {paddingVertical: large ? 10 : 6, paddingHorizontal: large ? 16 : 12}]}>
                    <View style={styles.benefitIconWrapper}>
                      <IoDiamond size={large ? 18 : 14} color={TURQUOISE} className="diamond-sparkle" style={{animationDelay: `${i * 0.4}s`}} />
                    </View>
                    <LyristText style={[styles.benefitText, {fontSize: responsiveStyles.benefitText.fontSize}]}>{benefit}</LyristText>
                  </View>
                ))}
              </View>
            </View>
            {/* Coming soon */}
            <View style={styles.benefitsColumn}>
              <LyristText style={[styles.benefitsHeader, {fontSize: responsiveStyles.benefitsHeader.fontSize}]} weight="Medium">
                Coming soon
              </LyristText>
              <View style={[styles.benefits, {gap: large ? 12 : 8}]}>
                {COMING_SOON.map((feature, i) => (
                  <View key={i} style={[styles.benefitItem, {paddingVertical: large ? 10 : 6, paddingHorizontal: large ? 16 : 12}]}>
                    <View style={styles.benefitIconWrapper}>
                      <IoEllipseOutline size={large ? 16 : 12} color="#ccc" />
                    </View>
                    <LyristText style={[styles.benefitText, {fontSize: responsiveStyles.benefitText.fontSize, opacity: 0.7}]}>{feature}</LyristText>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Support message */}
        {showMessage && (
          <View style={{marginTop: large ? 48 : 24, alignItems: 'center'}}>
            <LyristText style={{fontSize: small ? 14 : medium ? 16 : 20, color: '#666', textAlign: 'center', maxWidth: 600}}>
              We'd like to stay ad-free. Consider supporting Lyrist by purchasing Plus.
            </LyristText>
          </View>
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    width: '100%',
    alignSelf: 'center',
  },
  title: {
    fontSize: 16,
    letterSpacing: 3,
    color: TURQUOISE,
    marginBottom: 24,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  content: {
    width: '100%',
  },
  plans: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  planOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: '#e5e5e5',
    borderRadius: 20,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  planSelected: {
    borderColor: TURQUOISE,
    backgroundColor: TURQUOISE,
  },
  planHovered: {
    borderColor: '#ccc',
  },
  planPrice: {
    fontSize: 36,
    color: '#000',
  },
  planPriceSelected: {
    color: '#fff',
  },
  planPeriod: {
    fontSize: 16,
    color: '#888',
    marginTop: 4,
    textTransform: 'uppercase',
  },
  planPeriodSelected: {
    color: 'rgba(255,255,255,0.7)',
  },
  ctaButton: {
    backgroundColor: TURQUOISE,
    paddingVertical: 20,
    borderRadius: 20,
    alignItems: 'center',
    transition: 'all 0.3s ease',
  },
  ctaButtonHovered: {
    transform: 'scale(1.02)',
    boxShadow: '0 8px 30px rgba(0,199,190,0.4)',
  },
  ctaDisabled: {
    opacity: 0.5,
  },
  ctaText: {
    color: '#fff',
    fontSize: 20,
  },
  loading: {
    textAlign: 'center',
    color: '#999',
    padding: 40,
    fontSize: 16,
  },
  hasPlus: {
    textAlign: 'center',
    fontSize: 24,
    color: '#000',
    marginBottom: 24,
  },
  benefitsContainer: {
    flexDirection: 'row',
    gap: 32,
    marginTop: 32,
  },
  benefitsContainerMobile: {
    flexDirection: 'column',
    gap: 24,
  },
  benefitsColumn: {
    flex: 1,
  },
  benefitsHeader: {
    fontSize: 18,
    marginBottom: 12,
    color: '#000',
  },
  benefits: {
    gap: 8,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(0,0,0,0.04)',
  },
  benefitIconWrapper: {
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  benefitText: {
    fontSize: 14,
    color: '#555',
  },
});
