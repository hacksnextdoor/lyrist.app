import {PropsWithChildren} from 'react';
import {
  ImageBackground,
  ImageURISource,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ScrollViewProps,
  StatusBar,
  StyleSheet,
  useWindowDimensions,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
// import {useStyles} from '../hooks';
// import { showFeedbackDialog } from "../utils";
import {LyristText} from './LyristText';

export type FormContainerProps = PropsWithChildren<
  ViewProps & {
    backgroundColor?: ViewStyle['backgroundColor'];
    backgroundImage?: ImageURISource['uri'];
    onFAQPress?: () => void;
  } & ScrollViewProps
>;

export function FormContainer({
  accessibilityLabel,
  backgroundColor,
  children,
  backgroundImage,
  onFAQPress,
  style,
}: FormContainerProps) {
  const {height} = useWindowDimensions();
  const styles = //useStyles(() =>
    StyleSheet.create({
      image: {flex: 1},
      overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.7)',
      },
      keyboardAvoidingView: {
        height,
      },
      content: {
        backgroundColor: backgroundImage ? 'transparent' : 'black',
        flexGrow: 1,
        justifyContent: 'space-around',
        paddingHorizontal: 40,
        paddingBottom: 40,
      },
      helpView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: Platform.select({ios: 40, default: 0}),
      },
      textView: {color: 'white', marginTop: 40},
    });
  // );
  //   const { dark } = useTheme();

  const mainView = (
    <ScrollView
      accessibilityLabel={accessibilityLabel}
      contentContainerStyle={[styles.content, style]}
      keyboardShouldPersistTaps={'handled'}>
      {/* {onFAQPress ? (
        <View style={styles.helpView}>
          <LyristText pressable={{ onPress: onFAQPress }} style={styles.textView}>
            FAQ
          </LyristText>
          <LyristText pressable={{ onPress: showFeedbackDialog }} style={styles.textView}>
            Help
          </LyristText>
        </View>
      ) : null} */}
      {children}
    </ScrollView>
  );

  const component = (
    <>
      <StatusBar
        barStyle={Platform.select({
          // BUG: doesn't support all cases: for example if android is in light mode but <StatusBar has black background
          android: 'light-content',
          default:
            backgroundImage || backgroundColor === 'black' ? 'light-content' : 'dark-content',
        })}
      />
      {Platform.select({
        ios: (
          <KeyboardAvoidingView behavior={'padding'} style={[styles.keyboardAvoidingView]}>
            {mainView}
          </KeyboardAvoidingView>
        ),
        android: mainView,
        web: mainView,
      })}
    </>
  );
  return backgroundImage ? (
    <ImageBackground resizeMode="cover" source={{uri: backgroundImage}} style={styles.image}>
      <View style={styles.overlay} />
      {component}
    </ImageBackground>
  ) : (
    component
  );
}
