'use client';
import Image from 'next/image';
import Link from 'next/link';
import {usePathname, useRouter} from 'next/navigation';
import {useEffect, useState, useTransition} from 'react';
import {ActivityIndicator, Pressable, StyleSheet, View} from 'react-native';
import {LyristText, PlusButton} from '../../packages/components';
import {
  BTN_PLUS_SUBSCRIPTION_PRESSED,
  LYRIST_BLUE,
  TAB_MYLYRICS_PRESSED,
  TAB_SEARCH_PRESSED,
  USER_SIGNED_OUT,
} from '../../packages/constants';
import {useAuthContext} from '../../packages/context';
import auth from '../../packages/firebase/firebase-auth-web';
import {logFirebaseEvent} from '../../packages/firebase';
import {useScale} from '../../packages/hooks/useScale';

function NavLink({label, isActive, isPending, onPress}: {label: string; isActive: boolean; isPending: boolean; onPress: () => void}) {
  const [hovered, setHovered] = useState(false);

  return (
    <Pressable
      onPress={onPress}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      style={{
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
        backgroundColor: isActive ? `${LYRIST_BLUE}15` : hovered ? '#f5f5f5' : 'transparent',
        opacity: isPending ? 0.5 : 1,
        transition: 'all 0.15s ease',
      } as any}>
      <LyristText
        style={{color: isActive ? LYRIST_BLUE : '#333', fontSize: 14}}
        weight={isActive ? 'Medium' : 'Regular'}>
        {label}
      </LyristText>
    </Pressable>
  );
}

export function AppHeader({showTwoPanel = false}: {showTwoPanel?: boolean}) {
  const {small, large} = useScale();
  const router = useRouter();
  const pathname = usePathname();
  const {hasPlus, hasProfile, user, userLoading, setOpenAuthModal, setOpenPricingModal} = useAuthContext();
  const [mounted, setMounted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [signingOut, setSigningOut] = useState(false);
  const [signOutHovered, setSignOutHovered] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    router.prefetch('/search');
    router.prefetch('/library');
  }, []);

  useEffect(() => {
    // Only redirect after auth loading completes to avoid race conditions
    if (!userLoading && user && !hasProfile) {
      router.replace('/profile/new');
    }
  }, [userLoading, user, hasProfile]);

  // Early return AFTER all hooks
  // Hide on profile/new, and hide on desktop editor (mobile editor shows header)
  if (pathname === '/profile/new' || (large && pathname?.includes('editor'))) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <Link href={'/'} style={{display: 'flex', alignItems: 'center'}}>
          <Image src="/logo-black.png" width={28} height={28} alt="Lyrist logo" />
        </Link>
        {/* Hide nav links on desktop when both panels are visible */}
        {!showTwoPanel && (
          <View style={styles.navLinks}>
            <NavLink
              label="My Library"
              isActive={pathname === '/library'}
              isPending={isPending && pathname !== '/library'}
              onPress={() => {
                logFirebaseEvent(TAB_MYLYRICS_PRESSED);
                startTransition(() => router.push('/library'));
              }}
            />
            <NavLink
              label="Search"
              isActive={pathname === '/search'}
              isPending={isPending && pathname !== '/search'}
              onPress={() => {
                logFirebaseEvent(TAB_SEARCH_PRESSED);
                startTransition(() => router.push('/search'));
              }}
            />
          </View>
        )}
        {isPending && <ActivityIndicator size="small" color={LYRIST_BLUE} />}
      </View>
      <View style={styles.rightSection}>
        {/* Only render auth-dependent UI after mount to avoid hydration mismatch */}
        {!mounted || userLoading ? (
          <View style={styles.loadingPlaceholder} />
        ) : user ? (
          <>
            {hasPlus ? null : (
              <PlusButton
                text={small ? 'Plus' : 'Get Lyrist Plus'}
                onPress={() => {
                  logFirebaseEvent(BTN_PLUS_SUBSCRIPTION_PRESSED);
                  setOpenPricingModal(true);
                }}
              />
            )}
            <Pressable
              onPress={async () => {
                setSigningOut(true);
                await auth().signOut();
                window.localStorage.clear();
                logFirebaseEvent(USER_SIGNED_OUT);
                router.push('/');
              }}
              onHoverIn={() => setSignOutHovered(true)}
              onHoverOut={() => setSignOutHovered(false)}
              disabled={signingOut}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 6,
                backgroundColor: signOutHovered ? '#f5f5f5' : 'transparent',
                opacity: signingOut ? 0.5 : 1,
                transition: 'all 0.15s ease',
              } as any}>
              <LyristText style={{color: '#666', fontSize: 14}}>
                {signingOut ? 'Signing out...' : 'Sign out'}
              </LyristText>
            </Pressable>
          </>
        ) : (
          <Pressable
            onPress={() => setOpenAuthModal(true)}
            style={({pressed}) => ({
              paddingVertical: 8,
              paddingHorizontal: 16,
              borderRadius: 6,
              backgroundColor: pressed ? '#f0f0f0' : '#f5f5f5',
              transition: 'all 0.15s ease',
            } as any)}>
            <LyristText style={{color: '#333', fontSize: 14}} weight="Medium">
              Sign in
            </LyristText>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  leftSection: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  navLinks: {
    flexDirection: 'row',
    gap: 4,
    marginLeft: 8,
  },
  rightSection: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  loadingPlaceholder: {
    width: 100,
    height: 36,
  },
});
