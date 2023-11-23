import Image from 'next/image';
import Link from 'next/link';
import {StyleSheet, View} from 'react-native';
import {useScale} from '../hooks';

export function Badges() {
  const {small} = useScale();
  return (
    <View style={styles.badges}>
      <Link role="link" href={'https://lyrist.app/ios'} target={'_blank'}>
        <Image
          alt={'app-store-badge'}
          src={'/app-store.png'}
          height={small ? 40 : 60}
          width={small ? 120 : 180}
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
          height={small ? 40 : 60}
          width={small ? 135 : 202.5}
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
