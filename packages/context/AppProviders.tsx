'use client';
import {EmulatorToggle} from '../components';
import {useHydration} from '../hooks/useHydration';
import {AuthProvider} from './AuthProvider';
import {LoadingProvider} from './LoadingProvider';
import {PagesProvider} from './PagesProvider';
import {RevenueCatProvider} from './RevenueCatProvider';

// keep the order - LoadingProvider first so others can use it
const providers = [
  LoadingProvider,
  AuthProvider,
  PagesProvider,
  RevenueCatProvider,
  // Add more providers here
];

export const AppProviders = ({children}) => {
  useHydration();

  const wrapped = providers.reduceRight((child, Provider) => {
    return <Provider>{child}</Provider>;
  }, children);

  return (
    <>
      {wrapped}
      <EmulatorToggle />
    </>
  );
};
