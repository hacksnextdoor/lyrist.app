'use client';
import Image from 'next/image';
import Link from 'next/link';
import {ScrollView, StyleSheet, View} from 'react-native';
import {LyristText} from '../components';
import {useScale} from '../../hooks';
import {CREAM_BACKGROUND} from '../constants';
import {memo, useEffect, useMemo, useState} from 'react';

const SpotifyIframe = memo(() => (
  <View style={styles.widget}>
    <iframe
      title="Spotify player for Right One by Peyt Spencer"
      style={{borderRadius: 12, height: 152, marginBottom: -8}}
      src="https://open.spotify.com/embed/track/6UdiHSxkfvXlrRwaZi2qZp?utm_source=generator&theme=0"
      frameBorder={0}
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
    />
  </View>
));

export function ReleaseScreen() {
  const {small, medium} = useScale();
  const fontSize = small ? 16 : medium ? 20 : 24;
  const lineHeight = small ? 24 : medium ? 28 : 32;
  const textStyles = useMemo(
    () => ({
      paragraph: {...styles.paragraph, fontSize, lineHeight, marginBottom: fontSize},
      quote: {...styles.quote, fontSize, lineHeight, marginBottom: fontSize},
    }),
    [fontSize, lineHeight],
  );

  // HACK FOR AVOIDING HYDRATION FAILURES
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  // DELETE THIS EVENTUALLY

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <LyristText style={styles.title} weight={'Medium'}>
        Peyt Spencer Finds The "Right One” in His Summer Solstice Release
      </LyristText>

      <LyristText style={[textStyles.paragraph, {fontStyle: 'italic', marginBottom: -8}]}>
        Bellevue, WA – June 24, 2025
      </LyristText>

      <SpotifyIframe />

      <LyristText style={textStyles.paragraph}>
        As a rising talent in both music and tech worlds, Peyt Spencer hits a new high with his
        latest single,{' '}
        <LyristText style={[textStyles.paragraph, {fontStyle: 'italic'}]}>Right One</LyristText>,
        delivering an anthem celebrating honesty, loyalty, and genuine connection. His lyrics
        capture the essence of nurturing meaningful relationships, mirroring his own journey of
        personal growth and exploration:
      </LyristText>

      <LyristText style={textStyles.quote}>
        They say "truthfulness is the foundation of all human virtues"{'\n'}I promise I won't lie or
        do anything to hurt you{'\n'}
        Ya presence is a gift I probably don't deserve you{'\n'}
        Take you out for dinner I'm never gonna desert you{'\n'}
      </LyristText>

      <LyristText style={textStyles.paragraph}>
        His bars are vulnerable, yet charming. Fresh off his five-year anniversary,{' '}
        <LyristText style={[textStyles.paragraph, {fontStyle: 'italic'}]}>Right One</LyristText>{' '}
        doubles as a quiet tribute:
      </LyristText>

      <LyristText style={textStyles.quote}>
        Love lights a flame in the heart that is cold{'\n'}
        All that glimmers don't compare to a heart that is gold{'\n'}
        The hardship of heartbreak we both been thru it{'\n'}
        My last name same as yours has a ring to it
      </LyristText>

      <LyristText style={textStyles.paragraph}>
        For clever wordplay that makes you smile, stream{' '}
        <LyristText style={[textStyles.paragraph, {fontStyle: 'italic'}]}>Right One</LyristText> now
        on all platforms.
      </LyristText>

      <LyristText style={styles.contactHeader}>Contact</LyristText>
      <LyristText style={[textStyles.paragraph, {marginBottom: 8}]}>
        Inspired by the Baha'i Faith, with thoughtful insight into the fundamentals of hip-hop, and
        a flow that wastes no bars, you can follow his grind on Instagram.
      </LyristText>
      <Link href={'https://www.instagram.com/peytspencer'} target={'_blank'}>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
          <Image alt={'instagram'} src={'/instagram.png'} width={32} height={32} />
          <LyristText style={styles.link}>@peytspencer</LyristText>
        </View>
      </Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 32,
    backgroundColor: '#fff',
    maxWidth: 1200,
    paddingBottom: 128,
  },
  title: {
    fontSize: 32,
    marginBottom: 8,
  },
  location: {
    fontSize: 24,
    fontStyle: 'italic',
  },
  paragraph: {
    fontSize: 24,
    lineHeight: 32,
    marginBottom: 32,
  },
  quote: {
    fontSize: 24,
    fontStyle: 'italic',
    lineHeight: 32,
    marginBottom: 32,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
    padding: 16,
    backgroundColor: CREAM_BACKGROUND,
  },
  contactHeader: {
    fontSize: 32,
    marginBottom: 8,
  },
  link: {
    fontSize: 24,
  },
  widget: {paddingVertical: 32, maxWidth: 600, width: '100%'},
});
