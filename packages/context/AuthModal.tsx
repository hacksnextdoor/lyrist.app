import {useState} from 'react';
import {FaTimes} from 'react-icons/fa';
import {SlEnvelopeOpen, SlEnvolope} from 'react-icons/sl';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  TextInput,
  View,
  Platform,
} from 'react-native';
import {LyristText} from '../components';
import {LYRIST_BLUE, USER_GENERATED_SIGN_IN_LINK} from '../constants';
import auth from '../firebase/firebase-auth-web';
import {emailRegex, normalize} from '../utils';
import {logFirebaseEvent} from '../firebase';

export function AuthModal({isOpen, onClose}) {
  const [email, setEmail] = useState('');
  const [linkSent, setLinkSent] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [displayIcons, setDisplayIcons] = useState(false);
  const [error, setError] = useState(null);
  const isEnabled = emailRegex.test(email);

  const startOver = () => {
    window.localStorage.removeItem('emailForSignIn');
    setEmail('');
    setLinkSent(false);
    setError(null);
    setDisplayIcons(false);
  };

  const generateSignInLink = async (email: string) => {
    setEmailLoading(true);
    setDisplayIcons(true);
    try {
      const actionCodeSettings = {
        // URL where the user will be redirected after clicking the link
        url: `${window.location.origin}/redirect?${new URLSearchParams({
          next: window.location.pathname + window.location.search,
        })}`, // Change this to your actual redirect URL
        handleCodeInApp: true, // This allows the link to be handled within your app
      };
      await auth().sendSignInLinkToEmail(email, actionCodeSettings);
      // The link was successfully sent to the user's email
      window.localStorage.setItem('emailForSignIn', email);
      // You can display a success message or take further actions
      logFirebaseEvent(USER_GENERATED_SIGN_IN_LINK);
      setLinkSent(true);
      setError(null);
    } catch (error) {
      setLinkSent(false);
      setError(error);
    } finally {
      setEmailLoading(false);
    }
  };

  //TODO: lyrist-dev.firebaseapp.com/__/auth/action?apiKey=AIzaSyBBTXBZ-M4qDZWfwnHb8ZdP0qQQfo-BpDY&mode=signIn&oobCode=VBXzWgSqD4CRAvCV5jD03Wi-S4HNYnlploQ5ZMuQYQgAAAGK7yTPwg&continueUrl=https://lyrist-dev.app/redirect&lang=en
  //TODO: find out how to use page.link
  return (
    <Modal animationType="fade" transparent={true} visible={isOpen}>
      <Pressable
        onPress={() => onClose()}
        style={[
          StyleSheet.absoluteFill,
          {backgroundColor: 'rgba(0,0,0,0.4)'},
          {cursor: 'auto'} as any,
        ]}
      />
      <View style={styles.modalContent}>
        {displayIcons ? (
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            {linkSent ? (
              <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                <SlEnvolope size={20} />
                <LyristText>
                  {'  '}sent to {email}.
                </LyristText>
              </View>
            ) : (
              <>
                <SlEnvelopeOpen size={20} />
                {emailLoading ? <ActivityIndicator color={LYRIST_BLUE} /> : null}
              </>
            )}
          </View>
        ) : (
          <View style={styles.buttons}>
            <LyristText weight={'SemiBold'}>Sign In</LyristText>
            <Pressable onPress={onClose}>
              <FaTimes color={'gray'} size={20} />
            </Pressable>
          </View>
        )}
        {linkSent ? (
          <>
            <LyristText>Check your junk mail if you can't find it!</LyristText>
            <LyristText onPress={() => startOver()}>Start over</LyristText>
          </>
        ) : (
          <>
            <TextInput
              autoFocus={true}
              defaultValue={email}
              onChangeText={str => setEmail(str)}
              placeholder={'Type your email here'}
              placeholderTextColor={'lightgray'}
              onSubmitEditing={e => generateSignInLink(e.nativeEvent.text)}
              keyboardType={'email-address'}
              style={[
                {
                  flex: 1,
                  fontFamily: 'Fira Sans',
                },
                Platform.OS === 'web' && ({outline: 'none'} as any),
              ]}
            />
            {error && <LyristText>{error}</LyristText>}
            <Pressable
              disabled={!isEnabled || emailLoading}
              onPress={() => generateSignInLink(email)}
              style={[
                styles.button,
                {backgroundColor: !isEnabled || emailLoading ? 'gray' : 'black'},
              ]}>
              <LyristText style={styles.link} weight={'SemiBold'}>
                {emailLoading ? 'Generating link' : 'Send me a link'}
              </LyristText>
            </Pressable>
          </>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: 'white',
    padding: normalize(24),
    borderRadius: 5,
    gap: 16,
    width: 296,
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
  },
  buttons: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  button: {
    alignItems: 'center',
    borderColor: 'white',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 5,
    justifyContent: 'center',
    paddingVertical: 8,
  },
  link: {
    color: 'white',
  },
});
