import {FaqSection} from 'site/FaqSection';

export const metadata = {
  title: 'FAQ - Frequently Asked Questions',
  description:
    'Get answers to common questions about Lyrist songwriting app. Learn about features, pricing, subscriptions, and how to get the most out of your songwriting toolkit.',
  alternates: {
    canonical: '/faq',
  },
};

// FAQPage Schema for rich snippets in Google
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is Lyrist really free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! The core features of Lyrist are free to use forever. We offer a Plus subscription for advanced AI features and cloud sync.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does Lyrist own my lyrics?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Absolutely not. You retain 100% ownership and copyright of everything you write within Lyrist.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I use it offline?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Yes, the mobile app works fully offline. Cloud sync will resume once you're back online.",
      },
    },
    {
      '@type': 'Question',
      name: 'What is a type beat?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Type beats are original sounds made to match the vibe of a particular artist, e.g., 'doja cat type beats'.",
      },
    },
    {
      '@type': 'Question',
      name: 'How does the AI work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Our AI suggests lines based on your previous context, helping you bridge gaps in your song without taking over your creative process. Writing full songs is a no-no.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are my lyrics used to train AI?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Your lyrics and music are not used to train AI models. Your creative expression is uniquely yours.',
      },
    },
    {
      '@type': 'Question',
      name: 'What if I delete the app off my phone?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Lyrist supports cloud storage so you can access your data from any device.',
      },
    },
    {
      '@type': 'Question',
      name: 'How can I close my account?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'To close your account and delete your data permanently, email us at lyrist.app@gmail.com. After you close your account, we email you a link which you can use to reactivate it within 7 days. After those 7 days, your account cannot be reactivated and the process to delete your data will be initiated. You can always create a new one. Note: You can use the same email address to create a new account after 14 days from the date of closing your account.',
      },
    },
    {
      '@type': 'Question',
      name: 'I have another question not answered here.',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'If you have feedback or additional questions, please contact us at lyrist.app@gmail.com.',
      },
    },
  ],
};

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(faqSchema)}}
      />
      <FaqSection />
    </>
  );
}
