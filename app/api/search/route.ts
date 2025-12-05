import {NextRequest, NextResponse} from 'next/server';
import {fetchYouTubeData} from './youtube';
import {fetchSoundCloudData} from './soundcloud';

const cache = new Map<string, {data: any; expires: number}>();
const CACHE_TTL = 1000 * 60 * 30; // 30 minutes

function getCached(key: string) {
  const cached = cache.get(key);
  if (cached && cached.expires > Date.now()) {
    return cached.data;
  }
  cache.delete(key);
  return null;
}

function setCache(key: string, data: any) {
  if (cache.size > 500) {
    const firstKey = cache.keys().next().value;
    cache.delete(firstKey);
  }
  cache.set(key, {data, expires: Date.now() + CACHE_TTL});
}

export async function GET({url}: NextRequest) {
  const {searchParams} = new URL(url);
  const query = searchParams.get('q');
  const selectedPlatform = searchParams.get('plat') ?? 'youtube';

  const cacheKey = `${selectedPlatform}:${query?.toLowerCase()}`;
  const cached = getCached(cacheKey);
  if (cached) {
    return NextResponse.json(cached);
  }

  const fetchData = selectedPlatform === 'soundcloud' ? fetchSoundCloudData : fetchYouTubeData;
  const songs = await fetchData(query);

  if (songs && songs.length > 0) {
    setCache(cacheKey, songs);
  }

  return NextResponse.json(songs);
}
