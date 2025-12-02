'use client';
import Image from 'next/image';
import {useRouter} from 'next/navigation';
import {useState, useEffect} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {useScale} from 'packages/hooks/useScale';
import {LyristText} from 'packages/components';
import {useAuthContext} from 'packages/context';
import {LYRIST_BLUE} from 'packages/constants';

const NAV_ITEMS = [
  {label: 'Reviews', href: '#reviews'},
  {label: 'Plus', href: '#pricing'},
  {label: 'Roadmap', href: '#roadmap'},
  {label: 'FAQ', href: '#faq'},
];

// Animated hamburger icon that morphs into X
function HamburgerIcon({isOpen}) {
  return (
    <View style={hamburgerStyles.container}>
      <View style={[hamburgerStyles.line, isOpen && hamburgerStyles.lineTopOpen]} />
      <View
        style={[
          hamburgerStyles.line,
          hamburgerStyles.lineMiddle,
          isOpen && hamburgerStyles.lineMiddleOpen,
        ]}
      />
      <View style={[hamburgerStyles.line, isOpen && hamburgerStyles.lineBottomOpen]} />
    </View>
  );
}

const hamburgerStyles = StyleSheet.create({
  container: {
    width: 24,
    height: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  line: {
    width: 24,
    height: 2,
    backgroundColor: '#000',
    borderRadius: 1,
    transition: 'transform 0.3s ease, opacity 0.3s ease',
  },
  lineMiddle: {
    width: 24,
  },
  lineTopOpen: {
    transform: [{translateY: 9}, {rotate: '45deg'}],
  },
  lineMiddleOpen: {
    opacity: 0,
    transform: [{scaleX: 0}],
  },
  lineBottomOpen: {
    transform: [{translateY: -9}, {rotate: '-45deg'}],
  },
});

export function Header() {
  const router = useRouter();
  const {scale, small, medium, large} = useScale();
  const styles = createStyles(scale);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const {user, setOpenAuthModal} = useAuthContext();

  useEffect(() => {
    if (showMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showMenu]);

  const handleNavClick = (e, href) => {
    e?.preventDefault?.();
    const element = document.querySelector(href);
    setShowMenu(false);
    if (element) {
      setTimeout(() => {
        element.scrollIntoView({behavior: 'smooth', block: 'start'});
      }, 300);
    }
  };

  const showHamburger = small || medium;

  return (
    <View style={[styles.section, showMenu && {zIndex: 9999999}]}>
      <View style={[styles.subSection, {zIndex: 9999999, position: 'relative'}]}>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 20}}>
          <View style={styles.logoContainer}>
            <Image alt={'logo'} src={'/logo.png'} fill />
          </View>
          {!showHamburger &&
            NAV_ITEMS.map((item, index) => (
              <Pressable
                key={item.href}
                onPress={e => handleNavClick(e, item.href)}
                onHoverIn={() => setHoveredItem(index)}
                onHoverOut={() => setHoveredItem(null)}>
                <LyristText
                  style={{
                    fontSize: 24,
                    textDecorationLine: hoveredItem === index ? 'underline' : 'none',
                  }}>
                  {item.label}
                </LyristText>
              </Pressable>
            ))}
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 16}}>
          {user ? (
            <Pressable
              onPress={() => router.push('/search')}
              onHoverIn={() => setHoveredItem('session')}
              onHoverOut={() => setHoveredItem(null)}
              style={[
                styles.sessionButton,
                hoveredItem === 'session' && styles.sessionButtonHover,
              ]}>
              <LyristText style={{fontSize: showHamburger ? 16 : 24}}>
                {user?.displayName ?? 'Go to app'}
              </LyristText>
            </Pressable>
          ) : (
            <Pressable
              onPress={() => setOpenAuthModal(true)}
              onHoverIn={() => setHoveredItem('signin')}
              onHoverOut={() => setHoveredItem(null)}>
              <LyristText
                style={{
                  fontSize: showHamburger ? 16 : 24,
                  textDecorationLine: hoveredItem === 'signin' ? 'underline' : 'none',
                }}>
                Sign in
              </LyristText>
            </Pressable>
          )}
          {showHamburger && (
            <Pressable
              onPress={() => setShowMenu(!showMenu)}
              style={[styles.hamburgerButton, {zIndex: 9999999}]}
              accessibilityLabel={showMenu ? 'Close menu' : 'Open menu'}>
              <HamburgerIcon isOpen={showMenu} />
            </Pressable>
          )}
        </View>
      </View>

      {/* Mobile/Tablet Menu - Slides in from right */}
      <View
        style={[styles.menuPanel, {transform: [{translateX: showMenu ? 0 : '100%'}]}]}
        pointerEvents={showMenu ? 'auto' : 'none'}>
        <View style={styles.menuItems}>
          {NAV_ITEMS.map((item, index) => (
            <Pressable
              key={item.href}
              style={styles.menuItem}
              onPress={e => handleNavClick(e, item.href)}>
              <LyristText style={{fontSize: 18}}>{item.label}</LyristText>
            </Pressable>
          ))}
          <Pressable
            style={styles.menuItem}
            onPress={() => {
              setShowMenu(false);
              window.open('/terms', '_blank');
            }}>
            <LyristText style={{fontSize: 18}}>Terms of Use</LyristText>
          </Pressable>
          <Pressable
            style={styles.menuItem}
            onPress={() => {
              setShowMenu(false);
              window.open('/privacy', '_blank');
            }}>
            <LyristText style={{fontSize: 18}}>Privacy Policy</LyristText>
          </Pressable>
          <Pressable
            style={styles.menuItem}
            onPress={() => {
              setShowMenu(false);
              window.open('mailto:lyrist.app@gmail.com');
            }}>
            <LyristText style={{fontSize: 18}}>Contact Us</LyristText>
          </Pressable>
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
  hamburgerButton: {
    padding: 8,
  },
  menuPanel: {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    zIndex: 999999,
    paddingTop: 80,
    paddingLeft: 32,
    paddingRight: 32,
    transition: 'transform 0.3s ease-out',
  },
  menuItems: {
    gap: 0,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 0,
    borderRadius: 8,
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
