import Image from 'next/image';
import Link from 'next/link';
import {useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useScale} from '../hooks';

export function Navbar() {
  const {small, medium} = useScale();
  const [line1, setLine1] = useState(false);
  const [line2, setLine2] = useState(false);
  const [line3, setLine3] = useState(false);
  const [line4, setLine4] = useState(false);
  const [line5, setLine5] = useState(false);
  return (
    <View style={styles.section}>
      <View
        style={[
          styles.subSection,
          medium && {flexDirection: 'column', alignItems: 'flex-start', gap: 20},
        ]}>
        <View style={styles.social}>
          <Link role="link" href={'https://instagram.com/lyrist.app'} target={'_blank'}>
            <Image alt={'instagram'} src={'/instagram.png'} width={24} height={24} />
          </Link>
          <Link role="link" href={'https://tiktok.com/@lyrist.app'} target={'_blank'}>
            <Image alt={'tiktok'} src={'/tiktok.png'} width={24} height={24} />
          </Link>
          <Link role="link" href={'https://twitter.com/lyristapp'} target={'_blank'}>
            <Image alt={'twitter'} src={'/twitter.png'} width={24} height={24} />
          </Link>
        </View>
        <View style={[styles.navigation, medium && {flexDirection: 'column'}]}>
          <Link
            href={'https://app.loopedin.io/lyrist'}
            style={{textDecoration: line1 ? 'underline black' : 'none'}}
            target={'_blank'}>
            <Pressable onHoverIn={() => setLine1(true)} onHoverOut={() => setLine1(false)}>
              <Text style={styles.link}>Roadmap</Text>
            </Pressable>
          </Link>
          <Link
            href={'/faq'}
            style={{textDecoration: line2 ? 'underline black' : 'none'}}
            target={'_blank'}>
            <Pressable onHoverIn={() => setLine2(true)} onHoverOut={() => setLine2(false)}>
              <Text style={styles.link}>FAQ</Text>
            </Pressable>
          </Link>
          <Link
            href={'/terms'}
            style={{textDecoration: line3 ? 'underline black' : 'none'}}
            target={'_blank'}>
            <Pressable onHoverIn={() => setLine3(true)} onHoverOut={() => setLine3(false)}>
              <Text style={styles.link}>Terms of Use</Text>
            </Pressable>
          </Link>
          <Link
            href={'/privacy'}
            style={{textDecoration: line4 ? 'underline black' : 'none'}}
            target={'_blank'}>
            <Pressable onHoverIn={() => setLine4(true)} onHoverOut={() => setLine4(false)}>
              <Text style={styles.link}>Privacy Policy</Text>
            </Pressable>
          </Link>
          <Link
            href={'mailto:lyrist.app@gmail.com'}
            style={{textDecoration: line5 ? 'underline black' : 'none'}}>
            <Pressable onHoverIn={() => setLine5(true)} onHoverOut={() => setLine5(false)}>
              <Text style={styles.link}>Contact Us</Text>
            </Pressable>
          </Link>
        </View>
        <Link
          href="https://www.producthunt.com/posts/lyrist?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-lyrist"
          target="_blank">
          <Image
            src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=402246&theme=light"
            alt="Lyrist - Write&#0032;lyrics&#0032;to&#0032;music&#0032;you&#0032;find&#0032;online | Product Hunt"
            // style="width: 250px; height: 54px;"
            width={small ? 125 : 250}
            height={small ? 27 : 54}
          />
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    alignSelf: 'center',
    maxWidth: 1000,
    width: '100%',
  },
  subSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navigation: {
    flexDirection: 'row',
    gap: 20,
  },
  social: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 120,
  },
  link: {
    fontFamily: 'Fira Sans',
    fontSize: 16,
  },
});
