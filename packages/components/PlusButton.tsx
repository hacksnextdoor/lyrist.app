'use client';

import {Pressable} from 'react-native';
import {LyristText} from './LyristText';
import {TURQUOISE} from 'packages/constants';

interface PlusButtonProps {
  text: string;
  onPress: () => void;
  small?: boolean;
  disabled?: boolean;
}

export function PlusButton({text, onPress, small, disabled}: PlusButtonProps) {
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      style={({pressed}) => ({
        backgroundColor: TURQUOISE,
        borderRadius: 5,
        paddingVertical: small ? 4 : 8,
        paddingHorizontal: small ? 8 : 16,
        opacity: disabled ? 0.5 : pressed ? 0.7 : 1,
      })}>
      <LyristText style={{color: 'white', fontSize: small ? 10 : 12}} weight="Medium">
        {text}
      </LyristText>
    </Pressable>
  );
}
