import {SearchScreen} from '../../../packages/screens';

export function generateMetadata({searchParams}) {
  return {
    title: 'Search' + ` ${searchParams['plat'] ?? 'youtube'}`,
  };
}

export default function Page() {
  return <SearchScreen />;
}
