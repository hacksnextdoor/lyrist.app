import {Terms} from 'site/Terms';

export const metadata = {
  title: 'Terms & Conditions',
  description: 'Read the Terms and Conditions for using Lyrist songwriting app. Understand your rights and responsibilities as a Lyrist user.',
  alternates: {
    canonical: '/terms',
  },
};

export default function TermsPage() {
  return <Terms />;
}
