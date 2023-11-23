import {NextRequest, NextResponse} from 'next/server';
import {fetchYouTubeData} from './youtube';
import {fetchSoundCloudData} from './soundcloud';

export async function GET({url}: NextRequest) {
  const {searchParams} = new URL(url);
  const query = searchParams.get('q');
  const selectedPlatform = searchParams.get('plat') ?? 'youtube';
  const fetchData = selectedPlatform === 'soundcloud' ? fetchSoundCloudData : fetchYouTubeData;
  const songs = await fetchData(query);
  return NextResponse.json(songs);
}
