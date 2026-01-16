'use client';
import {View} from 'react-native';
import {Header} from 'site/Header';
import {Footer} from 'site/Footer';
import {useScale} from 'packages/hooks/useScale';

export default function PagesLayout({children}: {children: React.ReactNode}) {
  const {small, medium} = useScale();
  const padding = small ? 32 : medium ? 48 : 48;

  return (
    <View
      style={{
        backgroundColor: '#fff',
        minHeight: '100vh' as any,
      }}>
      <View
        style={{
          maxWidth: 1400,
          width: '100%',
          alignSelf: 'center',
          padding,
          gap: 48,
          flex: 1,
        }}>
        <Header />
        <View style={{flex: 1}}>{children as any}</View>
        <Footer showTryInput />
      </View>
    </View>
  );
}
