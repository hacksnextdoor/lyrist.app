'use client';
import {useEffect, useMemo, useRef} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {FaAppStoreIos, FaCheck, FaGooglePlay, FaRegStar, FaStar} from 'react-icons/fa';
import {LyristText} from 'packages/components';
import {TURQUOISE} from 'packages/constants';

const CARD_WIDTH = 260;
const CARD_GAP = 12;
const AUTO_SCROLL_SPEED = 0.09;
const LOOP_MULTIPLIER = 4;
const RESUME_DELAY_MS = 1200;

function ReviewCard({review}) {
  return (
    <View style={[styles.reviewCard, styles.cardShadow]}>
      <View style={{flexDirection: 'row', marginBottom: 8}}>
        {Array.from({length: review.stars}).map((_, idx) => (
          <FaStar key={`star-${idx}`} color="#FEBB43" style={{marginRight: 2}} size={16} />
        ))}
        {Array.from({length: 5 - review.stars}).map((_, idx) => (
          <FaRegStar key={`empty-${idx}`} color="#FEBB43" style={{marginRight: 2}} size={16} />
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
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12}}>
          <FaCheck color={TURQUOISE} size={12} />
          <LyristText style={{color: TURQUOISE, fontSize: 16}} weight="Medium">
            Feature Added
          </LyristText>
        </View>
      )}
    </View>
  );
}

export function ReviewStack({reviews = []}) {
  const scrollRef = useRef(null);
  const scrollOffset = useRef(0);
  const isUserInteracting = useRef(false);
  const resumeTimeout = useRef(null);
  const rafId = useRef(null);
  const lastTimestamp = useRef(0);

  const cardWidth = CARD_WIDTH + CARD_GAP;

  const duplicatedReviews = useMemo(() => {
    if (!reviews.length) {
      return [];
    }

    const extended = [];
    for (let i = 0; i < LOOP_MULTIPLIER; i += 1) {
      reviews.forEach((review, idx) => {
        extended.push({review, key: `${i}-${idx}-${review.name}`});
      });
    }
    return extended;
  }, [reviews]);

  const loopWidth = duplicatedReviews.length * cardWidth;

  useEffect(() => {
    if (!loopWidth) {
      return undefined;
    }

    const animate = timestamp => {
      if (!lastTimestamp.current) {
        lastTimestamp.current = timestamp;
      }
      const delta = timestamp - lastTimestamp.current;
      lastTimestamp.current = timestamp;

      if (!isUserInteracting.current && scrollRef.current) {
        scrollOffset.current += delta * AUTO_SCROLL_SPEED;
        if (scrollOffset.current >= loopWidth) {
          scrollOffset.current -= loopWidth;
        }
        scrollRef.current.scrollTo({x: scrollOffset.current, animated: false});
      }

      rafId.current = requestAnimationFrame(animate);
    };

    rafId.current = requestAnimationFrame(animate);

    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [loopWidth]);

  useEffect(() => {
    return () => {
      if (resumeTimeout.current) {
        clearTimeout(resumeTimeout.current);
      }
    };
  }, []);

  const pauseAutoScroll = () => {
    isUserInteracting.current = true;
    if (resumeTimeout.current) {
      clearTimeout(resumeTimeout.current);
    }
  };

  const resumeAutoScroll = event => {
    if (event?.nativeEvent?.contentOffset?.x >= 0) {
      scrollOffset.current = event.nativeEvent.contentOffset.x;
      if (loopWidth > 0) {
        scrollOffset.current %= loopWidth;
        scrollRef.current?.scrollTo({x: scrollOffset.current, animated: false});
      }
    }

    resumeTimeout.current = setTimeout(() => {
      isUserInteracting.current = false;
      lastTimestamp.current = 0; // prevents jump on resume
    }, RESUME_DELAY_MS);
  };

  const handleHoldStart = () => {
    pauseAutoScroll();
  };

  const handleHoldEnd = event => {
    resumeAutoScroll(event);
  };

  const handleScroll = event => {
    scrollOffset.current = event.nativeEvent.contentOffset.x;
    if (loopWidth > 0 && scrollOffset.current >= loopWidth) {
      scrollOffset.current %= loopWidth;
      scrollRef.current?.scrollTo({x: scrollOffset.current, animated: false});
    }
  };

  if (!duplicatedReviews.length) {
    return null;
  }

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
      style={styles.container}
      onTouchStart={handleHoldStart}
      onTouchEnd={handleHoldEnd}
      onTouchCancel={handleHoldEnd}
      onMouseDown={handleHoldStart}
      onMouseUp={handleHoldEnd}
      onMouseLeave={handleHoldEnd}
      onPointerDown={handleHoldStart}
      onPointerUp={handleHoldEnd}
      onScrollBeginDrag={pauseAutoScroll}
      onScrollEndDrag={resumeAutoScroll}
      onMomentumScrollEnd={resumeAutoScroll}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      decelerationRate="fast">
      {duplicatedReviews.map(item => (
        <View key={item.key} style={styles.cardWrapper}>
          <ReviewCard review={item.review} />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 16,
    overflow: 'hidden',
    userSelect: 'none',
    WebkitUserSelect: 'none',
  },
  scrollContent: {
    paddingHorizontal: 0,
    userSelect: 'none',
    WebkitUserSelect: 'none',
  },
  cardWrapper: {
    width: CARD_WIDTH,
    marginRight: CARD_GAP,
  },
  reviewCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    minHeight: 200,
    userSelect: 'none',
    WebkitUserSelect: 'none',
  },
  cardShadow: {
    shadowColor: '#171717',
    shadowOffset: {width: 0.3, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
});
