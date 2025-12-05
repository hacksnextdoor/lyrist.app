'use client';
import Image from 'next/image';
import Link from 'next/link';
import {usePathname, useRouter} from 'next/navigation';
import {useEffect, useState, useTransition} from 'react';
import {ActivityIndicator, Pressable, View} from 'react-native';
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

export function AppHeader() {
  const {large} = useScale();
  const router = useRouter();
  const pathname = usePathname();
  const {hasPlus, hasProfile, user, userLoading, setOpenAuthModal} = useAuthContext();
  const [mounted, setMounted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    router.prefetch('/search');
    router.prefetch('/library');
    router.prefetch('/pricing');
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
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 8,
        alignItems: 'center',
      }}>
      <View
        style={{
          flexDirection: 'row',
          gap: 16,
          alignItems: 'center',
        }}>
        <Link href={'/'}>
          <Image src="/logo-black.png" width={32} height={32} alt="Lyrist logo" />
        </Link>
        <Pressable
          onPress={() => {
            logFirebaseEvent(TAB_MYLYRICS_PRESSED);
            startTransition(() => router.push('/library'));
          }}
          style={({pressed}) => ({
            opacity: pressed || (isPending && pathname !== '/library') ? 0.5 : 1,
          })}>
          <LyristText style={{color: pathname === '/library' ? LYRIST_BLUE : '#000'}}>
            My Library
          </LyristText>
        </Pressable>
        <Pressable
          onPress={() => {
            logFirebaseEvent(TAB_SEARCH_PRESSED);
            startTransition(() => router.push('/search'));
          }}
          style={({pressed}) => ({
            opacity: pressed || (isPending && pathname !== '/search') ? 0.5 : 1,
          })}>
          <LyristText style={{color: pathname === '/search' ? LYRIST_BLUE : '#000'}}>
            Search
          </LyristText>
        </Pressable>
        {isPending && <ActivityIndicator size="small" color={LYRIST_BLUE} />}
      </View>
      <View
        style={{
          flexDirection: 'row',
          gap: 16,
          alignItems: 'center',
        }}>
        {/* Only render auth-dependent UI after mount to avoid hydration mismatch */}
        {!mounted || userLoading ? (
          <LyristText style={{color: '#999'}}>Loading...</LyristText>
        ) : user ? (
          <>
            {hasPlus ? null : (
              <PlusButton
                text="Get Lyrist Plus"
                onPress={() => {
                  logFirebaseEvent(BTN_PLUS_SUBSCRIPTION_PRESSED);
                  startTransition(() => router.push('/pricing'));
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
              disabled={signingOut}
              style={({pressed}) => ({opacity: pressed || signingOut ? 0.5 : 1})}>
              <LyristText>{signingOut ? 'Signing out...' : 'Sign out'}</LyristText>
            </Pressable>
          </>
        ) : (
          <Pressable
            onPress={() => setOpenAuthModal(true)}
            style={({pressed}) => ({opacity: pressed ? 0.5 : 1})}>
            <LyristText>Sign in</LyristText>
          </Pressable>
        )}
      </View>
    </View>
  );
}
