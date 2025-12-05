'use client';
import {View} from 'react-native';
import {AppHeader} from './AppHeader';

export default function HomeLayout({children}) {
  return (
    <View style={{flex: 1, height: '100vh'} as any}>
      <AppHeader />
      <View style={{flex: 1, alignItems: 'center'}}>
        <View style={{flex: 1, width: '100%'}}>{children}</View>
      </View>
    </View>
  );
}
