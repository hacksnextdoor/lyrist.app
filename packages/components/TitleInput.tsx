import {StyleSheet, TextInput, TextInputProps, Platform} from 'react-native';
import {normalize} from '../utils';

export type TitleInputProps = {
  color: string;
  text: string;
} & TextInputProps;

export function TitleInput({
  color,
  inputAccessoryViewID,
  onChangeText,
  testID,
  text,
}: TitleInputProps) {
  return (
    <TextInput
      testID={testID}
      autoFocus={false}
      autoCorrect={false}
      blurOnSubmit={false}
      defaultValue={text}
      inputAccessoryViewID={inputAccessoryViewID}
      onChangeText={onChangeText}
      placeholder={'Title'}
      placeholderTextColor={'#C7C7CD'}
      returnKeyType={'next'}
      spellCheck={false}
      style={[styles.textInput, {color}, Platform.OS === 'web' && ({outline: 'none'} as any)]}
      textAlignVertical={'top'}
      underlineColorAndroid={'transparent'}
    />
  );
}

const styles = StyleSheet.create({
  textInput: {
    paddingHorizontal: normalize(12),
    fontFamily: 'Fira Sans',
    fontWeight: '500',
    fontSize: 16,
    paddingVertical: 8,
  },
});
