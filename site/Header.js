'use client';
import Image from 'next/image';
import Link from 'next/link';
import {useRouter, usePathname} from 'next/navigation';
import {useState} from 'react';
import {Pressable, View} from 'react-native';
import {useScale} from 'packages/hooks/useScale';
import {LyristText} from 'packages/components';
import {useAuthContext} from 'packages/context';
import {LYRIST_BLUE} from 'packages/constants';

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const {scale, small, medium} = useScale();
  const styles = createStyles(scale);
  const [hoveredItem, setHoveredItem] = useState(null);
  const {user, setOpenAuthModal} = useAuthContext();

  const isHomePage = pathname === '/';

  const handlePlusClick = e => {
    if (isHomePage) {
      e?.preventDefault?.();
      const element = document.querySelector('#pricing');
      if (element) {
        element.scrollIntoView({behavior: 'smooth', block: 'start'});
      }
    } else {
      router.push('/#pricing');
    }
  };

  const isMobile = small || medium;

  return (
    <View style={styles.section}>
      <View style={styles.subSection}>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: isMobile ? 16 : 24}}>
          <Link href="/" style={{textDecoration: 'none'}}>
            <View style={styles.logoContainer}>
              <Image alt="Lyrist - Songwriting App Logo" src={'/logo.png'} fill />
            </View>
          </Link>
          <Pressable
            onPress={handlePlusClick}
            onHoverIn={() => setHoveredItem('plus')}
            onHoverOut={() => setHoveredItem(null)}
            hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}
            style={({pressed}) => ({
              padding: 8,
              margin: -8,
              opacity: pressed ? 0.5 : 1,
              transform: pressed ? 'scale(0.97)' : 'scale(1)',
              transition: 'all 0.1s ease',
            })}>
            <LyristText
              style={{
                fontSize: isMobile ? 16 : 24,
                textDecorationLine: hoveredItem === 'plus' ? 'underline' : 'none',
              }}>
              Plus
            </LyristText>
          </Pressable>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 16}}>
          {user ? (
            <Pressable
              onPress={() => router.push('/search')}
              onHoverIn={() => setHoveredItem('session')}
              onHoverOut={() => setHoveredItem(null)}
              hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}
              style={({pressed}) => ([
                styles.sessionButton,
                hoveredItem === 'session' && styles.sessionButtonHover,
                {
                  opacity: pressed ? 0.7 : 1,
                  transform: pressed ? 'scale(0.97)' : 'scale(1)',
                  transition: 'all 0.1s ease',
                },
              ])}>
              <LyristText style={{fontSize: isMobile ? 16 : 24}}>
                {user?.displayName ?? 'Go to app'}
              </LyristText>
            </Pressable>
          ) : (
            <Pressable
              onPress={() => setOpenAuthModal(true)}
              onHoverIn={() => setHoveredItem('signin')}
              onHoverOut={() => setHoveredItem(null)}
              hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}
              style={({pressed}) => ({
                padding: 8,
                margin: -8,
                opacity: pressed ? 0.5 : 1,
                transform: pressed ? 'scale(0.97)' : 'scale(1)',
                transition: 'all 0.1s ease',
              })}>
              <LyristText
                style={{
                  fontSize: isMobile ? 16 : 24,
                  textDecorationLine: hoveredItem === 'signin' ? 'underline' : 'none',
                }}>
                Sign in
              </LyristText>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

const createStyles = scale => ({
  section: {
    maxWidth: 1400,
    width: '100%',
    alignSelf: 'center',
  },
  subSection: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 140.4375 / 1.5,
    minHeight: 47.625 / 1.5,
    maxWidth: 140.4375 * 1.5,
    maxHeight: 47.625 * 1.5,
    width: scale(140.4375),
    height: scale(47.625),
  },
  sessionButton: {
    borderWidth: 1,
    borderColor: LYRIST_BLUE,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sessionButtonHover: {
    backgroundColor: 'rgba(52, 152, 219, 0.1)',
  },
});
