'use client';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {useState} from 'react';
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
  // Create QueryClient instance once per app lifecycle
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  const wrapped = providers.reduceRight((child, Provider) => {
    return <Provider>{child}</Provider>;
  }, children);

  return (
    <QueryClientProvider client={queryClient}>
      {wrapped}
      <EmulatorToggle />
    </QueryClientProvider>
  );
};
