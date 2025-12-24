'use client';
import Image from 'next/image';
import {StyleSheet, View} from 'react-native';
import {LyristText} from '../components';
import type {Artist, Release} from './data';

export interface ContactFooterProps {
  artist: Artist;
  img: Artist['image'] | Release['performanceImage'];
}

export function ContactFooter({artist, img}: ContactFooterProps) {
  return (
    <View style={styles.footer}>
      <View style={styles.imageContainer}>
        <Image
          src={img}
          alt={artist.name}
          width={800}
          height={0}
          style={{width: '100%', height: 'auto'}}
        />
        <View style={styles.mobileOverlay}>
          <LyristText style={styles.overlayText}>Stay connected at peytspencer.com</LyristText>
        </View>
      </View>
    </View>
  );
}

export function ContactOverlay({artist}: ContactFooterProps) {
  return (
    <View style={styles.overlay}>
      <LyristText style={styles.overlayText}>Stay connected at peytspencer.com</LyristText>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    marginTop: 32,
    marginHorizontal: -24,
    marginBottom: -24,
  },
  imageContainer: {
    position: 'relative' as any,
    width: '100%',
  },
  mobileOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 24,
    background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 100%)',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingTop: 24,
    background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 100%)',
  },
  instagramLinkOverlay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  overlayText: {
    fontSize: 16,
    color: '#fff',
  },
});
