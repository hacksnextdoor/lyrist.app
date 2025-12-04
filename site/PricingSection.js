'use client';
import {useState, useCallback, useMemo, memo} from 'react';
import {View, Pressable, StyleSheet} from 'react-native';
import {useAuthContext} from '../packages/context';
import {useLoading} from '../packages/context/LoadingProvider';
import {LyristText} from '../packages/components';
import {useScale} from '../packages/hooks/useScale';
import {LYRIST_BLUE, TURQUOISE} from '../packages/constants';
import {FaCheck, FaMinus, FaWrench, FaPause} from 'react-icons/fa';
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

// Status: 'yes' = available, 'wip' = work in progress, 'planned' = planned, 'paused' = paused, 'no' = not available
const ALL_FEATURES = [
  // Plus features
  {name: 'Unlimited pages', tier: 'plus', mobile: 'yes', web: 'yes'},
  {name: 'Unlimited smart suggestions', tier: 'plus', mobile: 'yes', web: 'yes'},
  {name: 'Folders', tier: 'plus', mobile: 'yes', web: 'wip'},
  {name: 'Record your ideas', tier: 'plus', mobile: 'planned', web: 'planned'},
  {name: 'Import local audio files', tier: 'plus', mobile: 'planned', web: 'planned'},
  {name: 'Sync text with audio via timestamps', tier: 'plus', mobile: 'planned', web: 'planned'},
  {name: 'Lyrist Connect (social)', tier: 'plus', mobile: 'planned', web: 'planned'},
  {name: 'Color themes', tier: 'plus', mobile: 'planned', web: 'planned'},
  // Free features
  {name: 'Cross-device sync', tier: 'free', mobile: 'yes', web: 'yes'},
  {name: 'Search YouTube', tier: 'free', mobile: 'yes', web: 'yes'},
  {name: 'Search SoundCloud', tier: 'free', mobile: 'yes', web: 'yes'},
  {name: 'Rhymes & related words', tier: 'free', mobile: 'yes', web: 'planned'},
  {name: 'Import audio from URLs', tier: 'free', mobile: 'yes', web: 'planned'},
  {name: 'Writing timer', tier: 'free', mobile: 'yes', web: 'planned'},
  {name: 'Chat support', tier: 'free', mobile: 'yes', web: 'planned'},
];

const StatusIcon = ({status}) => {
  if (status === 'yes') return <FaCheck color={TURQUOISE} size={16} />;
  if (status === 'wip') return <FaWrench color={LYRIST_BLUE} size={14} title="In progress" />;
  if (status === 'planned') return <FaWrench color="#999" size={14} title="Planned" />;
  return <FaMinus color="#ccc" size={14} />;
};

export const PricingSection = memo(function PricingSection({
  header,
  showFeatures = true,
  showMessage = true,
}) {
  const {small, medium, large} = useScale();
  const {user, hasPlus, plusLoading, setOpenAuthModal} = useAuthContext();
  const {showLoading, hideLoading, setLoadingMessage, isLoading} = useLoading();
  const [hoveredPriceCard, setHoveredPriceCard] = useState(null);
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
        setProcessingCheckout(option.name);
        showLoading('Going to app...');
        window.location.href = '/search';
        return;
      }

      // If not logged in, show auth modal from context
      if (!user) {
        setOpenAuthModal(true);
        return;
      }

      // If logged in but no plus, create checkout session
      try {
        setProcessingCheckout(option.name);
        showLoading('Preparing checkout...');

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

        setLoadingMessage('Redirecting to checkout...');

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
        hideLoading();
      }
    },
    [
      user,
      hasPlus,
      plusLoading,
      processingCheckout,
      setOpenAuthModal,
      showLoading,
      hideLoading,
      setLoadingMessage,
    ],
  );
  return (
    <View>
      <View style={{marginBottom: large ? 48 : 32, alignItems: 'center'}}>
        <SectionTitle>{header}</SectionTitle>
      </View>

      {/* Consolidated Feature & Pricing Table */}
      <View>
        {showFeatures && (
          <View style={{alignItems: 'center', marginBottom: pageGap}}>
            <View style={{width: '100%', maxWidth: 700}}>
              {/* Plus Section with Pricing */}
              <View style={styles.tierSection}>
                {/* Pricing Row - Full Width, Prominent */}
                <View style={styles.pricingRow}>
                  <LyristText
                    style={{
                      fontSize: small ? 16 : 18,
                      color: '#333',
                      marginBottom: 20,
                      textAlign: 'center',
                    }}
                    weight="Medium">
                    Become a member today
                  </LyristText>
                  <View style={[styles.pricingContainer, small && {gap: 8}]}>
                    {SUBSCRIPTION_OPTIONS.map((opt, i) => (
                      <Pressable
                        key={i}
                        onPress={() => handlePricingClick(opt)}
                        onHoverIn={() => setHoveredPriceCard(`price-${i}`)}
                        onHoverOut={() => setHoveredPriceCard(null)}
                        disabled={processingCheckout !== null}
                        style={{flex: 1, maxWidth: large ? 240 : medium ? 200 : 140}}>
                        <View
                          style={[
                            styles.priceCard,
                            medium && styles.priceCardMedium,
                            large && styles.priceCardLarge,
                            hoveredPriceCard === `price-${i}` && styles.priceCardHovered,
                          ]}>
                          {opt.discount && (
                            <View
                              style={[styles.discountBadge, large && styles.discountBadgeLarge]}>
                              <LyristText
                                style={{color: 'white', fontSize: large ? 12 : 10}}
                                weight="Medium">
                                {opt.discount}
                              </LyristText>
                            </View>
                          )}
                          <LyristText
                            style={{
                              fontSize: large ? 16 : medium ? 14 : 11,
                              color: '#666',
                              textTransform: 'uppercase',
                              letterSpacing: 0.5,
                            }}>
                            {opt.period}
                          </LyristText>
                          <LyristText
                            weight="Medium"
                            style={{fontSize: large ? 40 : medium ? 32 : 22, color: '#000'}}>
                            {opt.price}
                          </LyristText>
                        </View>
                      </Pressable>
                    ))}
                  </View>
                  <LyristText
                    style={{fontSize: 12, color: '#666', marginTop: 8, textAlign: 'center'}}>
                    {plusLoading
                      ? 'Loading...'
                      : hasPlus
                      ? 'You have Plus! Go to app →'
                      : '3-day free trial included'}
                  </LyristText>
                </View>
                {/* Table Header */}
                <View style={[styles.tableRow, styles.tableHeader]}>
                  <View style={{flex: 2}}>
                    <LyristText weight="Medium" style={styles.tierHeaderText}>
                      What you get with Plus
                    </LyristText>
                  </View>
                  <View style={{flex: 1, alignItems: 'center'}}>
                    <LyristText weight="Medium" style={{fontSize: 14}}>
                      Mobile
                    </LyristText>
                  </View>
                  <View style={{flex: 1, alignItems: 'center'}}>
                    <LyristText weight="Medium" style={{fontSize: 14}}>
                      Web
                    </LyristText>
                  </View>
                </View>
                {/* Feature rows with Mobile/Web columns */}
                {ALL_FEATURES.filter(f => f.tier === 'plus').map((feature, i) => (
                  <View key={i} style={styles.tableRow}>
                    <View style={{flex: 2}}>
                      <LyristText style={{fontSize: small ? 13 : 15}}>{feature.name}</LyristText>
                    </View>
                    <View style={{flex: 1, alignItems: 'center'}}>
                      <StatusIcon status={feature.mobile} />
                    </View>
                    <View style={{flex: 1, alignItems: 'center'}}>
                      <StatusIcon status={feature.web} />
                    </View>
                  </View>
                ))}
              </View>

              <View style={styles.tierSection}>
                <View style={styles.tierHeaderRowFree}>
                  <View style={{flex: 2}}>
                    <LyristText weight="Medium" style={styles.tierHeaderText}>
                      What you get for free
                    </LyristText>
                  </View>
                  <View style={{flex: 1, alignItems: 'center'}}>
                    <LyristText weight="Medium" style={{fontSize: 14}}>
                      Mobile
                    </LyristText>
                  </View>
                  <View style={{flex: 1, alignItems: 'center'}}>
                    <LyristText weight="Medium" style={{fontSize: 14}}>
                      Web
                    </LyristText>
                  </View>
                </View>
                {ALL_FEATURES.filter(f => f.tier === 'free').map((feature, i) => (
                  <View key={i} style={styles.tableRow}>
                    <View style={{flex: 2}}>
                      <LyristText style={{fontSize: small ? 13 : 15}}>{feature.name}</LyristText>
                    </View>
                    <View style={{flex: 1, alignItems: 'center'}}>
                      <StatusIcon status={feature.mobile} />
                    </View>
                    <View style={{flex: 1, alignItems: 'center'}}>
                      <StatusIcon status={feature.web} />
                    </View>
                  </View>
                ))}
              </View>

              {/* Legend */}
              <View style={styles.legend}>
                <View style={styles.legendItem}>
                  <FaCheck color={TURQUOISE} size={12} />
                  <LyristText style={{fontSize: 11, color: '#666'}}>Available</LyristText>
                </View>
                <View style={styles.legendItem}>
                  <FaWrench color={LYRIST_BLUE} size={11} />
                  <LyristText style={{fontSize: 11, color: '#666'}}>In progress</LyristText>
                </View>
                <View style={styles.legendItem}>
                  <FaWrench color="#999" size={11} />
                  <LyristText style={{fontSize: 11, color: '#666'}}>Planned</LyristText>
                </View>
                {/* <View style={styles.legendItem}>
                  <FaPause color="#ccc" size={10} />
                  <LyristText style={{fontSize: 11, color: '#666'}}>Paused</LyristText>
                </View> */}
              </View>
            </View>
          </View>
        )}

        {/* Ad-free Support Message */}
        <View
          style={{alignItems: 'center', marginBottom: pageGap, paddingHorizontal: small ? 16 : 24}}>
          <LyristText style={{fontSize: small ? 16 : 20, textAlign: 'justify', maxWidth: 600}}>
            We would like to stay ad-free for as long as possible. Consider supporting Lyrist by
            purchasing Plus.
          </LyristText>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  // Table styles
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.08)',
  },
  tableHeader: {
    backgroundColor: '#F5F5F7',
    // borderTopLeftRadius: 12,
    // borderTopRightRadius: 12,
    paddingVertical: 14,
  },
  tierHeaderRowFree: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#F5F5F7',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  tierHeaderText: {
    fontSize: 18,
    color: '#111',
  },
  // Prominent pricing row
  pricingRow: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  pricingContainer: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  priceCard: {
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 10,
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    position: 'relative',
  },
  priceCardMedium: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 14,
  },
  priceCardLarge: {
    paddingVertical: 32,
    paddingHorizontal: 28,
    borderRadius: 16,
  },
  priceCardHovered: {
    borderColor: '#333',
    backgroundColor: '#F0F0F0',
    transform: [{scale: 1.02}],
  },
  discountBadge: {
    position: 'absolute',
    top: -10,
    right: -8,
    backgroundColor: TURQUOISE,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  discountBadgeLarge: {
    top: -12,
    right: -10,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  // Legacy styles (keeping for compatibility)
  priceChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(64,214,195,0.3)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  priceChipHovered: {
    backgroundColor: TURQUOISE,
    borderColor: TURQUOISE,
  },
  discountBadgeSmall: {
    backgroundColor: TURQUOISE,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 4,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 16,
    paddingVertical: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
});
