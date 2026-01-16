'use client';
import Image from 'next/image';
import Link from 'next/link';
import {useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {useScale} from '../packages/hooks/useScale';
import {LyristText} from '../packages/components';

export function Navbar() {
  const {small, medium, large} = useScale();
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

  const mainLinks = [
    {label: 'Reviews', href: '#reviews', internal: true},
    {label: 'Plus', href: '#pricing', internal: true},
    {label: 'Roadmap', href: '/roadmap'},
    {label: 'FAQ', href: '/faq'},
  ];

  const legalLinks = [
    {label: 'Terms', href: '/terms'},
    {label: 'Privacy', href: '/privacy'},
    {label: 'Contact', href: 'mailto:lyrist.app@gmail.com'},
  ];

  return (
    <View style={styles.container}>
      <View style={styles.divider} />
      <View style={[styles.content, small && styles.contentMobile]}>
        {/* Main Navigation */}
        <View style={[styles.navGroup, small && styles.navGroupMobile]}>
          {mainLinks.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              style={{textDecoration: 'none'}}
              onClick={item.internal ? e => handleNavClick(e, item.href) : undefined}>
              <Pressable
                onHoverIn={() => setHoveredItem(`main-${index}`)}
                onHoverOut={() => setHoveredItem(null)}
                style={({pressed}) => [
                  styles.navItem,
                  hoveredItem === `main-${index}` && styles.navItemHovered,
                  {
                    opacity: pressed ? 0.6 : 1,
                    transform: pressed ? 'scale(0.97)' : 'scale(1)',
                  },
                ]}>
                <LyristText style={styles.navText} weight="Medium">
                  {item.label}
                </LyristText>
              </Pressable>
            </Link>
          ))}
        </View>

        {/* Legal Links */}
        <View style={[styles.navGroup, styles.legalGroup, small && styles.navGroupMobile]}>
          {legalLinks.map((item, index) => (
            <Link key={item.href} href={item.href} style={{textDecoration: 'none'}}>
              <Pressable
                onHoverIn={() => setHoveredItem(`legal-${index}`)}
                onHoverOut={() => setHoveredItem(null)}
                style={({pressed}) => [
                  styles.legalItem,
                  {
                    opacity: pressed ? 0.5 : 1,
                    transform: pressed ? 'scale(0.97)' : 'scale(1)',
                  },
                ]}>
                <LyristText
                  style={[
                    styles.legalText,
                    hoveredItem === `legal-${index}` && styles.legalTextHovered,
                  ]}>
                  {item.label}
                </LyristText>
              </Pressable>
            </Link>
          ))}
        </View>

        {/* Product Hunt Badge */}
        <Link
          href="https://www.producthunt.com/posts/lyrist?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-lyrist"
          target="_blank"
          style={{alignSelf: small ? 'center' : 'flex-start'}}>
          <Image
            src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=402246&theme=light"
            alt="Lyrist on Product Hunt"
            width={small ? 200 : 180}
            height={small ? 43 : 39}
          />
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginBottom: 32,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 24,
  },
  contentMobile: {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: 20,
  },
  navGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  navGroupMobile: {
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  legalGroup: {
    gap: 16,
  },
  navItem: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    transition: 'background-color 0.2s ease',
  },
  navItemHovered: {
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  navText: {
    fontSize: 14,
    color: '#111',
  },
  legalItem: {
    paddingVertical: 4,
  },
  legalText: {
    fontSize: 13,
    color: '#666',
    transition: 'color 0.2s ease',
  },
  legalTextHovered: {
    color: '#111',
  },
});
