import {Landing} from 'site/Landing';

export const metadata = {
  title: "Lyrist - Free Songwriting App | Find Type Beats, Beat Writer's Block",
  description:
    'Discover type beats, write lyrics with free AI tools, and find rhymes — all in one place. No account needed to start. Available on iOS, Android, and web.',
  keywords: [
    'songwriting app',
    'free songwriting app',
    'lyrics writing app',
    'rhyme finder',
    'type beats',
    'beat finder',
    "writer's block",
    'lyricist app',
    'song lyrics app',
    'lyrist',
  ],
  alternates: {
    canonical: '/',
  },
};

export default function LandingPage() {
  return <Landing />;
}
