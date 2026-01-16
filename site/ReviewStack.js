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
  const hasInitialized = useRef(false);

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

  // Width of one full set of reviews
  const singleSetWidth = reviews.length * cardWidth;
  const loopWidth = duplicatedReviews.length * cardWidth;

  // Initialize scroll position to the middle (start of 2nd set) for bidirectional scrolling
  useEffect(() => {
    if (!hasInitialized.current && scrollRef.current && singleSetWidth > 0) {
      const initialOffset = singleSetWidth; // Start at beginning of 2nd set
      scrollRef.current.scrollTo({x: initialOffset, animated: false});
      scrollOffset.current = initialOffset;
      hasInitialized.current = true;
    }
  }, [singleSetWidth]);

  useEffect(() => {
    if (!loopWidth || !singleSetWidth) {
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

        // Wrap around when reaching the end (keep within middle sets)
        if (scrollOffset.current >= singleSetWidth * 3) {
          scrollOffset.current -= singleSetWidth;
          scrollRef.current.scrollTo({x: scrollOffset.current, animated: false});
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
  }, [loopWidth, singleSetWidth]);

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

  const normalizeScrollPosition = (offset) => {
    if (singleSetWidth <= 0) return offset;

    // Keep scroll position within the middle two sets for seamless looping
    if (offset < singleSetWidth * 0.5) {
      // Scrolled too far left - jump forward by one set
      return offset + singleSetWidth;
    } else if (offset >= singleSetWidth * 2.5) {
      // Scrolled too far right - jump back by one set
      return offset - singleSetWidth;
    }
    return offset;
  };

  const resumeAutoScroll = event => {
    if (event?.nativeEvent?.contentOffset?.x >= 0) {
      scrollOffset.current = event.nativeEvent.contentOffset.x;

      // Normalize position for seamless looping
      const normalized = normalizeScrollPosition(scrollOffset.current);
      if (normalized !== scrollOffset.current) {
        scrollOffset.current = normalized;
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

    // Check bounds and loop if needed
    const normalized = normalizeScrollPosition(scrollOffset.current);
    if (normalized !== scrollOffset.current) {
      scrollOffset.current = normalized;
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
    paddingBottom: 16,
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
    boxShadow: '0.3px 1px 3px rgba(23,23,23,0.2)',
  },
});
