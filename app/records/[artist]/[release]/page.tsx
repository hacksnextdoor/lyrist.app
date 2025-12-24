import {notFound} from 'next/navigation';
import {ReleaseScreen} from '../../../../packages/records/ReleaseScreen';
import {getArtist, getRelease, getAllReleaseSlugs} from '../../../../packages/records/data';

interface Props {
  params: Promise<{artist: string; release: string}>;
}

export async function generateStaticParams() {
  return getAllReleaseSlugs().map(({artist, release}) => ({artist, release}));
}

export async function generateMetadata({params}: Props) {
  const {artist: artistSlug, release: releaseSlug} = await params;
  const release = getRelease(artistSlug, releaseSlug);
  if (!release) return {};

  return release.metadata;
}

export default async function Page({params}: Props) {
  const {artist: artistSlug, release: releaseSlug} = await params;
  const artist = getArtist(artistSlug);
  const release = getRelease(artistSlug, releaseSlug);

  if (!artist || !release) {
    notFound();
  }

  return <ReleaseScreen artist={artist} release={release} />;
}
