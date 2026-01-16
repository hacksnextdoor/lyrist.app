import {Roadmap} from 'site/Roadmap';

export const metadata = {
  title: 'Product Roadmap',
  description:
    'See what features are coming next to Lyrist. Vote on upcoming features and help shape the future of your favorite songwriting app.',
  alternates: {
    canonical: '/roadmap',
  },
};

export default function RoadmapPage() {
  return <Roadmap />;
}
