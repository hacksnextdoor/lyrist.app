import Image from 'next/image';
import Link from 'next/link';
import {useState} from 'react';
import {Pressable, Text, View} from 'react-native';
import {useScale} from '../hooks';
import {LyristText} from '../packages/components';
import {LYRIST_BLUE} from '../packages/constants';

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
            href={'#reviews'}
            style={{textDecoration: line0 ? 'underline black' : 'none'}}>
            {/* FIXME: PASSING INLINE FUNCTIONS LIKE BELOW RESULTS IN A RERENDER */}
            <Pressable onHoverIn={() => setLine0(true)} onHoverOut={() => setLine0(false)}>
              <Text style={styles.link}>Reviews</Text>
            </Pressable>
          </Link>
        </View>
        <Link role="link" href={'/redirect'} style={{textDecoration: 'none'}}>
          <LyristText
            style={[
              styles.signIn,
              small && {paddingVertical: 10, paddingHorizontal: 12, alignSelf: 'center'},
            ]}
            weight={'Medium'}>
            Try the web app
          </LyristText>
        </Link>
      </View>
    </View>
  );
}

const createStyles = scale => ({
  section: {
    maxWidth: 1000,
    width: '100%',
    alignSelf: 'center',
  },
  subSection: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  link: {
    fontFamily: 'Fira Sans',
    fontSize: 16,
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
  signIn: {
    backgroundColor: LYRIST_BLUE,
    color: 'white',
    borderRadius: 5,
    fontSize: 16,
    paddingVertical: 20,
    paddingHorizontal: 24,
    color: 'white',
  },
});
