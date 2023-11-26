import Image from 'next/image';
import Link from 'next/link';
import {useState} from 'react';
import {FaBars, FaRegTimesCircle} from 'react-icons/fa';
import {Pressable, Text, View} from 'react-native';
import {useScale} from '../hooks';
import {LyristText} from '../packages/components';
import {LYRIST_BLUE} from '../packages/constants';

export function Header() {
  const {scale, small} = useScale();
  const styles = createStyles(scale);
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [line0, setLine0] = useState(false);
  const [line1, setLine1] = useState(false);
  const [line2, setLine2] = useState(false);
  return (
    <View style={styles.section}>
      <View style={[styles.subSection]}>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 20}}>
          <View style={styles.logoContainer}>
            <Image alt={'logo'} src={'/logo.png'} fill />
          </View>
          <Link
            role="link"
            href={'#reviews'}
            style={{textDecoration: line0 ? 'underline black' : 'none'}}>
            <Pressable onHoverIn={() => setLine0(true)} onHoverOut={() => setLine0(false)}>
              <Text style={styles.link}>Reviews</Text>
            </Pressable>
          </Link>
        </View>
        <Link role="link" href={'/redirect'} style={{textDecoration: 'none'}}>
          {/* PASSING INLINE FUNCTIONS RESULTS IN A RERENDER!!!!! <Pressable onHoverIn={() => setLine3(true)} onHoverOut={() => setLine3(false)}> */}
          <LyristText
            style={[
              styles.signIn,
              small && {paddingVertical: 10, paddingHorizontal: 12, alignSelf: 'center'},
            ]}
            weight={'Medium'}>
            Try the web app
          </LyristText>
          {/* </Pressable> */}
        </Link>
        {small ? (
          <View style={styles.menu}>
            {menuIsOpen ? (
              <FaRegTimesCircle color={'#000'} onClick={() => setMenuIsOpen(false)} size={24} />
            ) : (
              <FaBars color={'#000'} onClick={() => setMenuIsOpen(true)} size={24} />
            )}
          </View>
        ) : (
          <View style={styles.links}>
            <Text style={styles.soon}>Coming soon...</Text>
            <Link href={''} style={{cursor: 'default', textDecoration: 'none'}}>
              <Text style={styles.tryPlus}>Try Lyrist+</Text>
            </Link>
            <Link href={''} style={{cursor: 'default', textDecoration: 'none'}}>
              <Text style={styles.signIn}>Sign in</Text>
            </Link>
          </View>
        )}
      </View>
      {menuIsOpen && (
        <View style={styles.menuLinks}>
          <Link href={''} style={{textDecoration: 'none'}}>
            <Text style={styles.tryPlus}>Try Lyrist+</Text>
          </Link>
          <Link href={''} style={{textDecoration: 'none'}}>
            <Text style={styles.signIn}>Sign in</Text>
          </Link>
        </View>
      )}
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
  links: {
    display: 'none',
    flexDirection: 'row',
    alignItems: 'center',
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
  tryPlus: {
    borderWidth: 1,
    borderRadius: 5,
    fontFamily: 'Fira Sans',
    fontSize: 16,
    marginVertical: 0,
    marginHorizontal: '1rem',
    paddingVertical: '0.75rem',
    paddingHorizontal: '1.5rem',
    borderColor: 'gray',
    color: 'gray',
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
  menu: {
    display: 'none',
    justifyContent: 'center',
  },
  menuLinks: {},
  soon: {color: 'gray', fontFamily: 'Fira Sans', fontSize: '1rem', marginHorizontal: '1rem'},
});
