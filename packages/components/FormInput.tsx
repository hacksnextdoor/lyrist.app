import {ForwardedRef, forwardRef} from 'react';
import {Controller, ControllerProps} from 'react-hook-form';
import type {FieldPath, Control, FieldValues} from 'react-hook-form';
import {Platform, StyleSheet, TextInput, TextInputProps, View, ViewStyle} from 'react-native';
// import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
// import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';
import {ALIZARIN} from '../constants';
// import {useStyles} from '../hooks';
import {normalize} from '../utils';
import {LyristText} from './LyristText';

export type FormInputProps = {
  brand?: boolean;
  iconName: string;
  label: string;
} & TextInputProps &
  ViewStyle &
  Pick<ControllerProps, 'rules'>;

export enum IconColor {
  Default = '#000000',
  Instagram = '#000000',
  TikTok = '#000000',
  Twitter = '#1DA1F2',
  YouTube = '#FF0000',
}

export const FormInput = forwardRef(
  <TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>(
    {
      autoCapitalize,
      autoFocus,
      brand,
      blurOnSubmit,
      control,
      defaultValue,
      editable,
      iconName,
      keyboardType,
      label,
      name,
      onSubmitEditing,
      placeholder,
      returnKeyType,
      rules,
      secureTextEntry,
      style,
    }: FormInputProps & {control: Control<TFieldValues>} & {name: TName},
    ref: ForwardedRef<TextInput>,
  ) => {
    const styles = // useStyles(() =>
      StyleSheet.create({
        container: {
          flexDirection: 'row',
          alignItems: 'center',
          borderRadius: 5,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: 'white',
          marginTop: 8,
        },
        name: {color: 'white', fontSize: normalize(12)},
        iconContainer: {
          alignItems: 'center',
          borderTopLeftRadius: 5,
          borderBottomLeftRadius: 5,
          borderColor: 'white',
          borderRightWidth: StyleSheet.hairlineWidth,
          width: 60,
        },
        inputContainer: {
          flex: 1,
          paddingHorizontal: 8,
        },
        input: {
          color: 'white',
          fontFamily: 'Fira Sans',
          fontSize: normalize(12),
          paddingVertical: normalize(8),
        },
        error: {color: ALIZARIN, marginTop: 8},
      });
    // );
    // const Icon = brand ? FontAwesome5Icon : SimpleLineIcon;
    return (
      <View>
        <LyristText style={[styles.name, style]} weight={'Regular'}>
          {label}
        </LyristText>
        <Controller
          control={control as any}
          name={name}
          rules={rules}
          render={({field: {onBlur, onChange, value}, fieldState: {error}}) => (
            <>
              <View style={styles.container}>
                {/* <View style={styles.iconContainer}>
                  <Icon brand={brand} color={"white"} name={iconName} size={20} />
                </View> */}
                <View style={styles.inputContainer}>
                  <TextInput
                    autoCapitalize={autoCapitalize}
                    autoFocus={autoFocus}
                    blurOnSubmit={blurOnSubmit}
                    defaultValue={defaultValue}
                    editable={editable}
                    keyboardType={keyboardType || 'default'}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    placeholder={placeholder}
                    placeholderTextColor={'gray'}
                    ref={ref}
                    returnKeyType={returnKeyType}
                    onSubmitEditing={onSubmitEditing}
                    secureTextEntry={secureTextEntry}
                    style={[styles.input, Platform.OS === 'web' && ({outline: 'none'} as any)]}
                    testID={`input-${name}`}
                    value={value}
                  />
                </View>
              </View>
              {error && error.message && error.message.length > 0 ? (
                <LyristText style={styles.error}>{error.message}</LyristText>
              ) : null}
            </>
          )}
        />
      </View>
    );
  },
);
