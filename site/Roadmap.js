'use client';
import {View} from 'react-native';
import {SectionTitle} from './SectionTitle';

export function Roadmap() {
  return (
    <div id={'features'} style={{width: '100%'}}>
      <View style={{gap: 24}}>
        <SectionTitle>Help us decide what's next</SectionTitle>
        <iframe
          src="https://app.loopedin.io/lyrist/roadmap?linkType=webIframe"
          height="1000"
          width="100%"
          style={{border: 'none'}}
        />
      </View>
    </div>
  );
}
