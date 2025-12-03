// import auth from "@react-native-firebase/auth";
// import firestore from "@react-native-firebase/firestore";
// import { useNavigation } from "@react-navigation/native";
import {getAuth, signOut} from 'firebase/auth';
import {useEffect, useRef, useState} from 'react';
import {SubmitHandler, useForm} from 'react-hook-form';
import {ActivityIndicator, BackHandler, Platform, StyleSheet, TextInput, View} from 'react-native';
import {FormButton, FormInput, FormContainer, LyristText} from '../components';
// import { useStyles } from "../hooks";
// import { createUserAsync, resetLoading, setLoading, signOutAsync } from "../store";
// import { AppStackScreenProps, Handles, User } from "../types";
import {normalize} from '../utils';
import {Handles, createFunction} from '../types';
import {LYRIST_BLUE, SOMETHING_WENT_WRONG_ERROR, USER_CREATED_PROFILE} from '../constants';
import {useRouter} from 'next/navigation';
import {useAuthContext} from '../context';
import firestore from '../firebase/firebase-firestore-web';
import {logFirebaseEvent} from '../firebase';

type FormValues = {
  firstName: string;
  lastName: string;
  phone?: string;
} & Handles;

export function CreateProfileScreen() {
  /* STYLES */
  const styles = // useStyles(() =>
    StyleSheet.create({
      inputMargin: {marginTop: 20},
      textView: {fontSize: normalize(11), color: 'white'},
      question: {alignSelf: 'center', marginTop: 40},
      subView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
      },
      textColor: {color: 'white'},
      steps: {flexDirection: 'row', marginTop: 20},
      stepText: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 40,
        height: 40,
        borderRadius: 40 / 2,
        borderColor: 'white',
      },
      titleText: {
        fontSize: 24,
      },
    });
  // );

  /* NAVIGATION */
  const router = useRouter();
  // const { navigate } = useNavigation<AppStackScreenProps<"CreateProfileScreen">["navigation"]>();

  /* STATE */
  const [screen, setScreen] = useState(1);
  const [loading, setLoading] = useState(false);
  const [complete, setComplete] = useState(false);
  const {user, userLoading, hasProfile, setHasProfile} = useAuthContext();

  // Check if user signed in with Google (has displayName already)
  const isGoogleUser = user?.providerData?.some(p => p?.providerId === 'google.com');
  const hasGoogleName = isGoogleUser && user?.displayName;

  // Parse Google display name into first/last
  const [googleFirstName, googleLastName] = hasGoogleName
    ? user.displayName!.split(' ').reduce(
        (acc, part, i, arr) => {
          if (i === 0) return [part, ''];
          if (i === arr.length - 1) return [acc[0], part];
          return [acc[0] + ' ' + part, acc[1]];
        },
        ['', ''],
      )
    : ['', ''];

  const {
    control,
    formState: {isValid},
    handleSubmit,
  } = useForm<FormValues>({
    mode: 'all',
    defaultValues: {
      firstName: googleFirstName,
      instagram: '',
      lastName: googleLastName,
      phone: '',
      tiktok: '',
      twitter: '',
      youtube: '',
    },
  });

  // Skip to step 2 if Google user with name
  useEffect(() => {
    if (hasGoogleName && screen === 1) {
      setScreen(2);
    }
  }, [hasGoogleName, screen]);

  /* REFS */
  const firstNameRef = useRef<TextInput>(null);
  const lastNameRef = useRef<TextInput>(null);

  /* EVENTS */
  // const dispatch = useDispatch();
  // const dispatchCreateUser = useCallback(
  //   (newUser: User) => dispatch(createUserAsync.request(newUser)),
  //   [dispatch]
  // );
  // const dispatchSetLoading = useCallback(
  //   () => dispatch(setLoading({ text: "Syncing with the server" })),
  //   [dispatch]
  // );
  // const dispatchResetLoading = useCallback(() => dispatch(resetLoading()), [dispatch]);
  // const dispatchSignOut = useCallback(() => dispatch(signOutAsync.request()), [dispatch]);

  const createProfile: SubmitHandler<FormValues> = async formValues => {
    try {
      setLoading(true);

      // Use Google's displayName if available, otherwise construct from form
      const displayName = hasGoogleName
        ? user!.displayName!
        : `${formValues.firstName} ${formValues.lastName}`;

      await createFunction('createUser')({
        id: user!.uid,
        email: user!.email,
        ...formValues,
        // For Google users, use the parsed names
        firstName: hasGoogleName ? googleFirstName : formValues.firstName,
        lastName: hasGoogleName ? googleLastName : formValues.lastName,
      });

      // Only update profile if not already set (non-Google users)
      if (!hasGoogleName) {
        await user!.updateProfile({
          displayName,
        });
      }

      logFirebaseEvent(USER_CREATED_PROFILE);
      setHasProfile(true);
      setLoading(false);
      setComplete(true);
      router.replace('/search');
    } catch (e) {
      setLoading(false);
      setComplete(false);
      throw new Error(`${SOMETHING_WENT_WRONG_ERROR}${JSON.stringify(e)}`);
    }
  };

  /* EFFECTS */
  useEffect(() => {
    // Migration helper: if user has profile in Firestore but no displayName,
    // update their displayName from stored data
    async function syncDisplayName() {
      if (!user || user.displayName) return;

      try {
        const snapshot = await firestore().collection('users').doc(user.uid).get();
        const data = snapshot.data();
        if (data?.firstName && data?.lastName) {
          await user.updateProfile({displayName: `${data.firstName} ${data.lastName}`});
        }
      } catch {
        // Ignore errors - they'll create a new profile
      }
    }
    syncDisplayName();
  }, [user]);

  useEffect(() => {
    firstNameRef.current?.focus();
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      const backToStep1 = () => {
        if (screen === 2) {
          setScreen(1);
          return true;
        } else {
          return false;
        }
      };

      const backHandler = BackHandler.addEventListener('hardwareBackPress', backToStep1);

      return () => backHandler.remove();
    }
  }, [screen]);

  useEffect(() => {
    if (hasProfile) {
      router.replace('/search');
    }
  }, [hasProfile]);

  if (userLoading || loading) {
    return <ActivityIndicator color={LYRIST_BLUE} />;
  }

  if (complete) {
    return <LyristText>Your profile has been created!</LyristText>;
  }

  return (
    <FormContainer
      accessibilityLabel={'scrollview-createprofile'}
      backgroundImage={'/create.jpg'}
      // onFAQPress={() => navigate("SiteScreen", { uri: "https://lyrist.app/faq" })}
    >
      <View>
        <LyristText
          weight={'SemiBold'}
          style={[styles.textColor, styles.titleText, styles.inputMargin]}>
          Create Profile
        </LyristText>
        <LyristText style={styles.textColor}>{user?.email}</LyristText>
      </View>
      <View style={styles.steps}>
        {[1, 2].map((val, i) => (
          <View key={i} style={[styles.stepText, {borderWidth: screen === val ? 1 : 0}]}>
            <LyristText
              onPress={() => isValid && setScreen(val)}
              style={[
                styles.textColor,
                styles.titleText,
                val === 2 && {color: isValid ? 'white' : 'gray'},
              ]}>
              {val}
            </LyristText>
          </View>
        ))}
      </View>
      {screen === 1 && (
        <View>
          <FormInput
            blurOnSubmit={false}
            control={control as any}
            label={'First Name*'}
            name={'firstName'}
            onSubmitEditing={() => lastNameRef.current?.focus()}
            placeholder={'Your first name here'}
            ref={firstNameRef}
            returnKeyType={'next'}
            rules={{
              required: {value: true, message: 'This field is required'},
              minLength: {
                value: 2,
                message: 'Must be at least 2 characters',
              },
              maxLength: {
                value: 50,
                message: 'Cannot be more than 50 characters',
              },
            }}
            style={styles.inputMargin}
          />
          <FormInput
            control={control as any}
            label={'Last Name*'}
            name={'lastName'}
            onSubmitEditing={() => isValid && setScreen(2)}
            placeholder={'Your last name here'}
            ref={lastNameRef}
            returnKeyType={'next'}
            rules={{
              required: {value: true, message: 'This field is required'},
              minLength: {
                value: 2,
                message: 'Must be at least 2 characters',
              },
              maxLength: {
                value: 50,
                message: 'Cannot be more than 50 characters',
              },
            }}
            style={styles.inputMargin}
          />
          <FormButton
            disabled={!isValid}
            onPress={() => setScreen(2)}
            style={{marginTop: 40}}
            text={'Next'}
          />
        </View>
      )}
      {screen === 2 && (
        <View>
          <FormInput
            control={control as any}
            keyboardType={'numeric'}
            label={'Phone Number'}
            name={'phone'}
            placeholder={'123-456-7890'}
            returnKeyType={'next'}
            style={styles.inputMargin}
          />
          <FormInput
            autoCapitalize={'none'}
            control={control as any}
            label={'Instagram'}
            name={'instagram'}
            placeholder={'instagram_username'}
            style={styles.inputMargin}
          />
          <FormInput
            autoCapitalize={'none'}
            control={control as any}
            label={'TikTok'}
            name={'tiktok'}
            placeholder={'tiktok_username'}
            style={styles.inputMargin}
          />
          <FormInput
            autoCapitalize={'none'}
            control={control as any}
            label={'Twitter'}
            name={'twitter'}
            placeholder={'twitter_username'}
            style={styles.inputMargin}
          />
          <FormInput
            autoCapitalize={'words'}
            control={control as any}
            label={'YouTube'}
            name={'youtube'}
            placeholder={'YouTube channel name'}
            style={styles.inputMargin}
          />
          <FormButton
            disabled={!isValid}
            onPress={handleSubmit(createProfile)}
            style={{marginTop: 40}}
            text={'Create Profile'}
          />
        </View>
      )}
      <View style={styles.subView}>
        {screen === 1 && (
          <LyristText
            onPress={async () => {
              await signOut(getAuth());
              router.replace('/');
            }}
            style={styles.textColor}>
            Start over
          </LyristText>
        )}
        {screen === 2 && (
          <LyristText onPress={() => setScreen(1)} style={styles.textColor}>
            Back
          </LyristText>
        )}
      </View>
    </FormContainer>
  );
}
