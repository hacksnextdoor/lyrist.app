'use client';
import {useState} from 'react';
import {GiMicrophone} from 'react-icons/gi';
import {View, StyleSheet} from 'react-native';
import {LyristText} from 'packages/components';
import {LYRIST_BLUE} from 'packages/constants';
import {useScale} from 'packages/hooks/useScale';
import {InfoCard} from './InfoCard';
import {SectionTitle} from './SectionTitle';

const FAQS = [
  {
    q: 'Is Lyrist really free?',
    a: 'Yes! The core features of Lyrist are free to use forever. We offer a Plus subscription for advanced AI features and cloud sync.',
  },
  {
    q: 'Does Lyrist own my lyrics?',
    a: 'Absolutely not. You retain 100% ownership and copyright of everything you write within Lyrist.',
  },
  {
    q: 'Can I use it offline?',
    a: "Yes, the mobile app works fully offline. Cloud sync will resume once you're back online.",
  },
  {
    q: 'How does the AI work?',
    a: 'Our AI suggests lines based on your previous context, helping you bridge gaps in your song without taking over your creative process.',
  },
  {
    q: 'What if I delete the app off my phone?',
    a: 'Lyrist supports cloud storage so you can access your data from any device.',
  },
  {
    q: 'How can I close my account?',
    a: 'To close your account and delete your data permanently, email us at lyrist.app@gmail.com. After you close your account, we email you a link which you can use to reactivate it within 7 days. After those 7 days, your account cannot be reactivated and the process to delete your data will be initiated. You can always create a new one. Note: You can use the same email address to create a new account after 14 days from the date of closing your account.',
  },
  {
    q: 'I have another question not answered here.',
    a: 'If you have feedback or additional questions, please contact us at lyrist.app@gmail.com.',
  },
];

export function FaqSection({showHeader = true, collapsible = false}) {
  const {small, medium} = useScale();
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = index => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const pageGap = small ? 32 : medium ? 48 : 64;

  return (
    <View>
      {showHeader && (
        <View style={{marginBottom: pageGap, alignItems: 'center'}}>
          <SectionTitle>Frequently Asked Questions</SectionTitle>
        </View>
      )}
      <View
        style={{
          backgroundColor: LYRIST_BLUE,
          borderRadius: 12,
          padding: 24,
          flexDirection: small ? 'row' : 'row',
          gap: small ? 16 : 24,
          alignItems: 'center',
          marginBottom: 16,
        }}>
        <View style={{flex: 1, gap: 12}}>
          <LyristText weight="Medium" style={{fontSize: 16, color: 'white'}}>
            What is a type beat?
          </LyristText>
          <LyristText
            style={{
              color: 'white',
              fontSize: 16,
              lineHeight: 24,
              opacity: 0.8,
            }}>
            Type beats are original sounds made to match the vibe of a particular artist, e.g.,
            "doja cat type beats".​
          </LyristText>
        </View>
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            borderWidth: 2,
            borderColor: 'white',
            justifyContent: 'center',
            alignItems: 'center',
            flexShrink: 0,
            order: small ? 1 : 1,
          }}>
          <GiMicrophone size={36} color={'white'} style={{color: 'white'}} />
        </View>
      </View>
      <View style={styles.faqList}>
        {FAQS.map((faq, i) => (
          <InfoCard
            key={i}
            title={faq.q}
            collapsible={collapsible}
            isOpen={openFaq === i}
            onToggle={() => toggleFaq(i)}>
            {faq.a}
          </InfoCard>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  faqList: {
    gap: 16,
  },
});
