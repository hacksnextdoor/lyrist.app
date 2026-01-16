'use client';
import Link from 'next/link';
import {StyleSheet, View} from 'react-native';
import {useScale} from '../packages/hooks/useScale';
import {LyristText} from '../packages/components';
import {TryInput} from './TryInput';
import {Badges} from './Badges';

export function Footer({showTryInput = false}) {
  const {small} = useScale();

  const links = [
    {label: 'Roadmap', href: '/roadmap'},
    {label: 'FAQ', href: '/faq'},
    {label: 'Terms', href: '/terms'},
    {label: 'Privacy', href: '/privacy'},
  ];

  return (
    <View style={styles.container}>
      {showTryInput && (
        <View style={styles.tryInputSection}>
          <TryInput showStamp />
          <Badges />
        </View>
      )}
      <View style={[styles.content, small && styles.contentMobile]}>
        <View style={styles.links}>
          {links.map((link, i) => (
            <Link key={link.href} href={link.href} style={{textDecoration: 'none'}}>
              <LyristText style={styles.link}>{link.label}</LyristText>
            </Link>
          ))}
        </View>
        <LyristText style={styles.copyright}>© 2025 Lyrist</LyristText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingTop: 48,
    paddingBottom: 24,
  },
  tryInputSection: {
    gap: 32,
    marginBottom: 48,
    alignItems: 'center',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contentMobile: {
    flexDirection: 'column',
    gap: 24,
    alignItems: 'center',
  },
  links: {
    flexDirection: 'row',
    gap: 32,
  },
  link: {
    fontSize: 16,
    color: '#888',
  },
  copyright: {
    fontSize: 16,
    color: '#bbb',
  },
});
