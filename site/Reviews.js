'use client';
import {useMemo} from 'react';
import {FaAppStoreIos, FaCheck, FaGooglePlay, FaRegStar, FaStar} from 'react-icons/fa';
import {StyleSheet, View} from 'react-native';
import {LyristText} from 'packages/components';
import {SectionTitle} from './SectionTitle';
import {TURQUOISE} from 'packages/constants';
import {useScale} from 'packages/hooks/useScale';
import reviews from '../reviews.json';
import {ReviewStack} from './ReviewStack';

export function Reviews() {
  const {small, medium, large} = useScale();
  const pagePadding = useMemo(() => (small ? 32 : medium ? 40 : 48), [small, medium]);
  const numCols = large ? 3 : 2;
  const columns = useMemo(() => {
    const cols = Array.from({length: numCols}, () => []);
    reviews.forEach((review, i) => {
      cols[i % numCols].push(review);
    });
    return cols;
  }, [numCols]);

  return (
    <View style={{gap: small ? 16 : medium ? 24 : 32}}>
      <SectionTitle>The people love their songwriting toolkit</SectionTitle>
      {small ? (
        <View style={{marginHorizontal: -pagePadding}}>
          <ReviewStack reviews={reviews} />
        </View>
      ) : (
        <View
          style={{
            flexDirection: 'row',
            gap: small ? 8 : 16,
            alignItems: 'flex-start',
          }}>
          {columns.map((col, colIndex) => (
            <View key={colIndex} style={{flex: 1, gap: small ? 8 : 16}}>
              {col.map((review, i) => (
                <View key={i} style={[styles.reviewCard, styles.cardShadow]}>
                  <View style={{flexDirection: 'row', marginBottom: 8}}>
                    {Array.from(Array(review.stars), (_, k) => (
                      <FaStar key={k} color="#FEBB43" style={{marginRight: 2}} size={16} />
                    ))}
                    {Array.from(Array(5 - review.stars), (_, k) => (
                      <FaRegStar key={k} color="#FEBB43" style={{marginRight: 2}} size={16} />
                    ))}
                  </View>
                  <LyristText style={{fontSize: 16, marginBottom: 8, lineHeight: 24}}>
                    "{review.content}"
                  </LyristText>
                  <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
                    {review.name === 'Malia-M' ? (
                      <FaGooglePlay size={16} color="#CCC" />
                    ) : (
                      <FaAppStoreIos size={16} color="#CCC" />
                    )}
                    <LyristText weight="Medium" style={{fontSize: 16}}>
                      {review.name}
                    </LyristText>
                  </View>
                  {review.feature && (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 8,
                        marginTop: 12,
                      }}>
                      <FaCheck color={TURQUOISE} size={12} />
                      <LyristText style={{color: TURQUOISE, fontSize: 16}} weight="Medium">
                        Feature Added
                      </LyristText>
                    </View>
                  )}
                </View>
              ))}
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    justifyContent: 'center',
    borderRadius: 8,
    gap: 16,
    backgroundColor: TURQUOISE,
  },
  cardShadow: {
    shadowColor: '#171717',
    shadowOffset: {width: 0.3, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  reviewCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    contain: 'layout style paint',
  },
});
