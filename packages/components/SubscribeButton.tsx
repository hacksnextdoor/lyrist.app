'use client';
import {useState} from 'react';
import {Pressable, StyleSheet} from 'react-native';
import {LyristText} from './LyristText';
import {useAuthContext} from '../context';
import {LYRIST_BLUE} from '../constants';

export function SubscribeButton({priceId}: {priceId: string}) {
  const {user, setOpenAuthModal} = useAuthContext();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!user) {
      setOpenAuthModal(true);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({priceId, uid: user.uid}),
      });

      const {url} = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Failed to create checkout:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Pressable
      onPress={handleSubscribe}
      disabled={loading}
      style={[styles.button, loading && styles.buttonDisabled]}>
      <LyristText style={styles.buttonText} weight="Medium">
        {loading ? 'Loading...' : 'Subscribe'}
      </LyristText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: LYRIST_BLUE,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});
