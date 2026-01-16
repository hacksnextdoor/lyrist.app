'use client';
import {useMemo} from 'react';
import {FaAppStoreIos, FaCheck, FaGooglePlay, FaRegStar, FaStar} from 'react-icons/fa';
import {StyleSheet, View} from 'react-native';
import {LyristText} from 'packages/components';
import {TURQUOISE} from 'packages/constants';
import {useScale} from 'packages/hooks/useScale';
import reviews from '../reviews.json';
import {ReviewStack} from './ReviewStack';

export function Reviews({maxPerColumn}) {
  const {small, medium, large} = useScale();
  const pagePadding = useMemo(() => (small ? 24 : medium ? 48 : 48), [small, medium]);
  const numCols = large ? 3 : 2;
  const columns = useMemo(() => {
    const cols = Array.from({length: numCols}, () => []);
    reviews.forEach((review, i) => {
      cols[i % numCols].push(review);
    });
    // Limit reviews per column if maxPerColumn is specified
    if (maxPerColumn) {
      return cols.map(col => col.slice(0, maxPerColumn));
    }
    return cols;
  }, [numCols, maxPerColumn]);

  return (
    <View>
      {small ? (
        <View style={{marginHorizontal: -pagePadding, paddingBottom: 8, overflow: 'visible'}}>
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
                        marginTop: 16,
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
    boxShadow: '0.3px 1px 3px rgba(23,23,23,0.2)',
  },
  reviewCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    contain: 'layout style paint',
  },
});
