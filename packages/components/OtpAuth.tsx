'use client';

import {useState, useEffect} from 'react';
import {View, StyleSheet, Pressable, TextInput, Platform} from 'react-native';
import {LyristText} from './LyristText';
import {useOtpAuth} from '../hooks/useOtpAuth';
import {LYRIST_BLUE, ALIZARIN} from '../constants';
import {FaTimes} from 'react-icons/fa';
import {FcGoogle} from 'react-icons/fc';
import {Purchases} from '@revenuecat/purchases-js';
import auth from '../firebase/firebase-auth-web';

const EXPECTED_CODE_LENGTH = 4;

export function OtpAuth({onSuccess, onDismiss}: {onSuccess?: () => void; onDismiss?: () => void}) {
  const [email, setEmail] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [isCodeExpired, setIsCodeExpired] = useState(false);
  const [showCodeInput, setShowCodeInput] = useState(false);

  const {requestCode, verifyCode, signInWithGoogle, loading, error, code} = useOtpAuth();

  const success = otpInput.length === EXPECTED_CODE_LENGTH && otpInput === code;
  const failure = otpInput.length === EXPECTED_CODE_LENGTH && otpInput !== code;

  const identifyRevenueCatUser = async () => {
    try {
      const currentUser = auth().currentUser;
      if (!currentUser?.uid) {
        return;
      }
      if (!Purchases.isConfigured()) {
        return;
      }
      const purchases = Purchases.getSharedInstance();
      await purchases.identifyUser(currentUser.uid);
    } catch (error) {
      console.error('RevenueCat identify failed:', error);
    }
  };

  const handleSendCode = async () => {
    try {
      await requestCode(email);
      setShowCodeInput(true);
      setTimeLeft(60);
      setIsCodeExpired(false);
    } catch (e) {
      console.error(e);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      await identifyRevenueCatUser();
      onSuccess?.();
    } catch (e) {
      console.error('Google sign-in error:', e);
    }
  };

  const handleResendCode = async () => {
    try {
      await requestCode(email);
      setTimeLeft(60);
      setIsCodeExpired(false);
      setOtpInput('');
    } catch (e) {
      console.error(e);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  useEffect(() => {
    if (success) {
      (async () => {
        try {
          await verifyCode(otpInput);
          await identifyRevenueCatUser();
          onSuccess?.();
        } catch (e) {
          console.error(e);
        }
      })();
    }
  }, [success, otpInput, verifyCode, onSuccess]);

  useEffect(() => {
    if (!showCodeInput) return;

    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setIsCodeExpired(true);
    }
  }, [timeLeft, showCodeInput]);

  if (!showCodeInput) {
    return (
      <View style={[styles.container, styles.fixedHeight]}>
        <Pressable onPress={onDismiss} style={styles.closeButton} disabled={loading}>
          <FaTimes size={20} color={loading ? '#ccc' : '#666'} />
        </Pressable>
        <LyristText style={styles.title} weight="Medium">
          Sign in
        </LyristText>

        <Pressable
          onPress={handleGoogleSignIn}
          disabled={loading}
          style={[styles.googleButton, loading && styles.buttonDisabled]}>
          {loading ? (
            <>
              <View style={{width: 20, height: 20}} />
              <LyristText style={styles.googleButtonText} weight="Medium">
                Signing in...
              </LyristText>
            </>
          ) : (
            <>
              <FcGoogle size={20} />
              <LyristText style={styles.googleButtonText} weight="Medium">
                Continue with Google
              </LyristText>
            </>
          )}
        </Pressable>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <LyristText style={styles.dividerText}>or</LyristText>
          <View style={styles.dividerLine} />
        </View>

        <View>
          <LyristText style={styles.label} weight="Regular">
            Email
          </LyristText>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="your@email.com"
            placeholderTextColor="gray"
            keyboardType="email-address"
            autoCapitalize="none"
            autoFocus
            style={styles.textInput}
            onSubmitEditing={() => email && !loading && handleSendCode()}
            returnKeyType="go"
          />
        </View>
        <Pressable
          onPress={handleSendCode}
          disabled={!email || loading}
          style={[styles.button, (!email || loading) && styles.buttonDisabled]}>
          <LyristText style={styles.buttonText} weight="Medium">
            {loading ? 'Sending...' : 'Send me a code'}
          </LyristText>
        </Pressable>
        {error && <LyristText style={styles.error}>{error}</LyristText>}
      </View>
    );
  }

  return (
    <View style={[styles.container, styles.fixedHeight]}>
      <Pressable onPress={onDismiss} style={styles.closeButton}>
        <FaTimes size={20} color="#666" />
      </Pressable>
      <LyristText style={styles.title} weight="Medium">
        Enter code
      </LyristText>
      <LyristText style={styles.subtitle}>Sent to {email}</LyristText>

      {isCodeExpired ? (
        <View style={styles.expiredContainer}>
          <LyristText style={styles.expiredText} weight="Medium">
            Your code expired
          </LyristText>
          <Pressable onPress={handleResendCode} style={styles.button}>
            <LyristText style={styles.buttonText} weight="Medium">
              Resend code
            </LyristText>
          </Pressable>
        </View>
      ) : (
        <>
          <View>
            <LyristText style={styles.label} weight="Regular">
              Code
            </LyristText>
            <TextInput
              value={otpInput}
              onChangeText={setOtpInput}
              placeholder="1234"
              placeholderTextColor="gray"
              keyboardType="number-pad"
              maxLength={EXPECTED_CODE_LENGTH}
              autoFocus
              style={[
                styles.textInput,
                success && styles.inputSuccess,
                failure && styles.inputFailure,
              ]}
              returnKeyType="go"
            />
          </View>
          <LyristText style={styles.timer}>Code expires in {formatTime(timeLeft)}</LyristText>
        </>
      )}

      {error && <LyristText style={styles.error}>{error}</LyristText>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 32,
    gap: 20,
    backgroundColor: 'white',
    borderRadius: 16,
    width: 420,
    maxWidth: '90vw' as any,
    position: 'relative',
  },
  fixedHeight: {
    minHeight: 480,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
    padding: 4,
  },
  title: {
    fontSize: 32,
    textAlign: 'center',
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    opacity: 0.7,
  },
  label: {
    color: 'black',
    fontSize: 16,
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    fontSize: 18,
    color: 'black',
    fontFamily: 'Fira Sans',
    ...(Platform.OS === 'web' && {outline: 'none' as any}),
  },
  input: {
    marginTop: 8,
  },
  inputSuccess: {
    borderColor: LYRIST_BLUE,
    backgroundColor: '#E8F4FD',
  },
  inputFailure: {
    borderColor: ALIZARIN,
    backgroundColor: '#FFF0F0',
  },
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
    fontSize: 18,
    fontWeight: '500',
  },
  timer: {
    textAlign: 'center',
    fontSize: 14,
    fontVariant: ['tabular-nums'],
  },
  expiredContainer: {
    gap: 16,
    alignItems: 'center',
  },
  expiredText: {
    fontSize: 16,
  },
  error: {
    color: ALIZARIN,
    fontSize: 14,
    textAlign: 'center',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 16,
    borderRadius: 8,
  },
  googleButtonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: '500',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dividerText: {
    fontSize: 14,
    color: '#666',
  },
});
