import {View} from 'react-native';
// import Ionicon from 'react-native-vector-icons/Ionicons';
// import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons';
import {normalize} from '../utils';
import {LyristText} from './LyristText';
// import {useTheme} from '@react-navigation/native';
import {TURQUOISE} from '../constants';

export function Features() {
  // const {colors} = useTheme();
  return (
    <>
      <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
        {/* <Ionicon name={'diamond'} color={TURQUOISE} size={20} /> */}
        <LyristText style={{flex: 1}}>Unlimited pages</LyristText>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
        {/* <Ionicon name={'diamond'} color={TURQUOISE} size={20} /> */}
        <LyristText style={{flex: 1}}>Unlimited AI-powered suggestions</LyristText>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
        {/* <Ionicon name={'diamond'} color={TURQUOISE} size={20} /> */}
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <LyristText>Organize your work with folders</LyristText>
        </View>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
        {/* <Ionicon name={'diamond'} color={TURQUOISE} size={20} /> */}
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <LyristText>LyrAssist </LyristText>
          <Soon />
        </View>
        {/* <LyristText style={{flex: 1}}>Unlimited LyrAssist chats</LyristText> */}
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
        {/* <Ionicon name={'diamond'} color={TURQUOISE} size={20} /> */}
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <LyristText>Lyrist Connect </LyristText>
          <Soon />
        </View>
      </View>
      <LyristText style={{fontSize: normalize(16)}} weight={'Medium'}>
        What you get now for free
      </LyristText>
      <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
        {/* <Ionicon name={'phone-portrait-outline'} color={colors.primary} size={20} /> */}
        <LyristText style={{flex: 1}}>Access your data across multiple devices</LyristText>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
        {/* <SimpleLineIcon name={'magnifier'} color={colors.primary} size={20} /> */}
        <LyristText style={{flex: 1}}>Search YouTube and SoundCloud</LyristText>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
        {/* <SimpleLineIcon name={'book-open'} color={colors.primary} size={20} /> */}
        <LyristText style={{flex: 1}}>Find rhymes and other related words</LyristText>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
        {/* <SimpleLineIcon name={'music-tone-alt'} color={colors.primary} size={20} /> */}
        <LyristText style={{flex: 1}}>Import audio from urls</LyristText>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
        {/* <Ionicon name={'timer-outline'} color={colors.primary} size={20} /> */}
        <LyristText style={{flex: 1}}>Time yourself to overcome writer's block</LyristText>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
        {/* <Ionicon name={'chatbubble-ellipses-outline'} color={colors.primary} size={20} /> */}
        <LyristText style={{flex: 1}}>Chat with us for help or feedback</LyristText>
      </View>
    </>
  );
}

export function Soon() {
  return (
    <View
      style={{
        backgroundColor: TURQUOISE,
        paddingHorizontal: 4,
        paddingVertical: 2,
        borderRadius: 4,
      }}>
      <LyristText style={{color: 'white'}}>soon</LyristText>
    </View>
  );
}
