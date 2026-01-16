import {Landing} from 'site/Landing';

export const metadata = {
  title: 'Lyrist - Songwriting App for Lyrics, Rhymes & Beats',
  description:
    "The all-in-one songwriting toolkit. Write lyrics, find rhymes, discover type beats, cure writer's block, and create songs faster. Trusted by thousands of songwriters.",
  keywords: [
    'songwriting app',
    'lyrics writing',
    'rhyme generator',
    'type beats',
    'beat finder',
    "writer's block",
    'song lyrics',
    'music creation',
    'songwriting tool',
  ],
  alternates: {
    canonical: '/',
  },
};

export default function LandingPage() {
  return <Landing />;
}
