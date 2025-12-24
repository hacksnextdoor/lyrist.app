'use client';
import Link from 'next/link';
import {StyleSheet, View} from 'react-native';
import {LyristText} from '../components';
import {LYRIST_BLUE} from '../constants';
import {memo} from 'react';
import type {Release} from './data';

interface SpotifyEmbedCompactProps {
  trackId: string;
  title: string;
}

const SpotifyEmbedCompact = memo(({trackId, title}: SpotifyEmbedCompactProps) => (
  <iframe
    title={title}
    style={{borderRadius: 12, height: 80, width: '100%'}}
    src={`https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`}
    frameBorder={0}
    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
    loading="lazy"
  />
));

interface ReleaseCardProps {
  release: Release;
  artistSlug: string;
  artistName: string;
}

export function ReleaseCard({release, artistSlug, artistName}: ReleaseCardProps) {
  return (
    <Link
      href={`/records/${artistSlug}/${release.slug}`}
      style={{textDecoration: 'none', display: 'block'}}>
      <View style={styles.card}>
        <SpotifyEmbedCompact
          trackId={release.spotifyTrackId}
          title={`${release.title} by ${artistName}`}
        />
        <View style={styles.cardContent}>
          <LyristText style={styles.title} weight="Medium" numberOfLines={2}>
            {release.headline}
          </LyristText>
          <LyristText style={styles.readMore}>Read Press Release →</LyristText>
        </View>
      </View>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#000',
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 16,
    gap: 8,
  },
  title: {
    fontSize: 18,
    color: '#fff',
  },
  readMore: {
    fontSize: 14,
    color: LYRIST_BLUE,
  },
});
