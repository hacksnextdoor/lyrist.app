'use client';
import {useState, useCallback, useMemo, memo} from 'react';
import {View, Pressable, StyleSheet, ActivityIndicator} from 'react-native';
import {useAuthContext} from '../packages/context';
import {LyristText} from '../packages/components';
import {useScale} from '../packages/hooks/useScale';
import {TURQUOISE, LYRIST_BLUE} from '../packages/constants';
import {FaCheck} from 'react-icons/fa';
import createCheckoutSession from '../app/actions/stripe';
import {SectionTitle} from './SectionTitle';

const SUBSCRIPTION_OPTIONS = [
  {
    name: 'Weekly',
    price: '$2.99',
    productId: 'prod_TVAhh6lveiGasR',
    period: '1 week',
    discount: null,
    recurring: {interval: 'week', interval_count: 1},
  },
  {
    name: 'Monthly',
    price: '$9.99',
    productId: 'prod_NPZeELRcg81f06',
    period: '1 month',
    discount: '23% OFF',
    recurring: {interval: 'month', interval_count: 1},
  },
  {
    name: 'Yearly',
    price: '$69.99',
    productId: 'prod_NPZe7uNfwmqrAC',
    period: '1 year',
    discount: '55% OFF',
    recurring: {interval: 'year', interval_count: 1},
  },
];

const PLUS_FEATURES = [
  'Unlimited pages',
  'Unlimited AI-powered suggestions',
  'Organize your work with folders',
  'Record your ideas (soon)',
  'LyrAssist (soon)',
  'Lyrist Connect (soon)',
];

const FREE_FEATURES = [
  'Access your data across multiple devices',
  'Search YouTube and SoundCloud',
  'Find rhymes and other related words',
  'Import audio from urls',
  "Time yourself to overcome writer's block",
  'Chat with us for help or feedback',
];

export const PricingSection = memo(function PricingSection({
  header,
  showFeatures = true,
  showMessage = true,
}) {
  const {small, medium, large} = useScale();
  const {user, hasPlus, plusLoading} = useAuthContext();
  const [hoveredPriceCard, setHoveredPriceCard] = useState(null);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [processingCheckout, setProcessingCheckout] = useState(null); // Track which option is processing

  const pageGap = useMemo(() => (small ? 32 : medium ? 48 : 64), [small, medium]);

  const handlePricingClick = useCallback(
    async option => {
      // Prevent double-clicking
      if (processingCheckout) {
        return;
      }

      // If we're still checking plus status, wait
      if (plusLoading) {
        return;
      }

      // If user already has plus, redirect to app
      if (hasPlus) {
        window.location.href = '/search';
        return;
      }

      // If not logged in, show auth modal
      if (!user) {
        setShowOtpModal(true);
        return;
      }

      // If logged in but no plus, create checkout session
      try {
        setProcessingCheckout(option.name);

        // Get the actual pricing data from Stripe
        const pricingResponse = await fetch('/api/pricing');

        if (!pricingResponse.ok) {
          throw new Error('Failed to fetch pricing data');
        }

        const pricingData = await pricingResponse.json();

        // Find the matching price based on the product ID
        const matchingPrice = pricingData.find(item => {
          return item.product.id === option.productId;
        });

        if (!matchingPrice) {
          console.error(
            'Available prices:',
            pricingData.map(p => p.product.name),
          );
          throw new Error(
            `No ${option.name} subscription found in Stripe. Please contact support.`,
          );
        }

        // Verify user email exists
        if (!user.email) {
          throw new Error('User email not found. Please sign in again.');
        }

        // Create the line item for Stripe
        const lineItem = {
          price: matchingPrice.price.id,
          quantity: 1,
        };

        // Call the server action to create checkout session
        await createCheckoutSession(lineItem, matchingPrice.price.recurring, user.uid, user.email);
      } catch (error) {
        console.error('Checkout error:', error);

        // Provide user-friendly error messages
        let errorMessage = 'Failed to start checkout. Please try again.';

        if (error.message?.includes('No') && error.message?.includes('subscription found')) {
          errorMessage = error.message;
        } else if (error.message?.includes('email')) {
          errorMessage = 'Unable to verify your email. Please sign out and sign in again.';
        } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        }

        alert(errorMessage);
      } finally {
        setProcessingCheckout(null);
      }
    },
    [user, hasPlus, plusLoading, processingCheckout],
  );
  return (
    <View>
      <View style={{marginBottom: large ? 64 : 48, alignItems: 'center'}}>
        <SectionTitle>{header}</SectionTitle>
      </View>

      {/* PRICING */}
      <View>
        {/* Plus and Free Features Side by Side */}
        {showFeatures && (
          <View style={{alignItems: 'center', marginBottom: pageGap}}>
            <View
              style={{
                flexDirection: medium || large ? 'row' : 'column',
                gap: medium || large ? 48 : 32, // keeps spacing stable
              }}>
              {/* Plus */}
              <View style={{minWidth: 0}}>
                <LyristText
                  style={{
                    fontSize: 24,
                    marginBottom: 24,
                    textAlign: 'left',
                  }}
                  weight="Medium">
                  What you get with Lyrist Plus
                </LyristText>

                <View style={{gap: 16}}>
                  {PLUS_FEATURES.map((feature, i) => (
                    <View key={i} style={styles.featureItemRow}>
                      <FaCheck color={TURQUOISE} size={20} />
                      <LyristText style={{fontSize: 16}}>{feature}</LyristText>
                    </View>
                  ))}
                </View>
              </View>

              {/* Free */}
              <View style={{minWidth: 0}}>
                <LyristText
                  style={{
                    fontSize: 24,
                    marginBottom: 24,
                    textAlign: 'left',
                  }}
                  weight="Medium">
                  What you get for free
                </LyristText>

                <View style={{gap: 16}}>
                  {FREE_FEATURES.map((feature, i) => (
                    <View key={i} style={styles.featureItemRow}>
                      <FaCheck color="#333" size={20} />
                      <LyristText style={{fontSize: 16}}>{feature}</LyristText>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Subscription Options */}
        <View
          style={[
            styles.subscriptionBar,
            {flexDirection: large ? 'row' : 'column', marginBottom: 32},
          ]}>
          {SUBSCRIPTION_OPTIONS.map((option, i) => {
            const isHovered = hoveredPriceCard === `bottom-${i}`;
            const isProcessing = processingCheckout === option.name;
            const showDivider = i > 0;
            return (
              <Pressable
                key={i}
                onPress={() => handlePricingClick(option)}
                onHoverIn={() => setHoveredPriceCard(`bottom-${i}`)}
                onHoverOut={() => setHoveredPriceCard(null)}
                disabled={processingCheckout !== null}
                style={{flex: 1}}>
                <View
                  style={[
                    styles.subscriptionSegment,
                    large && showDivider && styles.subscriptionSegmentDivider,
                    !large && showDivider && styles.subscriptionSegmentDividerVertical,
                    isHovered && styles.subscriptionSegmentHovered,
                    processingCheckout !== null && styles.subscriptionSegmentDisabled,
                  ]}>
                  {option.discount && (
                    <View style={styles.discountBadgeAbsolute}>
                      <LyristText style={{color: 'white', fontSize: 13}} weight="Medium">
                        {option.discount}
                      </LyristText>
                    </View>
                  )}
                  <View
                    style={{
                      gap: 8,
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                    }}>
                    {isProcessing ? (
                      <>
                        <ActivityIndicator color={LYRIST_BLUE} />
                        <LyristText style={{fontSize: 14}}>Processing...</LyristText>
                      </>
                    ) : plusLoading ? (
                      <>
                        <LyristText>{option.period}</LyristText>
                        <LyristText style={{fontSize: 48, lineHeight: 44}} weight="Medium">
                          {option.price}
                        </LyristText>
                        <ActivityIndicator size="small" color={LYRIST_BLUE} />
                      </>
                    ) : (
                      <>
                        <LyristText>{option.period}</LyristText>
                        <LyristText style={{fontSize: 48, lineHeight: 44}} weight="Medium">
                          {option.price}
                        </LyristText>
                        <LyristText>{hasPlus ? 'Go to app' : 'Start 3-day free trial'}</LyristText>
                      </>
                    )}
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* Ad-free Support Message */}
        <View style={{alignItems: 'center', marginBottom: pageGap}}>
          <LyristText style={{fontSize: small ? 16 : 24, textAlign: 'justify'}}>
            We would like to stay ad-free for as long as possible. Consider supporting Lyrist by
            purchasing Plus.
          </LyristText>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  subscriptionBar: {
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.15)',
    borderRadius: 32,
    overflow: 'hidden',
    backgroundColor: '#F5F5F7',
  },
  subscriptionSegment: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
    transition: 'background-color 0.2s ease',
    position: 'relative',
  },
  subscriptionSegmentHovered: {
    backgroundColor: 'rgba(64,214,195,0.08)',
  },
  subscriptionSegmentDivider: {
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  subscriptionSegmentDividerVertical: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  discountBadgeAbsolute: {
    position: 'absolute',
    right: 20,
    top: '20%',
    transform: [{translateY: -14}],
    backgroundColor: TURQUOISE,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  featureItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: TURQUOISE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subscriptionSegmentDisabled: {
    opacity: 0.6,
  },
});
