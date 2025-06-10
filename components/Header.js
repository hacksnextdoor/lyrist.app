import Image from 'next/image';
import Link from 'next/link';
import {useState} from 'react';
import {Pressable, View} from 'react-native';
import {useScale} from '../hooks';
import {LyristText} from '../packages/components';

export function Header() {
  const {scale, small} = useScale();
  const styles = createStyles(scale);
  const [line0, setLine0] = useState(false);
  return (
    <View style={styles.section}>
      <View style={styles.subSection}>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 20}}>
          <View style={styles.logoContainer}>
            <Image alt={'logo'} src={'/logo.png'} fill />
          </View>
          <Link
            role="link"
            href={'/pricing'}
            style={{textDecoration: line0 ? 'underline black' : 'none'}}>
            {/* FIXME: PASSING INLINE FUNCTIONS LIKE BELOW RESULTS IN A RERENDER */}
            <Pressable onHoverIn={() => setLine0(true)} onHoverOut={() => setLine0(false)}>
              <LyristText style={{fontSize: small ? 16 : 24}}>Pricing</LyristText>
            </Pressable>
          </Link>
        </View>
        <Link role="link" href={'/redirect'} style={{textDecoration: 'none'}}>
          <LyristText
            style={[
              styles.tryApp,
              small && {paddingVertical: 10, paddingHorizontal: 12, alignSelf: 'center'},
              {fontSize: small ? 16 : 24},
            ]}>
            Try the web app
          </LyristText>
        </Link>
      </View>
    </View>
  );
}

const createStyles = scale => ({
  section: {
    maxWidth: 1400,
    width: '100%',
    alignSelf: 'center',
  },
  subSection: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 140.4375 / 1.5,
    minHeight: 47.625 / 1.5,
    maxWidth: 140.4375 * 1.5,
    maxHeight: 47.625 * 1.5,
    width: scale(140.4375),
    height: scale(47.625),
  },
  tryApp: {
    backgroundColor: 'white',
    borderColor: 'black',
    borderRadius: 8,
    borderWidth: 2,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
});
