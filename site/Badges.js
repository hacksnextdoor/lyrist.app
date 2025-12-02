'use client';
import Image from 'next/image';
import Link from 'next/link';
import {StyleSheet, View} from 'react-native';
import {useScale} from '../packages/hooks/useScale';

// 0.95 helps with aligns with elements on small devices
export function Badges() {
  const {large} = useScale();
  const badgeHeight = large ? 80 : 60;
  const appStoreWidth = large ? 240 : 180;
  const googlePlayWidth = large ? 270 : 202.5;
  return (
    <View style={[styles.badges, !large && {alignSelf: 'center'}]}>
      <Link role="link" href={'https://lyrist.app/ios'} target={'_blank'}>
        <Image
          alt={'app-store-badge'}
          src={'/app-store.png'}
          height={badgeHeight * 0.95}
          width={appStoreWidth * 0.95}
        />
      </Link>
      {/* <Link
        role="link"
        href={'https://lyrist.app/android'}
        style={{marginLeft: 8}}
        target={'_blank'}>
        <Image
          alt={'google-play-badge'}
          src={'/google-play.png'}
          height={badgeHeight * 0.95}
          width={googlePlayWidth * 0.95}
        />
      </Link> */}
    </View>
  );
}

const styles = StyleSheet.create({
  badges: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
