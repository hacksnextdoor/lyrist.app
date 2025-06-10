import {useScale} from '../hooks';
import {StyleSheet, View} from 'react-native';
import {LyristText} from '../packages/components';

export function Roadmap() {
  const {small, medium} = useScale();
  const ICON_SIZE = small ? 16 : medium ? 24 : 32;
  return (
    <div id={'features'}>
      <View style={styles.section}>
        <LyristText style={{fontSize: ICON_SIZE * 2, textAlign: 'center'}} weight={'Medium'}>
          Help us decide what's next
        </LyristText>
        <iframe
          src="https://app.loopedin.io/lyrist/roadmap?linkType=webIframe"
          height="1000"
          width="100%"
          frameborder="0"
        />
      </View>
    </div>
  );
}

const styles = StyleSheet.create({
  section: {
    maxWidth: 1400,
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
    marginHorizontal: 'auto',
    gap: 24,
  },
});
