import {notFound} from 'next/navigation';
import {ArtistScreen} from '../../../packages/records/ArtistScreen';
import {getArtist, getAllArtistSlugs} from '../../../packages/records/data';

interface Props {
  params: Promise<{artist: string}>;
}

export async function generateStaticParams() {
  return getAllArtistSlugs().map(artist => ({artist}));
}

export async function generateMetadata({params}: Props) {
  const {artist: artistSlug} = await params;
  const artist = getArtist(artistSlug);
  if (!artist) return {};

  return {
    title: `${artist.name} - Releases`,
    description: artist.metaDescription,
  };
}

export default async function Page({params}: Props) {
  const {artist: artistSlug} = await params;
  const artist = getArtist(artistSlug);

  if (!artist) {
    notFound();
  }

  return <ArtistScreen artist={artist} />;
}
