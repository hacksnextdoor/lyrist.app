import Link from 'next/link';
import {useEffect, useRef, useState} from 'react';
import {FaRegStar, FaStar} from 'react-icons/fa';
import {SlArrowLeft, SlArrowRight} from 'react-icons/sl';
import {Pressable, ScrollView, StyleSheet, View} from 'react-native';
import {useScale} from '../hooks';
import {LyristText} from '../packages/components';
import {LYRIST_BLUE} from '../packages/constants';
import reviews from '../reviews.json';

let minAllowed = 5000;
let maxAllowed = 12000;
let minmaxCalculated = false;
let min = Infinity;
let max = -Infinity;

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
  const [line0, setLine0] = useState(false);

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

  const goToNext = () => {
    if (msRef.current) {
      clearInterval(msRef.current);
      msRef.current = null;
    }
    setCurrentIndex(prev => (prev === reviews.length - 1 ? 0 : prev + 1));
  };

  const goToPrevious = () => {
    if (msRef.current) {
      clearInterval(msRef.current);
      msRef.current = null;
    }
    setCurrentIndex(prev => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  return (
    <div id={'reviews'}>
      <View style={[styles.reviews]}>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
          <Pressable onPress={goToPrevious} disabled={reviews.length <= 1} style={styles.button}>
            <SlArrowLeft
              color={reviews.length <= 1 ? disabledGray : 'black'}
              size={ICON_SIZE}
              style={{alignSelf: 'flex-start'}}
            />
          </Pressable>
          <View style={{flex: 1}}>
            <LyristText
              style={[styles.paginationText, {fontSize: small ? 24 : medium ? 32 : 40}]}
              weight={'Medium'}>
              Thousands love their{' '}
              <Link role="link" href={'#features'} style={{textDecoration: 'none'}}>
                <Pressable onHoverIn={() => setLine0(true)} onHoverOut={() => setLine0(false)}>
                  <LyristText
                    style={[
                      styles.paginationText,
                      {color: LYRIST_BLUE},
                      line0 && {textDecorationLine: 'underline'},
                      {fontSize: small ? 24 : medium ? 32 : 40},
                    ]}
                    weight={'Medium'}>
                    all-in-one
                  </LyristText>
                </Pressable>
              </Link>{' '}
              toolkit
            </LyristText>
          </View>
          <Pressable onPress={goToNext} disabled={reviews.length <= 1} style={styles.button}>
            <SlArrowRight
              color={reviews.length <= 1 ? disabledGray : 'black'}
              size={ICON_SIZE}
              style={{alignSelf: 'flex-end'}}
            />
          </Pressable>
        </View>
        <View style={[styles.card, styles.cardShadow, (small || medium) && {marginBottom: 32}]}>
          <View style={styles.stars}>
            {Array.from(Array(stars), (_, k) => (
              <FaStar
                key={k}
                color="#FEBB43"
                style={{marginRight: 2}}
                size={small ? 16 : medium ? 24 : 32}
              />
            ))}
            {Array.from(Array(5 - stars), (_, k) => (
              <FaRegStar
                key={k}
                color="#FEBB43"
                style={{marginRight: 2}}
                size={small ? 16 : medium ? 24 : 32}
              />
            ))}
          </View>
          <ScrollView
            key={currentIndex}
            style={styles.reviewScroll} // maxHeight not strictly needed since parent is fixed
            showsVerticalScrollIndicator={false}>
            <LyristText style={{fontSize: small ? 16 : medium ? 24 : 32, fontStyle: 'italic'}}>
              {content}
            </LyristText>
          </ScrollView>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 12}}>
            <LyristText style={{fontSize: small ? 16 : medium ? 24 : 32}} weight={'Medium'}>
              {name}
            </LyristText>
            {msRef.current && (
              <View
                style={{
                  width: ICON_SIZE,
                  height: ICON_SIZE,
                  borderRadius: ICON_SIZE / 2,
                  borderWidth: small ? 3 : medium ? 4 : 6,
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
    </div>
  );
}

const styles = StyleSheet.create({
  reviews: {
    gap: 16,
  },
  card: {
    flexGrow: 1,
    justifyContent: 'center',
    borderRadius: 8,
    gap: 16,
    padding: 32,
    backgroundColor: 'white',
  },
  cardShadow: {
    shadowColor: '#171717',
    shadowOffset: {width: 0.3, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  stars: {
    flexDirection: 'row',
  },
  reviewScroll: {
    flexGrow: 0,
  },
  sliderPagination: {
    flexDirection: 'row',
    gap: 16,
  },
  paginationText: {
    fontSize: 32,
    textAlign: 'center',
  },
  button: {
    borderRadius: 999,
    padding: 12,
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    // Android elevation
    elevation: 2,
    backgroundColor: 'white',
  },
});
