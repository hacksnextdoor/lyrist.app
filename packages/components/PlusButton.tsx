'use client';

import {useState} from 'react';
import {Pressable} from 'react-native';
import {LyristText} from './LyristText';
import {TURQUOISE} from 'packages/constants';
import {IoDiamond} from 'react-icons/io5';
import {useScale} from '../hooks/useScale';

interface PlusButtonProps {
  text: string;
  onPress: () => void;
  small?: boolean;
  disabled?: boolean;
}

export function PlusButton({text, onPress, small, disabled}: PlusButtonProps) {
  const [hovered, setHovered] = useState(false);
  const {small: isSmallScreen} = useScale();

  // Use consistent sizing - responsive to screen size
  const isCompact = small || isSmallScreen;
  const fontSize = 12;
  const iconSize = 12;
  const paddingVertical = isCompact ? 6 : 8;
  const paddingHorizontal = isCompact ? 10 : 14;

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      style={({pressed}) => ({
        backgroundColor: TURQUOISE,
        borderRadius: 6,
        paddingVertical,
        paddingHorizontal,
        opacity: disabled ? 0.5 : pressed ? 0.8 : 1,
        transform: hovered ? 'scale(1.03)' : 'scale(1)',
        boxShadow: hovered ? '0 4px 12px rgba(0,199,190,0.4)' : '0 2px 4px rgba(0,199,190,0.2)',
        transition: 'all 0.2s ease',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
      } as any)}>
      <IoDiamond size={iconSize} color="white" />
      <LyristText style={{color: 'white', fontSize}} weight="Medium">
        {text}
      </LyristText>
    </Pressable>
  );
}
