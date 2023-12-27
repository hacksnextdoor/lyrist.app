// import auth from "@react-native-firebase/auth";
// import firestore from "@react-native-firebase/firestore";
// import { useNavigation } from "@react-navigation/native";
import {useCallback, useEffect, useRef, useState} from 'react';
import {SubmitHandler, useForm} from 'react-hook-form';
import {ActivityIndicator, BackHandler, StyleSheet, TextInput, View} from 'react-native';
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
  const {user, userLoading} = useAuthContext();

  const {
    control,
    formState: {isValid},
    handleSubmit,
  } = useForm<FormValues>({
    mode: 'all',
    defaultValues: {
      firstName: '',
      instagram: '',
      lastName: '',
      phone: '',
      tiktok: '',
      twitter: '',
      youtube: '',
    },
  });

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
      await createFunction('createUser')({
        id: user!.uid,
        email: user!.email,
        ...formValues,
      });
      await user!.updateProfile({
        displayName: `${formValues.firstName} ${formValues.lastName}`,
      });
      logFirebaseEvent(USER_CREATED_PROFILE);
      setLoading(false);
      setComplete(true);
      router.replace('/search');
    } catch (e) {
      setLoading(false);
      setComplete(false);
      throw new Error(`${SOMETHING_WENT_WRONG_ERROR}${JSON.stringify(e)}`);
      // yield put(createUserAsync.failure(err));
    }
    // dispatchCreateUser({ id: currentUser!.uid, email: currentUser!.email, ...formValues });
  };

  /* EFFECTS */
  useEffect(() => {
    // last resort to fix unsynced clients issue
    async function tryUpdateDisplayName() {
      const snapshot = await firestore().collection('users').doc(user?.uid).get();
      const data = snapshot.data();
      if (data && data.firstName && data.lastName) {
        setLoading(true);
        await user?.updateProfile({displayName: `${data.firstName} ${data.lastName}`});
        setLoading(false);
        router.replace('/search');
      }
    }
    tryUpdateDisplayName();
  }, []);

  useEffect(() => {
    firstNameRef.current?.focus();
  }, []);

  useEffect(() => {
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
  }, [screen]);

  useEffect(() => {
    if (user?.displayName) {
      router.replace('/search');
    }
  }, [user]);

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
            enablesReturnKeyAutomatically
            iconName={'user'}
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
            enablesReturnKeyAutomatically
            iconName={'user'}
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
            iconName={'phone'}
            keyboardType={'numeric'}
            label={'Phone Number'}
            name={'phone'}
            placeholder={'123-456-7890'}
            returnKeyType={'next'}
            style={styles.inputMargin}
          />
          <FormInput
            autoCapitalize={'none'}
            brand={true}
            control={control as any}
            iconName={'instagram'}
            label={'Instagram'}
            name={'instagram'}
            placeholder={'instagram_username'}
            style={styles.inputMargin}
          />
          <FormInput
            autoCapitalize={'none'}
            brand={true}
            control={control as any}
            iconName={'tiktok'}
            label={'TikTok'}
            name={'tiktok'}
            placeholder={'tiktok_username'}
            style={styles.inputMargin}
          />
          <FormInput
            autoCapitalize={'none'}
            brand={true}
            control={control as any}
            iconName={'twitter'}
            label={'Twitter'}
            name={'twitter'}
            placeholder={'twitter_username'}
            style={styles.inputMargin}
          />
          <FormInput
            autoCapitalize={'words'}
            brand={true}
            control={control as any}
            iconName={'youtube'}
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
          <LyristText onPress={() => {}} style={styles.textColor}>
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
