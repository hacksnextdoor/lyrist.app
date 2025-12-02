import {useEffect, useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {LyristText} from 'packages/components/LyristText';
import {useScale} from 'packages/hooks/useScale';
import {createFunction} from 'packages/utils/createFunction';
import {LYRIST_PINK} from 'packages/constants';

const METRICS_CONFIG = [
  {id: 'authors', label: 'creatives who joined'},
  {id: 'pages', label: 'songs in the making'},
  {id: 'rating', label: 'on the App Store', value: '4.5 stars'},
];

function formatNumber(num) {
  return num === null ? '...' : new Intl.NumberFormat().format(num);
}

export function Metrics() {
  const {small, medium, large} = useScale();
  const pagePadding = useMemo(() => (small ? 32 : medium ? 40 : 48), [small, medium]);
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
    <View style={[styles.metricsGrid, !large && styles.metricsGridMobile, {padding: pagePadding}]}>
      {METRICS_CONFIG.map((metric, i) => (
        <View key={i} style={styles.metricItem}>
          <LyristText style={{color: 'white', fontSize: 48}} weight="Medium">
            {metric.value ? metric.value : formatNumber(metricsData[metric.id])}
          </LyristText>
          <LyristText style={{color: 'white', fontSize: 24}}>{metric.label}</LyristText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  metricsGrid: {
    backgroundColor: LYRIST_PINK,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  metricsGridMobile: {
    flexDirection: 'column',
    gap: 32,
    alignItems: 'center',
  },
  metricItem: {
    alignItems: 'center',
    gap: 8,
  },
});
