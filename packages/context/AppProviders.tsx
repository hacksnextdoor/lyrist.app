'use client';
import {AuthProvider} from './AuthProvider';
import {PagesProvider} from './PagesProvider';
import {RevenueCatProvider} from './RevenueCatProvider';

// keep the order
const providers = [
  AuthProvider,
  PagesProvider,
  RevenueCatProvider,
  // Add more providers here
];

export const AppProviders = ({children}) => {
  return providers.reduceRight((child, Provider) => {
    return <Provider>{child}</Provider>;
  }, children);
};
