'use client';
import Image from 'next/image';
import Link from 'next/link';
import {ScrollView, StyleSheet, View, useWindowDimensions} from 'react-native';
import {LyristText} from '../components';
import {ContactFooter, ContactOverlay} from './ContactFooter';
import {ReleaseCard} from './ReleaseCard';
import type {Artist} from './data';

export interface ArtistScreenProps {
  artist: Artist;
}

export function ArtistScreen({artist}: ArtistScreenProps) {
  const {width, height} = useWindowDimensions();
  const isWide = width >= 900;

  if (isWide) {
    return (
      <View style={[styles.container, {height}]}>
        <ScrollView
          style={styles.scrollColumn}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <LyristText style={styles.artistName} weight="Medium">
              {artist.name}
            </LyristText>
            <LyristText style={styles.bio}>{artist.bio}</LyristText>
          </View>

          <LyristText style={styles.sectionTitle} weight="Medium">
            Press Releases
          </LyristText>

          <View style={styles.releaseList}>
            {artist.releases.map(release => (
              <ReleaseCard
                key={release.slug}
                release={release}
                artistSlug={artist.slug}
                artistName={artist.name}
              />
            ))}
          </View>
        </ScrollView>

        <Link
          href={artist.site}
          target={'_blank'}
          style={{flexBasis: '33.333%', flexGrow: 0, flexShrink: 0, position: 'relative', height}}>
          <Image
            src={artist.image}
            alt={artist.name}
            fill
            sizes="33vw"
            priority
            style={{objectFit: 'cover'}}
          />
          <ContactOverlay artist={artist} img={artist.image} />
        </Link>
      </View>
    );
  }

  // Mobile layout
  return (
    <ScrollView contentContainerStyle={styles.mobileContainer}>
      <View style={styles.header}>
        <LyristText style={styles.artistName} weight="Medium">
          {artist.name}
        </LyristText>
        <LyristText style={styles.bio}>{artist.bio}</LyristText>
      </View>

      <LyristText style={styles.sectionTitle} weight="Medium">
        Releases
      </LyristText>

      <View style={styles.releaseList}>
        {artist.releases.map(release => (
          <ReleaseCard
            key={release.slug}
            release={release}
            artistSlug={artist.slug}
            artistName={artist.name}
          />
        ))}
      </View>
      <Link href={artist.site} target={'_blank'}>
        <ContactFooter artist={artist} img={artist.image} />
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
  scrollColumn: {
    flexBasis: '66.666%',
    flexGrow: 0,
    flexShrink: 0,
  },
  scrollContent: {
    padding: 48,
    paddingRight: 64,
  },
  mobileContainer: {
    padding: 24,
  },
  header: {
    marginBottom: 32,
  },
  artistName: {
    fontSize: 32,
    marginBottom: 16,
  },
  bio: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  },
  sectionTitle: {
    fontSize: 16,
    letterSpacing: 1.2,
    color: '#666',
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  releaseList: {
    gap: 16,
  },
});
