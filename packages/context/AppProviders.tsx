import {AuthProvider} from './AuthProvider';
import {PagesProvider} from './PagesProvider';

// keep the order
const providers = [
  AuthProvider,
  PagesProvider,
  // Add more providers here
];

export const AppProviders = ({children}) => {
  return providers.reduceRight((child, Provider) => {
    return <Provider>{child}</Provider>;
  }, children);
};
