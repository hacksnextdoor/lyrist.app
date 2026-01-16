import {PricingPageClient} from 'site/PricingPageClient';

export const metadata = {
  title: 'Pricing',
  description: 'Choose the perfect Lyrist plan for your songwriting needs. Free and Plus subscription options available.',
  alternates: {
    canonical: '/pricing',
  },
};

export default function Page() {
  return <PricingPageClient />;
}
