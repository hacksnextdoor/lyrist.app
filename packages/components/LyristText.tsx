// import { useTheme } from "@react-navigation/native";
import {PropsWithChildren} from 'react';
import {Pressable, PressableProps, Text, TextProps, TextStyle} from 'react-native';
import {normalize} from '../utils';

// export type TextWeight = "Bold" | "Medium" | "Regular" | "SemiBold" | "Thin";
const TextWeight: Record<string, TextStyle['fontWeight']> = {
  Bold: '700',
  SemiBold: '600',
  Medium: '500',
  Regular: '400',
  Thin: '100',
};
export type TextStatus = 'error';

export type LyristTextProps = PropsWithChildren<
  TextProps & {
    // pressable?: { onPress: () => void; style?: TouchableOpacityProps["style"] };
    pressableStyle?: PressableProps['style'];
    status?: TextStatus;
    weight?: keyof typeof TextWeight;
  }
>;

export function LyristText({
  children,
  numberOfLines,
  onPress,
  pressableStyle,
  status,
  style,
  weight = 'Regular',
}: LyristTextProps) {
  const component = (
    <Text
      numberOfLines={numberOfLines}
      style={[
        {
          // color: colors.text,
          //   fontFamily: `FiraSans-${
          //     pressable || status === "error" ? "SemiBold" : weight || "Regular"
          //   }`,
          fontFamily: 'Fira Sans',
          fontSize: normalize(12),
          fontWeight: onPress ? TextWeight['Medium'] : TextWeight[weight],
        },
        style,
      ]}>
      {children}
    </Text>
  );

  return onPress ? (
    <Pressable onPress={onPress} style={pressableStyle ?? {}}>
      {component}
    </Pressable>
  ) : (
    component
  );
}
