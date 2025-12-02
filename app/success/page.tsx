'use client';

import {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {LyristText} from 'packages/components';
import {useAuthContext} from 'packages/context';
import {useRouter} from 'next/navigation';

export default function SuccessPage() {
  const {user} = useAuthContext();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }

    const checkSubscription = async () => {
      try {
        const response = await fetch(`/api/plus/${user.uid}`, {cache: 'no-store'});
        const hasPlus = await response.json();

        if (hasPlus) {
          setChecking(false);
        } else {
          setTimeout(checkSubscription, 2000);
        }
      } catch (error) {
        console.error('Failed to check subscription:', error);
        setTimeout(checkSubscription, 2000);
      }
    };

    checkSubscription();
  }, [user, router]);

  if (checking) {
    return (
      <View style={styles.container}>
        <LyristText style={styles.title} weight="Medium">
          Activating your subscription...
        </LyristText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LyristText style={styles.title} weight="Medium">
        Success!
      </LyristText>
      <LyristText style={styles.subtitle}>Your subscription is now active.</LyristText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 16,
  },
  title: {
    fontSize: 32,
  },
  subtitle: {
    fontSize: 18,
    opacity: 0.7,
  },
});
