import {StyleSheet, TouchableHighlight, TouchableHighlightProps} from 'react-native';
// import { useStyles } from "../hooks";
import {normalize} from '../utils';
import {LyristText} from './LyristText';

export type FormButtonProps = {
  text: string;
  textColor?: string;
} & TouchableHighlightProps;

export function FormButton({disabled, onPress, style, text, textColor}: FormButtonProps) {
  const styles = StyleSheet.create({
    button: {
      alignItems: 'center',
      backgroundColor: disabled ? 'transparent' : 'white',
      borderColor: 'white',
      borderWidth: StyleSheet.hairlineWidth,
      borderRadius: 5,
      justifyContent: 'center',
    },
    text: {
      color: disabled ? 'gray' : textColor ? textColor : 'black',
      fontSize: normalize(16),
      padding: 8,
    },
  });
  return (
    <TouchableHighlight disabled={disabled} onPress={onPress} style={[styles.button, style]}>
      <LyristText style={styles.text} weight={disabled ? 'Regular' : 'SemiBold'}>
        {text}
      </LyristText>
    </TouchableHighlight>
  );
}
