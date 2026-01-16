'use client';
import {usePathname} from 'next/navigation';
import {View} from 'react-native';
import {useScale} from '../../packages/hooks/useScale';
import {AppHeader} from './AppHeader';
import {TwoPanelLayout} from './TwoPanelLayout';

export default function HomeLayout({children}) {
  const {small} = useScale();
  const pathname = usePathname();

  // Show two-panel layout for /search and /library on all but mobile
  const isTwoPanelRoute = pathname === '/search' || pathname === '/library';
  const showTwoPanel = !small && isTwoPanelRoute;

  return (
    <View style={{flex: 1, height: '100vh'} as any}>
      {/* TwoPanelLayout has its own header, so hide AppHeader when showing it */}
      {!showTwoPanel && <AppHeader showTwoPanel={false} />}
      <View style={{flex: 1, alignItems: 'center'}}>
        <View style={{flex: 1, width: '100%'}}>
          {showTwoPanel ? <TwoPanelLayout /> : children}
        </View>
      </View>
    </View>
  );
}
