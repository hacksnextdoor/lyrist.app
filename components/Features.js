import Image from 'next/image';
import {FaBook, FaPencilAlt, FaSearch, FaShareAlt, FaStopwatch} from 'react-icons/fa';
import {useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {useScale} from '../hooks';
import {LyristText} from '../packages/components';
import {LYRIST_BLUE} from '../packages/constants';

export function Features() {
  const {small, medium} = useScale();
  const ICON_SIZE = small ? 16 : medium ? 24 : 32;
  const GIF_HEIGHT = small ? 240 : medium ? 320 : 400;
  const GIF_WIDTH = GIF_HEIGHT * (442 / 300); // h:w = 300:442 or 300:443
  const [currentIndex, setCurrentIndex] = useState(0);
  const features = [
    {
      subtitle: 'Search YouTube or SoundCloud',
      img: <Image src={'/search.gif'} width={GIF_WIDTH} height={GIF_HEIGHT} alt={'search gif'} />,
      icon: (
        <Pressable onPress={() => setCurrentIndex(0)}>
          <FaSearch
            color={currentIndex === 0 ? LYRIST_BLUE : 'rgba(0, 0, 0, 0.5)'}
            size={ICON_SIZE * 1.5}
          />
        </Pressable>
      ),
    },
    {
      subtitle: 'After selecting, start writing',
      img: <Image src={'/write.gif'} width={GIF_WIDTH} height={GIF_HEIGHT} alt={'write gif'} />,
      icon: (
        <Pressable onPress={() => setCurrentIndex(1)}>
          <FaPencilAlt
            color={currentIndex === 1 ? LYRIST_BLUE : 'rgba(0, 0, 0, 0.5)'}
            size={ICON_SIZE * 1.5}
          />
        </Pressable>
      ),
    },
    {
      subtitle: 'Find rhymes and other related words',
      img: <Image src={'/words.gif'} width={GIF_WIDTH} height={GIF_HEIGHT} alt={'words gif'} />,
      icon: (
        <Pressable onPress={() => setCurrentIndex(2)}>
          <FaBook
            color={currentIndex === 2 ? LYRIST_BLUE : 'rgba(0, 0, 0, 0.5)'}
            size={ICON_SIZE * 1.5}
          />
        </Pressable>
      ),
    },
    {
      subtitle: "Time yourself to overcome writer's block",
      img: <Image src={'/block.gif'} width={GIF_WIDTH} height={GIF_HEIGHT} alt={'block gif'} />,
      icon: (
        <Pressable onPress={() => setCurrentIndex(3)}>
          <FaStopwatch
            color={currentIndex === 3 ? LYRIST_BLUE : 'rgba(0, 0, 0, 0.5)'}
            size={ICON_SIZE * 1.5}
          />
        </Pressable>
      ),
    },
    {
      subtitle: 'Share your content!',
      img: <Image src={'/share.gif'} width={GIF_WIDTH} height={GIF_HEIGHT} alt={'share gif'} />,
      icon: (
        <Pressable onPress={() => setCurrentIndex(4)}>
          <FaShareAlt
            color={currentIndex === 4 ? LYRIST_BLUE : 'rgba(0, 0, 0, 0.5)'}
            size={ICON_SIZE * 1.5}
          />
        </Pressable>
      ),
    },
  ];
  const {img, subtitle} = features[currentIndex];
  return (
    <div id={'features'}>
      <View style={styles.section}>
        <LyristText style={{fontSize: ICON_SIZE * 2, textAlign: 'center'}} weight={'Medium'}>
          {subtitle}
        </LyristText>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: ICON_SIZE,
            height: GIF_HEIGHT,
          }}>
          <View style={{gap: ICON_SIZE}}>
            {features.map(({icon}, index) => (
              <View key={index} style={{flexDirection: 'row'}}>
                {icon}
              </View>
            ))}
          </View>
          <View style={{gap: 16}}>{img}</View>
        </View>
      </View>
    </div>
  );
}

const styles = StyleSheet.create({
  section: {
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
    gap: 24,
  },
});
