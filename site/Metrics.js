import {useEffect, useState} from 'react';
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
  const {small, medium} = useScale();
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

  // Responsive sizes
  const valueFontSize = small ? 48 : medium ? 64 : 80;
  const labelFontSize = small ? 16 : medium ? 24 : 32;
  const starSize = small ? 16 : medium ? 24 : 32;
  const containerPadding = small ? 32 : medium ? 48 : 48;
  const verticalPadding = small ? 16 : medium ? 24 : 32;

  return (
    <View style={[styles.container, {paddingVertical: verticalPadding, alignItems: 'center'}]}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'flex-start',
          maxWidth: 1400,
          width: '100%',
          paddingHorizontal: containerPadding,
        }}>
        {METRICS_CONFIG.map((metric, i) => {
          const value = metricsData[metric.id];

          return (
            <View key={i} style={{alignItems: 'center'}}>
              <LyristText
                style={{
                  color: 'white',
                  fontSize: valueFontSize,
                  lineHeight: valueFontSize,
                  fontVariantNumeric: 'tabular-nums',
                }}
                weight="Medium">
                {metric.value ? (
                  <AnimatedNumber value={metric.value} isDecimal />
                ) : value !== null ? (
                  <AnimatedNumber value={value} />
                ) : (
                  '...'
                )}
              </LyristText>
              <View
                style={{
                  marginTop: 8,
                  height: labelFontSize,
                  justifyContent: 'center',
                }}>
                {metric.isRating ? (
                  <StarRating rating={4.5} size={starSize} />
                ) : (
                  <LyristText
                    style={{
                      color: 'rgba(255,255,255,0.8)',
                      fontSize: labelFontSize,
                      textTransform: 'lowercase',
                      lineHeight: labelFontSize,
                    }}
                    weight="Medium">
                    {metric.label}
                  </LyristText>
                )}
              </View>
            </View>
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
  },
});
