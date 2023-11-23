'use client';
import Image from 'next/image';
import Link from 'next/link';
import {usePathname, useRouter} from 'next/navigation';
import {useEffect} from 'react';
import {View} from 'react-native';
import {LyristText} from '../../packages/components';
import {
  BTN_PLUS_SUBSCRIPTION_PRESSED,
  TAB_MYLYRICS_PRESSED,
  TAB_SEARCH_PRESSED,
  TURQUOISE,
  USER_SIGNED_OUT,
} from '../../packages/constants';
import {useAuthContext} from '../../packages/context';
import auth from '../../packages/firebase/firebase-auth-web';
import {normalize} from '../../packages/utils';
import {logFirebaseEvent} from '../../packages/firebase';

export function AppHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const {hasPlus, user, userLoading, setOpenAuthModal} = useAuthContext();

  if (pathname === '/profile/new' || pathname?.includes('editor')) {
    return null;
  }

  useEffect(() => {
    router.prefetch('/search');
    router.prefetch('/library');
    router.prefetch('/pricing');
  }, []);

  useEffect(() => {
    if (user && user.displayName == null) {
      router.replace('/profile/new');
    }
  }, [user]);

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: normalize(12),
        paddingVertical: normalize(12),
        alignItems: 'center',
      }}>
      <View
        style={{
          flexDirection: 'row',
          gap: 16,
          alignItems: 'center',
        }}>
        <Link href={'/'}>
          <Image src="/lyrist-black.png" width={32} height={32} alt="Lyrist logo" />
        </Link>
        <LyristText
          onPress={() => {
            logFirebaseEvent(TAB_MYLYRICS_PRESSED);
            router.push('/library');
          }}>
          My Library
        </LyristText>
        <LyristText
          onPress={() => {
            logFirebaseEvent(TAB_SEARCH_PRESSED);
            router.push('/search');
          }}>
          Search
        </LyristText>
      </View>
      <View
        style={{
          flexDirection: 'row',
          gap: 16,
          alignItems: 'center',
        }}>
        {userLoading ? (
          <LyristText>Signing in...</LyristText>
        ) : user ? (
          <>
            {hasPlus ? null : (
              // PASSING INLINE FUNCTIONS RESULTS IN A RERENDER!!!!! <Pressable onHoverIn={() => setLine3(true)} onHoverOut={() => setLine3(false)}>
              <LyristText
                onPress={() => {
                  logFirebaseEvent(BTN_PLUS_SUBSCRIPTION_PRESSED);
                  router.push('/pricing');
                }}
                style={{
                  backgroundColor: TURQUOISE,
                  color: 'white',
                  borderRadius: 5,
                  fontSize: 12,
                  paddingVertical: normalize(8),
                  paddingHorizontal: normalize(16),
                }}>
                Get Lyrist Plus
              </LyristText>
            )}
            <LyristText
              onPress={async () => {
                await auth().signOut();
                logFirebaseEvent(USER_SIGNED_OUT);
                router.push('/');
              }}>
              Sign out
            </LyristText>
          </>
        ) : (
          <LyristText onPress={() => setOpenAuthModal(true)}>Sign in</LyristText>
        )}
      </View>
    </View>
  );
}
