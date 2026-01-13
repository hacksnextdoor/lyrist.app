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
          <View style={styles.button}>
            <LyristText style={styles.buttonText} weight="Medium">
              STAY CONNECTED AT PEYTSPENCER.COM
            </LyristText>
          </View>
        </View>
      </View>
    </View>
  );
}

export function ContactOverlay({artist}: ContactFooterProps) {
  return (
    <View style={styles.overlay}>
      <View style={styles.button}>
        <LyristText style={styles.buttonText} weight="Medium">
          STAY CONNECTED AT PEYTSPENCER.COM
        </LyristText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    marginTop: 32,
    marginHorizontal: -24,
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
  button: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  buttonText: {
    fontSize: 11,
    letterSpacing: 0.5,
    color: '#000',
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
  overlayText: {
    fontSize: 16,
    color: '#fff',
  },
});
