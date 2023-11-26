import {useEffect, useRef, useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {FaRegStar, FaStar} from 'react-icons/fa';
import reviews from '../reviews.json';
import {useScale} from '../hooks';
import {LyristText} from '../packages/components';
import {SlArrowLeft, SlArrowRight} from 'react-icons/sl';
import {LYRIST_BLUE} from '../packages/constants';

let minAllowed = 5000;
let maxAllowed = 12000;
let minmaxCalculated = false;
let min = Infinity;
let max = -Infinity;

const gray = 'rgba(0, 0, 0, 0.5)';

function scaleBetween(unscaledNum) {
  if (!minmaxCalculated) {
    minmaxCalculated = true;
    for (let {content} of reviews) {
      if (content.length < min) min = content.length;
      if (content.length > max) max = content.length;
    }
  }
  return ((maxAllowed - minAllowed) * (unscaledNum - min)) / (max - min) + minAllowed;
}

export function Reviews() {
  const {small, medium} = useScale();
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentReview = reviews[currentIndex];
  const {content, name, stars} = currentReview;
  let ms = scaleBetween(currentReview.content.length);
  const [x, setX] = useState(ms);

  const msRef = useRef();
  const ICON_SIZE = small ? 16 : medium ? 24 : 32;

  useEffect(() => {
    msRef.current = setInterval(() => {
      setX(prev => prev - 1000);
    }, 1000);

    if (x <= 0) {
      setCurrentIndex(prev => {
        let val;
        if (prev === reviews.length - 1) {
          val = 0;
        } else {
          val = prev + 1;
        }
        setX(scaleBetween(reviews[val].content.length));
        return val;
      });
    }

    return () => msRef.current && clearInterval(msRef.current);
  }, [x]);

  return (
    <div id={'reviews'}>
      <View style={styles.section}>
        <LyristText style={{fontSize: ICON_SIZE * 2, textAlign: 'center'}} weight={'SemiBold'}>
          The people love it
        </LyristText>
        <View style={[styles.reviews]}>
          <View
            style={[
              {
                justifyContent: 'center',
                height: small ? 240 : medium ? 320 : 400,
              },
            ]}>
            <View
              style={[
                styles.card,
                styles.cardShadow,
                {
                  flexDirection: 'column',
                  backgroundColor: '#F9F9F9',
                  minWidth: small ? 300 : medium ? 270 : 240,
                },
                small && {gap: 8, padding: 16},
                medium && {gap: 12, padding: 24},
              ]}>
              <View style={styles.stars}>
                {Array.from(Array(stars), (_, k) => (
                  <FaStar key={k} color="#FEBB43" style={{marginRight: 2}} size={small ? 16 : 24} />
                ))}
                {Array.from(Array(5 - stars), (_, k) => (
                  <FaRegStar
                    key={k}
                    color="#FEBB43"
                    style={{marginRight: 2}}
                    size={small ? 16 : 24}
                  />
                ))}
              </View>
              <Text style={[styles.content, {fontSize: small ? 16 : 24}]}>{content}</Text>
              <View
                style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text style={[styles.name, {fontSize: small ? 16 : 24}]}>{name}</Text>
                {msRef.current && (
                  <View
                    style={{
                      width: ICON_SIZE,
                      height: ICON_SIZE,
                      borderRadius: ICON_SIZE / 2,
                      borderWidth: small ? 3 : 6,
                      borderTopColor: x <= 0.75 * ms ? 'transparent' : LYRIST_BLUE,
                      borderRightColor:
                        x <= 0.5 * ms
                          ? 'transparent'
                          : x <= 0.75 * ms
                          ? `${LYRIST_BLUE}CC`
                          : LYRIST_BLUE,
                      borderBottomColor:
                        x <= 0.25 * ms
                          ? 'transparent'
                          : x <= 0.5 * ms
                          ? `${LYRIST_BLUE}80`
                          : x <= 0.75 * ms
                          ? `${LYRIST_BLUE}CC`
                          : LYRIST_BLUE,
                      borderLeftColor:
                        x <= 0
                          ? 'transparent'
                          : x <= 0.25 * ms
                          ? `${LYRIST_BLUE}40`
                          : x <= 0.5 * ms
                          ? `${LYRIST_BLUE}80`
                          : x <= 0.75 * ms
                          ? `${LYRIST_BLUE}CC`
                          : LYRIST_BLUE,
                      transform: 'rotate(45deg)',
                    }}
                  />
                )}
              </View>
            </View>
          </View>
          <View style={[styles.sliderPagination, small && {gap: 8}]}>
            <Pressable
              onPress={() => {
                if (msRef.current) {
                  clearInterval(msRef.current);
                  msRef.current = null;
                }
                setCurrentIndex(prev => (prev === 0 ? reviews.length - 1 : prev - 1));
              }}>
              <SlArrowLeft color={gray} size={ICON_SIZE} />
            </Pressable>
            {reviews.map((_, index) => (
              <Pressable
                key={index}
                onPress={() => {
                  if (msRef.current) {
                    clearInterval(msRef.current);
                    msRef.current = null;
                  }
                  setCurrentIndex(index);
                }}
                style={styles.sliderPaginationDotContainer}>
                <View
                  style={[
                    styles.sliderPaginationDot,
                    {
                      backgroundColor: index === currentIndex ? LYRIST_BLUE : gray,
                    },
                    {
                      width: ICON_SIZE / 2,
                      height: ICON_SIZE / 2,
                      borderRadius: ICON_SIZE / 4,
                    },
                  ]}
                />
              </Pressable>
            ))}
            <Pressable
              onPress={() => {
                if (msRef.current) {
                  clearInterval(msRef.current);
                  msRef.current = null;
                }
                setCurrentIndex(prev => (prev === reviews.length - 1 ? 0 : prev + 1));
              }}>
              <SlArrowRight color={gray} size={ICON_SIZE} />
            </Pressable>
          </View>
        </View>
      </View>
    </div>
  );
}
const DEFAULT_DOT_SIZE = 16;
const styles = StyleSheet.create({
  section: {
    width: '100%',
    gap: 24,
    padding: 24,
  },
  reviews: {
    alignSelf: 'center',
    alignItems: 'center',
    gap: 24,
    maxWidth: 500,
  },
  card: {
    justifyContent: 'center',
    borderRadius: 8,
    gap: 16,
    padding: 32,
  },
  cardShadow: {
    shadowColor: '#171717',
    shadowOffset: {width: 0.3, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  name: {
    fontFamily: 'Fira Sans',
    fontWeight: '600',
  },
  stars: {
    flexDirection: 'row',
  },
  content: {
    fontFamily: 'Fira Sans',
    fontSize: 32,
  },
  sliderPagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  sliderPaginationDotContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderPaginationDot: {
    width: DEFAULT_DOT_SIZE,
    height: DEFAULT_DOT_SIZE,
    borderRadius: DEFAULT_DOT_SIZE / 2,
  },
});
