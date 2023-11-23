import dayjs from 'dayjs';
import {formatDistanceToNow} from 'date-fns';
import {SONGS_REQUEST_ERROR} from '../../../packages/constants';
import {abbreviate, inDevEnv} from '../../../packages/utils';
import {Audio, SoundCloudTrackResponse} from '../../../packages/types';

const {
  SOUNDCLOUD_CLIENT_ID,
  SOUNDCLOUD_CLIENT_ID_DEV,
  SOUNDCLOUD_CLIENT_SECRET,
  SOUNDCLOUD_CLIENT_SECRET_DEV,
} = process.env;

let tokenFromCache: {value: string; expirationDate: dayjs.Dayjs} | null = null;

export async function fetchResponseFromUrl(url: string) {
  const token = await getToken();
  let headersList = {
    // "User-Agent": "lyrist", not allowed in the browser
    accept: 'application/json; charset=utf-8',
    Authorization: `OAuth ${token}`,
  };
  let response = await fetch(url, {method: 'GET', headers: headersList});
  if (response.status < 200 || response.status >= 300) {
    throw new Error(response.statusText);
  }
  return await response.json();
}

async function getToken() {
  // use refresh token for an extra hour
  if (tokenFromCache) {
    if (dayjs() < tokenFromCache.expirationDate) {
      return tokenFromCache.value;
    } else {
      setToken(null);
    }
  }
  let headersList = {
    // "User-Agent": "lyrist", not allowed in the browser
    accept: 'application/json; charset=utf-8',
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  let bodyContent = `grant_type=client_credentials&client_id=${
    inDevEnv() ? SOUNDCLOUD_CLIENT_ID_DEV : SOUNDCLOUD_CLIENT_ID
  }&client_secret=${inDevEnv() ? SOUNDCLOUD_CLIENT_SECRET_DEV : SOUNDCLOUD_CLIENT_SECRET}`;

  let response = await fetch('https://api.soundcloud.com/oauth2/token', {
    method: 'POST',
    body: bodyContent,
    headers: headersList,
  });

  let data = await response.json();
  setToken(data.access_token);
  return data.access_token;
}

function setToken(token) {
  tokenFromCache = token ? {value: token, expirationDate: dayjs().add(3540, 'second')} : null;
}

export async function fetchSoundCloudData(query) {
  const url = buildSearchUrlSoundCloud(query);
  const tracks = await fetchResponseFromUrl(url);
  if (!tracks || tracks.length === 0) {
    throw new Error(SONGS_REQUEST_ERROR);
  }
  return tracks.reduce((filteredResults: Audio[], item: SoundCloudTrackResponse) => {
    if (
      item &&
      item.id &&
      item.kind &&
      item.user &&
      item.user.username &&
      item.title &&
      item.created_at &&
      item.playback_count
    ) {
      const [year, time, offset] = item.created_at.split(' ');
      filteredResults.push({
        id: item.id.toString(),
        type: item.kind,
        img_url: item.artwork_url ?? item.user.avatar_url,
        platform: 'soundcloud',
        publisher: item.user.username,
        title: item.title,
        dateUploaded: formatDistanceToNow(new Date(customToISOString(year, time, offset))),
        viewCount: item.playback_count ? abbreviate(item.playback_count) : 0,
        channelThumbnail: item.user.avatar_url,
        url: item.permalink_url,
      });
    }
    return filteredResults;
  }, []);
}

export function buildSearchUrlSoundCloud(query) {
  return `https://api.soundcloud.com/tracks?q=${query}&limit=50`;
}

function customToISOString(date, time, offset) {
  return date.split(/\D/).join('-') + 'T' + time + offset;
}
