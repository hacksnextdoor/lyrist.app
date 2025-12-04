import {useEffect, useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {LyristText} from 'packages/components/LyristText';
import {useScale} from 'packages/hooks/useScale';
import {createFunction} from 'packages/utils/createFunction';
import {FaStar, FaStarHalfAlt} from 'react-icons/fa';
import {LYRIST_BLUE} from 'packages/constants';

const METRICS_CONFIG = [
  {id: 'authors', label: 'creatives'},
  {id: 'rating', isRating: true, label: 'rating', value: 4.5},
  {id: 'pages', label: 'songs'},
];

function formatNumber(num) {
  if (num === null) return '...';
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return new Intl.NumberFormat().format(num);
}

function AnimatedNumber({value, suffix = '', isDecimal = false}) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (value === null) return;

    const duration = 1500;
    const steps = 30;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(isDecimal ? current : Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value, isDecimal]);

  const formatted = isDecimal ? displayValue.toFixed(1) : formatNumber(displayValue);
  return <span style={{fontVariantNumeric: 'tabular-nums'}}>{formatted + suffix}</span>;
}

function StarRating({rating = 4.5, size = 16}) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  const color = '#FEBB43';

  return (
    <View style={{flexDirection: 'row', gap: 2, alignItems: 'center', justifyContent: 'center'}}>
      {[...Array(fullStars)].map((_, i) => (
        <FaStar key={i} color={color} size={size} />
      ))}
      {hasHalf && <FaStarHalfAlt color={color} size={size} />}
    </View>
  );
}

export function Metrics() {
  const {small, medium, large} = useScale();
  const [metricsData, setMetricsData] = useState({
    authors: null,
    pages: null,
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const [authorRes, pageRes] = await Promise.all([
          createFunction('getAuthorCount')(),
          createFunction('getPageCount')(),
        ]);

        setMetricsData({
          authors: authorRes.count,
          pages: pageRes.count,
        });
      } catch {}
    };

    fetchMetrics();
  }, []);

  return (
    <View style={styles.container}>
      <View style={[styles.metricsRow, small && styles.metricsRowMobile]}>
        {METRICS_CONFIG.map((metric, i) => {
          const value = metricsData[metric.id];
          const isLast = i === METRICS_CONFIG.length - 1;

          return (
            <>
              <View key={i} style={styles.metricItem}>
                <LyristText
                  style={[styles.metricValue, small && styles.metricValueMobile]}
                  weight="Medium">
                  {metric.value ? (
                    <AnimatedNumber value={metric.value} isDecimal />
                  ) : value !== null ? (
                    <AnimatedNumber value={value} />
                  ) : (
                    '...'
                  )}
                </LyristText>
                {metric.isRating ? (
                  <StarRating rating={4.5} size={small ? 14 : 18} />
                ) : (
                  <LyristText
                    style={[styles.metricLabel, small && styles.metricLabelMobile]}
                    weight="Medium">
                    {metric.label}
                  </LyristText>
                )}
              </View>
              {!isLast && <View style={[styles.divider, small && styles.dividerMobile]} />}
            </>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: LYRIST_BLUE,
    width: '100%',
    paddingVertical: 16,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: 900,
    marginHorizontal: 'auto',
  },
  metricsRowMobile: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  metricGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  metricItem: {
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
  },
  metricItemMobile: {
    paddingHorizontal: 12,
    gap: 4,
  },
  metricValue: {
    color: 'white',
    fontSize: 48,
    lineHeight: 48,
    fontVariantNumeric: 'tabular-nums',
  },
  metricValueMobile: {
    fontSize: 28,
    lineHeight: 28,
  },
  metricLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    textTransform: 'lowercase',
  },
  metricLabelMobile: {
    fontSize: 12,
  },
  divider: {
    width: 1,
    height: 50,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  dividerMobile: {
    height: 40,
  },
});
