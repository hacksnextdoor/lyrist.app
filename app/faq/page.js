import {PageWrapper} from 'site/PageWrapper';
import {FaqSection} from 'site/FaqSection';

export const metadata = {
  title: 'FAQ',
};

export default function FaqPage() {
  return (
    <PageWrapper>
      <FaqSection />
    </PageWrapper>
  );
}
