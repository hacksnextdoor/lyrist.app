'use client';
import Image from 'next/image';
import Link from 'next/link';
import {useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useScale} from '../packages/hooks/useScale';
import {LyristText} from '../packages/components';

export function Navbar() {
  const {small, large} = useScale();
  const [hoveredItem, setHoveredItem] = useState(null);

  const handleNavClick = (e, href) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({behavior: 'smooth', block: 'start'});
      }
    }
  };

  const navItems = [
    {label: 'Reviews', href: '#reviews', internal: true},
    {label: 'Plus', href: '#pricing', internal: true},
    {label: 'Roadmap', href: '#roadmap', internal: true},
    {label: 'FAQ', href: '/faq', external: true},
    {label: 'Terms of Use', href: '/terms', external: true},
    {label: 'Privacy Policy', href: '/privacy', external: true},
    {label: 'Contact Us', href: 'mailto:lyrist.app@gmail.com', external: false},
  ];

  return (
    <View style={styles.section}>
      <View
        style={[
          styles.subSection,
          !large && {flexDirection: 'column', alignItems: 'flex-start', gap: 20},
        ]}>
        <View style={[styles.navigation, !large && {flexDirection: 'column'}]}>
          {navItems.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              style={{textDecoration: hoveredItem === index ? 'underline black' : 'none'}}
              target={item.external ? '_blank' : undefined}
              onClick={item.internal ? e => handleNavClick(e, item.href) : undefined}>
              <Pressable
                onHoverIn={() => setHoveredItem(index)}
                onHoverOut={() => setHoveredItem(null)}>
                <LyristText style={{fontSize: small ? 16 : 24}}>{item.label}</LyristText>
              </Pressable>
            </Link>
          ))}
        </View>
        <Link
          href="https://www.producthunt.com/posts/lyrist?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-lyrist"
          target="_blank">
          <Image
            src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=402246&theme=light"
            alt="Lyrist - Write&#0032;lyrics&#0032;to&#0032;music&#0032;you&#0032;find&#0032;online | Product Hunt"
            width={250}
            height={54}
          />
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    alignSelf: 'center',
    maxWidth: 1400,
    width: '100%',
  },
  subSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navigation: {
    flexDirection: 'row',
    gap: 20,
  },
  social: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 120,
  },
});
