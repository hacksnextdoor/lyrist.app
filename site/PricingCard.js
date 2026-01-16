'use client';
import {useState, useCallback, useEffect, useRef, memo} from 'react';
import {View, Pressable, StyleSheet} from 'react-native';
import {IoDiamond, IoEllipseOutline} from 'react-icons/io5';
import {useAuthContext} from '../packages/context';
import {useLoading} from '../packages/context/LoadingProvider';
import {LyristText} from '../packages/components';
import {TURQUOISE} from '../packages/constants';
import {useScale} from '../packages/hooks/useScale';
import createCheckoutSession from '../app/actions/stripe';

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
    popular: true,
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
];

const COMING_SOON = [
  'Voice memos',
  'Use your own beats',
  'Timestamped lyrics',
  'Connect with other artists',
  'Personalize your workspace',
];

export function PricingSection({pageGap}) {
  const sectionRef = useRef(null);
  const [intensity, setIntensity] = useState(0);
  const isActive = intensity > 0.4;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      const sectionCenter = rect.top + rect.height / 2;
      const viewportCenter = viewportHeight / 2;

      // Distance above center (positive = section below center)
      const distanceAboveCenter = (sectionCenter - viewportCenter) / viewportHeight;

      let newIntensity;
      if (distanceAboveCenter <= 0) {
        // At or past center - full turquoise, stay there
        newIntensity = 1;
      } else {
        // Start transition later and complete faster
        // Only start when section is 0.4 viewport heights from center
        const adjustedDistance = Math.max(0, distanceAboveCenter - 0.4);
        newIntensity = Math.max(0, Math.min(1, 1 - adjustedDistance * 2.5));
      }

      setIntensity(newIntensity);
    };

    window.addEventListener('scroll', handleScroll, {passive: true});
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Use exact TURQUOISE when fully active, interpolate only when transitioning
  const backgroundColor = intensity >= 1
    ? TURQUOISE
    : `color-mix(in srgb, ${TURQUOISE} ${intensity * 100}%, white)`;

  return (
    <div
      ref={sectionRef}
      id="pricing"
      style={{
        backgroundColor,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        scrollSnapAlign: 'start',
      }}>
      <PricingCard isActive={isActive} intensity={intensity} returnUrl="/#pricing" />
    </div>
  );
}

/** @type {React.FC<{isActive?: boolean, intensity?: number, returnUrl?: string}>} */
export const PricingCard = memo(function PricingCard({isActive = false, intensity = 0, returnUrl}) {
  const {user, hasPlus, plusLoading, setOpenAuthModal} = useAuthContext();
  const {showLoading, hideLoading, setLoadingMessage} = useLoading();
  const {small, medium, large} = useScale();
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
        returnUrl,
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
    returnUrl,
  ]);

  // Content fades in only after background is turquoise
  const contentOpacity = intensity >= 0.8 ? 1 : 0;

  // Dynamic styles - always use turquoise-on-white colors since content only shows when active
  const dynamicStyles = {
    content: {
      opacity: contentOpacity,
      transition: 'opacity 0.4s ease',
    },
    headline: {
      color: '#fff',
    },
    benefitItem: {
      backgroundColor: 'rgba(255,255,255,0.15)',
    },
    benefitText: {
      color: 'rgba(255,255,255,0.9)',
    },
    planOption: {
      borderColor: 'rgba(255,255,255,0.3)',
    },
    planSelected: {
      borderColor: '#fff',
      backgroundColor: '#fff',
    },
    planPrice: {
      color: '#fff',
    },
    planPriceSelected: {
      color: TURQUOISE,
    },
    planPeriod: {
      color: 'rgba(255,255,255,0.9)',
    },
    planPeriodSelected: {
      color: TURQUOISE,
    },
    ctaButton: {
      backgroundColor: '#fff',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      transform: ctaHovered ? 'scale(1.03)' : 'scale(1)',
      boxShadow: ctaHovered ? '0 8px 30px rgba(255,255,255,0.4)' : 'none',
    },
    ctaText: {
      color: TURQUOISE,
    },
    hasPlus: {
      color: '#fff',
    },
  };

  if (plusLoading) {
    return (
      <View style={styles.card}>
        <LyristText style={styles.loading}>Loading...</LyristText>
      </View>
    );
  }

  if (hasPlus) {
    return (
      <View style={styles.card}>
        <LyristText style={styles.title}>LYRIST PLUS</LyristText>
        <LyristText style={[styles.hasPlus, dynamicStyles.hasPlus]}>You have Plus!</LyristText>
        <Pressable
          style={[styles.ctaButton, dynamicStyles.ctaButton]}
          onPress={() => (window.location.href = '/search')}>
          <LyristText style={[styles.ctaText, dynamicStyles.ctaText]} weight="Medium">
            Go to app
          </LyristText>
        </Pressable>
      </View>
    );
  }

  // Responsive styles - smaller on mobile, bigger on desktop
  const responsiveStyles = {
    card: {
      padding: small ? 16 : medium ? 48 : 96,
    },
    headline: {
      fontSize: small ? 24 : medium ? 40 : 56,
    },
    benefitText: {
      fontSize: small ? 12 : medium ? 16 : 18,
    },
    plans: {
      flexDirection: 'row',
      gap: small ? 6 : medium ? 16 : 24,
      marginBottom: small ? 16 : 32,
    },
    planOption: {
      paddingVertical: small ? 8 : medium ? 20 : 28,
    },
    planPrice: {
      fontSize: small ? 22 : medium ? 40 : 56,
    },
    planPeriod: {
      fontSize: small ? 11 : medium ? 18 : 22,
    },
    ctaButton: {
      paddingVertical: small ? 12 : medium ? 24 : 32,
    },
    ctaText: {
      fontSize: small ? 14 : medium ? 24 : 32,
    },
  };

  return (
    <View style={[styles.card, responsiveStyles.card]}>
      {/* Content container - fades in when background is turquoise */}
      <View style={[styles.content, dynamicStyles.content]}>
        <h2 style={{margin: 0, padding: 0, marginBottom: 32}}>
          <LyristText style={[styles.headline, dynamicStyles.headline, responsiveStyles.headline]} weight="Medium">
            Take your songwriting to the next level
          </LyristText>
        </h2>

        {/* Plan selector - right after headline */}
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
                hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
                style={({pressed}) => [
                  styles.planOption,
                  dynamicStyles.planOption,
                  responsiveStyles.planOption,
                  isSelected && [styles.planSelected, dynamicStyles.planSelected],
                  isHovered && styles.planHovered,
                  pressed && {opacity: 0.8},
                ]}>
                <LyristText
                  style={[
                    styles.planPrice,
                    responsiveStyles.planPrice,
                    isSelected ? dynamicStyles.planPriceSelected : dynamicStyles.planPrice,
                  ]}
                  weight="Medium">
                  {plan.price}
                </LyristText>
                <LyristText
                  style={[
                    styles.planPeriod,
                    responsiveStyles.planPeriod,
                    isSelected ? dynamicStyles.planPeriodSelected : dynamicStyles.planPeriod,
                  ]}>
                  {plan.period}
                </LyristText>
              </Pressable>
            );
          })}
        </View>

        {/* CTA - right after plans */}
        <Pressable
          style={({pressed}) => [
            styles.ctaButton,
            dynamicStyles.ctaButton,
            responsiveStyles.ctaButton,
            processing && styles.ctaDisabled,
            pressed && {opacity: 0.9, transform: 'scale(0.98)'},
          ]}
          onPress={handleCheckout}
          onHoverIn={() => setCtaHovered(true)}
          onHoverOut={() => setCtaHovered(false)}
          disabled={processing}>
          <LyristText style={[styles.ctaText, dynamicStyles.ctaText, responsiveStyles.ctaText]} weight="Medium">
            {processing ? 'Loading...' : 'Start 3-day free trial'}
          </LyristText>
        </Pressable>

        {/* Benefits - two columns on desktop, single on mobile */}
        <View style={[styles.benefitsContainer, small && styles.benefitsContainerMobile, {gap: small ? 0 : large ? 64 : 32, marginTop: small ? 20 : large ? 48 : 32}]}>
          {/* Current benefits */}
          <View style={styles.benefitsColumn}>
            <LyristText style={[styles.benefitsHeader, dynamicStyles.headline, {fontSize: small ? 14 : large ? 24 : 18, marginBottom: small ? 8 : 12}]} weight="Medium">
              What you get
            </LyristText>
            <View style={[styles.benefits, {gap: small ? 6 : large ? 12 : 8}]}>
              {BENEFITS.map((benefit, i) => (
                <View key={i} style={[styles.benefitItem, dynamicStyles.benefitItem, {paddingVertical: small ? 4 : large ? 10 : 6, paddingHorizontal: small ? 8 : large ? 16 : 12}]}>
                  <View style={[styles.benefitIconWrapper, small && {width: 14, height: 14}]}>
                    <IoDiamond
                      size={small ? 10 : large ? 18 : 14}
                      color="#fff"
                      className="diamond-sparkle"
                      style={{animationDelay: `${i * 0.4}s`}}
                    />
                  </View>
                  <LyristText style={[styles.benefitText, dynamicStyles.benefitText, {fontSize: responsiveStyles.benefitText.fontSize}]}>
                    {benefit}
                  </LyristText>
                </View>
              ))}
            </View>
          </View>
          {/* Coming soon */}
          <View style={[styles.benefitsColumn, small && {marginTop: 20}]}>
            <LyristText style={[styles.benefitsHeader, dynamicStyles.headline, {fontSize: small ? 14 : large ? 24 : 18, marginBottom: small ? 8 : 12}]} weight="Medium">
              Coming soon
            </LyristText>
            <View style={[styles.benefits, {gap: small ? 6 : large ? 12 : 8}]}>
              {COMING_SOON.map((feature, i) => (
                <View key={i} style={[styles.benefitItem, dynamicStyles.benefitItem, {paddingVertical: small ? 4 : large ? 10 : 6, paddingHorizontal: small ? 8 : large ? 16 : 12}]}>
                  <View style={[styles.benefitIconWrapper, small && {width: 14, height: 14}]}>
                    <IoEllipseOutline size={small ? 10 : large ? 16 : 12} color="rgba(255,255,255,0.5)" />
                  </View>
                  <LyristText style={[styles.benefitText, dynamicStyles.benefitText, {fontSize: responsiveStyles.benefitText.fontSize, opacity: 0.7}]}>
                    {feature}
                  </LyristText>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    padding: 96,
    maxWidth: 1200,
    width: '100%',
  },
  title: {
    fontSize: 16,
    letterSpacing: 3,
    color: TURQUOISE,
    marginBottom: 24,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  headline: {
    fontSize: 48,
    color: '#000',
    textAlign: 'center',
  },
  content: {
    width: '100%',
    alignSelf: 'center',
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
    borderRadius: 16,
  },
  planSelected: {
    borderColor: TURQUOISE,
    backgroundColor: TURQUOISE,
  },
  planHovered: {
    borderColor: '#ccc',
  },
  planPrice: {
    fontSize: 40,
    color: '#000',
  },
  planPeriod: {
    fontSize: 16,
    color: '#888',
    marginTop: 8,
    textTransform: 'uppercase',
  },
  planPriceSelected: {
    color: '#fff',
  },
  planPeriodSelected: {
    color: 'rgba(255,255,255,0.7)',
  },
  ctaButton: {
    backgroundColor: TURQUOISE,
    paddingVertical: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  ctaDisabled: {
    opacity: 0.5,
  },
  ctaText: {
    color: '#fff',
    fontSize: 24,
  },
  loading: {
    textAlign: 'center',
    color: '#999',
    padding: 80,
    fontSize: 16,
  },
  hasPlus: {
    textAlign: 'center',
    fontSize: 24,
    color: '#000',
    marginBottom: 32,
  },
});
