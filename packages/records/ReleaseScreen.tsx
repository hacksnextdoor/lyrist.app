'use client';
import Image from 'next/image';
import Link from 'next/link';
import {ScrollView, StyleSheet, View, useWindowDimensions} from 'react-native';
import {LyristText} from '../components';
import {CREAM_BACKGROUND, LYRIST_BLUE} from '../constants';
import {ContactFooter, ContactOverlay} from './ContactFooter';
import {ReleaseCard} from './ReleaseCard';
import {memo, useMemo} from 'react';
import type {Artist, Release} from './data';

interface SpotifyEmbedProps {
  trackId: string;
  title: string;
}

const SpotifyEmbed = memo(({trackId, title}: SpotifyEmbedProps) => (
  <iframe
    title={title}
    style={{borderRadius: 8, height: 152, width: '100%', maxWidth: 600}}
    src={`https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`}
    frameBorder={0}
    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
    loading="lazy"
  />
));

export interface ReleaseScreenProps {
  artist: Artist;
  release: Release;
}

export function ReleaseScreen({artist, release}: ReleaseScreenProps) {
  const {width, height} = useWindowDimensions();
  const isWide = width >= 900;

  // Scale text to fill viewport - target ~85% of height for content
  // Base: 16px at 800px height, scale proportionally
  const baseFontSize = Math.max(14, Math.min(20, height * 0.018));
  const lineHeight = Math.round(baseFontSize * 1.5);

  const textStyles = useMemo(
    () => ({
      paragraph: {
        ...styles.paragraph,
        fontSize: baseFontSize,
        lineHeight,
      },
      quote: {
        ...styles.quote,
        fontSize: baseFontSize / 1.2,
        lineHeight,
      },
    }),
    [baseFontSize, lineHeight],
  );

  const articleContent = (
    <View style={styles.body}>
      <SpotifyEmbed
        trackId={release.spotifyTrackId}
        title={`Spotify player for ${release.title} by ${artist.name}`}
      />

      <LyristText style={textStyles.paragraph}>{release.intro}</LyristText>

      {release.quotes.map((quote, i) => (
        <View key={i}>
          {quote.pre && (
            <LyristText style={{...textStyles.paragraph, marginBottom: 8}}>{quote.pre}</LyristText>
          )}
          <LyristText style={textStyles.quote}>{quote.lines.join('\n')}</LyristText>
        </View>
      ))}
      <LyristText style={textStyles.paragraph}>{release.outro}</LyristText>
    </View>
  );

  const otherReleasesContent = (
    <View style={isWide ? styles.otherReleases : styles.otherReleasesMobile}>
      <LyristText style={styles.otherReleasesTitle} weight="Medium">
        More Releases
      </LyristText>
      {artist.releases
        .filter(r => r.slug !== release.slug)
        .map(r => (
          <ReleaseCard key={r.slug} release={r} artistSlug={artist.slug} artistName={artist.name} />
        ))}
      <Link href={`/records/${artist.slug}`} style={{textDecoration: 'none'}}>
        <LyristText style={styles.allReleasesLink}>← All Releases</LyristText>
      </Link>
    </View>
  );

  if (isWide) {
    return (
      <View style={[styles.container, {height}]}>
        <Link
          href={artist.site}
          target="_blank"
          style={{flexBasis: '33.333%', flexGrow: 0, flexShrink: 0, position: 'relative', height}}>
          <Image
            src={release.performanceImage}
            alt={artist.name}
            fill
            sizes="33vw"
            priority
            style={{objectFit: 'cover'}}
          />
          <ContactOverlay artist={artist} img={release.performanceImage} />
        </Link>
        <View style={styles.contentColumn}>
          <View style={styles.header}>
            <LyristText style={styles.kicker}>PRESS RELEASE</LyristText>
            <LyristText style={styles.title} weight={'Medium'}>
              {release.headline}
            </LyristText>
          </View>
          <View style={styles.twoColumn}>
            {articleContent}
            {otherReleasesContent}
          </View>
        </View>
      </View>
    );
  }

  // Mobile layout
  return (
    <ScrollView contentContainerStyle={styles.mobileContainer}>
      <View style={styles.header}>
        <LyristText style={styles.kicker}>PRESS RELEASE</LyristText>
        <LyristText style={styles.title} weight={'Medium'}>
          {release.headline}
        </LyristText>
      </View>
      {articleContent}
      {otherReleasesContent}
      <Link href={artist.site} target={'_blank'}>
        <ContactFooter artist={artist} img={release.performanceImage} />
      </Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  contentColumn: {
    flexBasis: '66.666%',
    flexGrow: 0,
    flexShrink: 0,
    padding: 48,
    paddingRight: 64,
    overflow: 'auto' as any,
  },
  twoColumn: {
    flexDirection: 'row',
    gap: 32,
    alignItems: 'flex-start',
  },
  mobileContainer: {
    padding: 24,
  },
  header: {
    marginBottom: 32,
    borderBottomWidth: 2,
    borderBottomColor: '#000',
    paddingBottom: 24,
  },
  kicker: {
    fontSize: 16,
    letterSpacing: 1.5,
    color: LYRIST_BLUE,
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    lineHeight: 40,
  },
  body: {
    gap: 16,
    flex: 1,
  },
  paragraph: {
    fontSize: 16,
  },
  quote: {
    fontStyle: 'italic',
    lineHeight: 24,
    borderLeftWidth: 4,
    borderLeftColor: LYRIST_BLUE,
    padding: 16,
    backgroundColor: CREAM_BACKGROUND,
  },
  otherReleases: {
    gap: 16,
    width: 280,
    flexShrink: 0,
  },
  otherReleasesMobile: {
    gap: 16,
    marginTop: 32,
  },
  otherReleasesTitle: {
    fontSize: 13,
    letterSpacing: 1.2,
    color: '#666',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  allReleasesLink: {
    fontSize: 16,
    color: LYRIST_BLUE,
    marginTop: 8,
  },
});
