import {Ref, forwardRef} from 'react';
import {Platform, StyleSheet, TextInput, TextInputProps} from 'react-native';
import {normalize} from '../utils';

export type EditorProps = {
  // editMode: boolean;
  // fontSize: number;
  onChangeText?: (lyrics: string) => void;
  text: string;
  color?: string;
} & TextInputProps;

export const Editor = forwardRef(
  (
    {
      color,
      // fontSize,
      // editMode,
      inputAccessoryViewID,
      onBlur,
      onChangeText,
      onFocus,
      placeholder,
      text,
    }: EditorProps,
    ref: Ref<TextInput>,
  ) => (
    <TextInput
      testID={'editor'} // detox fails with accessibilityLabel
      inputAccessoryViewID={inputAccessoryViewID}
      autoFocus={false}
      autoCorrect={false}
      blurOnSubmit={false}
      defaultValue={text}
      multiline
      onBlur={onBlur}
      onChangeText={onChangeText}
      onFocus={onFocus}
      placeholder={placeholder}
      placeholderTextColor={'#C7C7CD'}
      ref={ref}
      returnKeyType={'next'}
      spellCheck={false}
      style={[
        styles.textInput,
        {
          color,
          borderColor: 'black',
          borderWidth: StyleSheet.hairlineWidth,
        },
        Platform.OS === 'web' && ({outline: 'none'} as any),
      ]}
      textAlignVertical={'top'}
      underlineColorAndroid={'transparent'}
    />
  ),
);

const styles = StyleSheet.create({
  editView: {flex: 1},
  editModeTouchable: {
    backgroundColor: 'black',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: normalize(12),
    paddingVertical: normalize(4),
  },
  editModeText: {color: 'white', marginLeft: normalize(12)},
  paddingView: {padding: normalize(12)},
  textInput: {
    flex: 1,
    paddingTop: normalize(12),
    paddingBottom: normalize(12),
    paddingHorizontal: normalize(12),
    fontFamily: 'Fira Sans',
  },
});
