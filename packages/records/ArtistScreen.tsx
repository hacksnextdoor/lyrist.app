'use client';
import Image from 'next/image';
import Link from 'next/link';
import {useEffect, useState} from 'react';
import {Pressable, ScrollView, StyleSheet, View, useWindowDimensions} from 'react-native';
import {LyristText} from '../components';
import {ContactFooter, ContactOverlay} from './ContactFooter';
import {ReleaseCard} from './ReleaseCard';
import type {Artist} from './data';

export interface ArtistScreenProps {
  artist: Artist;
}

const REEL_LINK = 'https://www.instagram.com/peytspencer/reel/DLiQnoxSYQ8';
const REEL_TEXT =
  'a reel turning the Writings into a rap pulling in over 50,000 views during summer 2025';

function renderWithLinks(text: string) {
  if (!text.includes(REEL_TEXT)) return text;
  const parts = text.split(REEL_TEXT);
  return (
    <>
      {parts[0]}
      <Link href={REEL_LINK} target="_blank" style={styles.bioLink}>
        {REEL_TEXT}
      </Link>
      {parts[1]}
    </>
  );
}

function BioParagraphs({
  paragraphs,
  padding,
  onCollapse,
}: {
  paragraphs: string[];
  padding: {left: number; right: number};
  onCollapse: () => void;
}) {
  return (
    <>
      {paragraphs.map((paragraph, index) => (
        <div
          key={index}
          style={{
            backgroundColor: index === 0 || index === 2 ? '#f5f5f5' : undefined,
            paddingTop: index === 0 || index === 2 ? 16 : 0,
            paddingBottom: index === 0 || index === 2 ? 16 : 0,
            paddingLeft: padding.left,
            paddingRight: padding.right,
          }}>
          <LyristText style={styles.bioParagraph}>{renderWithLinks(paragraph)}</LyristText>
        </div>
      ))}
      <div style={{paddingLeft: padding.left, paddingRight: padding.right}}>
        <Pressable onPress={onCollapse}>
          <LyristText style={styles.readMore} weight="Medium">
            READ LESS ↑
          </LyristText>
        </Pressable>
      </div>
    </>
  );
}

export function ArtistScreen({artist}: ArtistScreenProps) {
  const {width, height} = useWindowDimensions();
  const [mounted, setMounted] = useState(false);
  const [bioExpanded, setBioExpanded] = useState(false);
  const [bioVisible, setBioVisible] = useState(false);

  useEffect(() => setMounted(true), []);

  const expandBio = () => {
    setBioVisible(true);
    requestAnimationFrame(() => setBioExpanded(true));
  };

  const collapseBio = () => {
    setBioExpanded(false);
    setTimeout(() => setBioVisible(false), 400);
  };

  const isWide = mounted && width >= 900;
  const paragraphs = artist.bio.split('\n\n').filter(p => p.trim());
  const padding = isWide ? {left: 48, right: 64} : {left: 24, right: 24};

  const headerContent = (
    <>
      <View>
        <LyristText style={styles.artistName} weight="Medium">
          {artist.name}
        </LyristText>
      </View>
      {!bioVisible ? (
        <Pressable onPress={expandBio}>
          <LyristText style={styles.tagline}>
            {paragraphs[0]}...{' '}
            <LyristText style={styles.readMore} weight="Medium">
              READ MORE ↓
            </LyristText>
          </LyristText>
        </Pressable>
      ) : (
        <LyristText style={styles.tagline}>
          {paragraphs[0]} {renderWithLinks(paragraphs[1])}
        </LyristText>
      )}
    </>
  );

  const expandedBio = (
    <div
      style={{
        maxHeight: bioExpanded ? 2000 : 0,
        overflow: 'hidden',
        transition: 'max-height 0.4s ease-in-out',
      }}>
      <View style={styles.bioContent}>
        <BioParagraphs
          paragraphs={paragraphs.slice(2)}
          padding={padding}
          onCollapse={collapseBio}
        />
      </View>
    </div>
  );

  const releases = artist.releases.map(release => (
    <ReleaseCard
      key={release.slug}
      release={release}
      artistSlug={artist.slug}
      artistName={artist.name}
    />
  ));

  if (isWide) {
    return (
      <View style={[styles.container, {height}]}>
        <Link
          href={artist.site}
          target="_blank"
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
        <div style={{flexBasis: '66.666%', flexGrow: 0, flexShrink: 0, overflowY: 'auto'}}>
          <div style={{paddingTop: 48, paddingBottom: 48}}>
            <div style={{paddingLeft: padding.left, paddingRight: padding.right, marginBottom: 16}}>
              {headerContent}
            </div>
            {expandedBio}
            <LyristText
              style={[
                styles.sectionTitle,
                {paddingLeft: padding.left, paddingRight: padding.right},
              ]}
              weight="Medium">
              Releases
            </LyristText>
            <View
              style={[
                styles.releaseList,
                {paddingLeft: padding.left, paddingRight: padding.right},
              ]}>
              {releases}
            </View>
          </div>
        </div>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.mobileContainer}>
      <div style={{paddingLeft: padding.left, paddingRight: padding.right, marginBottom: 16}}>
        {headerContent}
      </div>
      {expandedBio}
      <div style={{paddingLeft: padding.left, paddingRight: padding.right}}>
        <LyristText style={styles.sectionTitle} weight="Medium">
          Releases
        </LyristText>
        <View style={[styles.releaseList, {marginBottom: 32}]}>{releases}</View>
        <Link href={artist.site} target="_blank">
          <ContactFooter artist={artist} img={artist.image} />
        </Link>
      </div>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  mobileContainer: {
    paddingTop: 24,
    paddingBottom: 24,
  },
  artistName: {
    fontSize: 32,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  },
  readMore: {
    fontSize: 14,
    letterSpacing: 1.5,
    color: '#888',
    textTransform: 'uppercase',
  },
  bioContent: {
    gap: 16,
    marginBottom: 32,
  },
  bioParagraph: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  },
  bioLink: {
    color: '#007aff',
    textDecorationLine: 'underline',
  },
  sectionTitle: {
    fontSize: 14,
    letterSpacing: 1.5,
    color: '#888',
    marginTop: 16,
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  releaseList: {
    gap: 16,
    marginTop: 16,
  },
});
