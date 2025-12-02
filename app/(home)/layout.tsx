'use client';
import {View} from 'react-native';
import {AppHeader} from './AppHeader';

export default function HomeLayout({children}) {
  return (
    <>
      <AppHeader />
      <View style={{alignItems: 'center'}}>
        <View style={{width: '100%'}}>{children}</View>
      </View>
    </>
  );
}
