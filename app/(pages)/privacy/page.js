import {Privacy} from 'site/Privacy';

export const metadata = {
  title: 'Privacy Policy',
  description: 'Learn how Lyrist protects your privacy and handles your data. Our commitment to keeping your songwriting and personal information secure.',
  alternates: {
    canonical: '/privacy',
  },
};

export default function PrivacyPage() {
  return <Privacy />;
}
