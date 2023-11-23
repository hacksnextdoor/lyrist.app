import {
  FaBook,
  FaFileAlt,
  FaPencilAlt,
  FaRegLightbulb,
  FaSearch,
  FaStopwatch,
  FaUniversity,
  FaVolumeUp,
} from 'react-icons/fa';
import {StyleSheet, Text, View} from 'react-native';
import {useScale} from '../hooks';

export function Features() {
  const {small} = useScale();
  return (
    <View style={styles.section}>
      <View style={[styles.features, small && {flexDirection: 'column', gap: 16}]}>
        <View style={[styles.feature, small && {padding: 16}]}>
          <View style={styles.content}>
            <Text
              style={[
                styles.title,
                {textAlign: 'right'},
                small && {fontSize: 16, textAlign: 'left'},
              ]}>
              Choose a platform first
            </Text>
            <Text
              style={[
                styles.description,
                {textAlign: 'right'},
                small && {fontSize: 16, textAlign: 'left'},
              ]}>
              <Text style={{color: '#077AFF'}}>Search</Text> to get results from YouTube or
              SoundCloud.
            </Text>
          </View>
          <View style={[styles.icons, small && {display: 'none'}]}>
            <FaSearch size={80} />
            <FaVolumeUp size={80} />
          </View>
        </View>
        <View
          style={[
            styles.feature,
            {backgroundColor: '#077AFF22', borderRadius: 8},
            small && {padding: 16},
          ]}>
          <View style={[styles.icons, small && {display: 'none'}]}>
            <FaPencilAlt size={80} />
            <FaUniversity size={80} />
          </View>
          <View style={styles.content}>
            <Text style={[styles.title, small && {fontSize: 16}]}>
              After selecting, start writing
            </Text>
            <Text style={[styles.description, small && {fontSize: 16}]}>
              Your text will be saved automatically in{' '}
              <Text style={{color: '#077AFF'}}>My Library</Text>.
            </Text>
          </View>
        </View>
        <View style={[styles.feature, small && {padding: 16}]}>
          <View style={styles.content}>
            <Text
              style={[
                styles.title,
                {textAlign: 'right'},
                small && {fontSize: 16, textAlign: 'left'},
              ]}>
              Enhance your creativity
            </Text>
            <Text
              style={[
                styles.description,
                {textAlign: 'right'},
                small && {fontSize: 16, textAlign: 'left'},
              ]}>
              Learn rhymes, synonyms, and antonyms of new words with the{' '}
              <Text style={{color: '#077AFF'}}>Word Finder</Text>.
            </Text>
          </View>
          <View style={[styles.icons, small && {display: 'none'}]}>
            <FaRegLightbulb size={80} />
            <FaBook size={80} />
          </View>
        </View>
        <View
          style={[
            styles.feature,
            {backgroundColor: '#077AFF22', borderRadius: 8},
            small && {padding: 16},
          ]}>
          <View style={[styles.icons, small && {display: 'none'}]}>
            <FaStopwatch size={80} />
            <FaFileAlt size={80} />
          </View>
          <View style={styles.content}>
            <Text style={[styles.title, small && {fontSize: 16}]}>Feeling stuck?</Text>
            <Text style={[styles.description, small && {fontSize: 16}]}>
              <Text style={{color: '#077AFF'}}>Writer's Block</Text> forces you to write without
              judgment by setting a timer.
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    maxWidth: 1000,
    width: '100%',
    alignSelf: 'center',
  },
  features: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  feature: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: 32,
  },
  icons: {
    flex: 1,
    justifyContent: 'space-evenly',
    flexDirection: 'row',
  },
  content: {
    flex: 1,
    width: '100%',
    gap: 8,
  },
  title: {
    fontFamily: 'Fira Sans',
    fontWeight: '600',
    fontSize: 32,
  },
  description: {
    fontFamily: 'Fira Sans',
    fontSize: 32,
  },
});
