import Image from 'next/image';
import Link from 'next/link';
import {StyleSheet, View} from 'react-native';
import {useScale} from '../hooks';

// 0.95 helps with aligns with elements on small devices
export function Badges() {
  const {small, medium} = useScale();
  return (
    <View style={[styles.badges, (small || medium) && {alignSelf: 'center'}]}>
      <Link role="link" href={'https://lyrist.app/ios'} target={'_blank'}>
        <Image
          alt={'app-store-badge'}
          src={'/app-store.png'}
          height={(small ? 60 : 80) * 0.95}
          width={(small ? 180 : 240) * 0.95}
        />
      </Link>
      <Link
        role="link"
        href={'https://lyrist.app/android'}
        style={{marginLeft: 8}}
        target={'_blank'}>
        <Image
          alt={'google-play-badge'}
          src={'/google-play.png'}
          height={(small ? 60 : 80) * 0.95}
          width={(small ? 202.5 : 270) * 0.95}
        />
      </Link>
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
