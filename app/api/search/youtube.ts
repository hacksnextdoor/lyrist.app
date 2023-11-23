import {formatDistanceToNow} from 'date-fns';
import {decodeHTML} from 'entities';
import {
  ALL_QUOTAS_EXCEEDED_ERROR,
  SOMETHING_WENT_WRONG_ERROR,
  SONGS_REQUEST_ERROR,
} from '../../../packages/constants';
import {
  Audio,
  Schema$ChannelListResponse,
  Schema$SearchListResponse,
  Schema$VideoListResponse,
} from '../../../packages/types';
import {abbreviate, inDevEnv} from '../../../packages/utils';

/**
 * READ THIS BEFORE EDITING
 * This is an algorithm for randomly picking api keys until Google grants quota limits larger than 10000 units per app per day.
 * Searching YouTube once costs ~102 units + getting video ids per search result (1 unit) + getting channel ids per video (1 unit)
 * TOTAL: ~104 units
 * As a result, one app reaches the limit after only ~98 calls within a 24-hour time period.
 * Add any newly generated keys to the array.
 */
export async function fetchYouTubeData(query) {
  const searchUrl = buildSearchUrlYouTube(query);
  const searchResponse = await fetchDataWithRetry(searchUrl);
  const searchListResults: Schema$SearchListResponse = await searchResponse.json();
  if (!searchListResults || !searchListResults.items || searchListResults.items.length === 0) {
    throw new Error(SONGS_REQUEST_ERROR);
  }

  const videoIds = searchListResults.items
    .filter(item => item && item.id && item.id.videoId)
    .map(item => item.id!.videoId)
    .join(',');

  // get videos for engagement statistics
  const videosUrl = buildVideosUrlYouTube(videoIds);
  const videosResponse = await fetchDataWithRetry(videosUrl);
  const videoListResults: Schema$VideoListResponse = await videosResponse.json();
  if (!videoListResults || !videoListResults.items || videoListResults.items.length === 0) {
    throw new Error(SOMETHING_WENT_WRONG_ERROR);
  }

  const channelIds = videoListResults.items
    .filter(item => item && item.snippet && item.snippet.channelId)
    .map(item => item.snippet!.channelId)
    .join(',');

  // get channels for profile pics
  const channelsUrl = buildChannelsUrlYouTube(channelIds);
  const channelsResponse = await fetchDataWithRetry(channelsUrl);
  const channelListResults: Schema$ChannelListResponse = await channelsResponse.json();
  if (!channelListResults || !channelListResults.items || channelListResults.items.length === 0) {
    throw new Error(SOMETHING_WENT_WRONG_ERROR);
  }
  const finalResults = videoListResults.items.map(video => {
    const channel = channelListResults!.items!.find(
      channelToFind => channelToFind.id === video?.snippet?.channelId,
    );
    return {...video, channelThumbnail: channel?.snippet?.thumbnails?.default?.url};
  });

  // convert final results to songs
  return finalResults.reduce((filteredResults: Audio[], item) => {
    if (
      item &&
      item.id &&
      item.kind === 'youtube#video' &&
      item.snippet &&
      item.snippet.thumbnails &&
      item.snippet.thumbnails.default &&
      item.snippet.channelTitle &&
      item.snippet.title &&
      item.snippet.publishedAt &&
      item.statistics
    ) {
      filteredResults.push({
        id: item.id,
        type: item.kind,
        img_url: item.snippet.thumbnails.standard
          ? item.snippet.thumbnails.standard.url!
          : item.snippet.thumbnails.default.url!,
        platform: 'youtube',
        publisher: item.snippet.channelTitle,
        title: decodeHTML(item.snippet.title),
        dateUploaded: formatDistanceToNow(new Date(item.snippet.publishedAt)),
        viewCount:
          item.statistics.viewCount && Number(item.statistics.viewCount) > 0
            ? abbreviate(Number(item.statistics.viewCount))
            : 0,
        channelThumbnail: item.channelThumbnail,
        url: `https://youtube.com/watch?v=${item.id}`,
      });
    }
    return filteredResults;
  }, []);
}

function buildSearchUrlYouTube(query) {
  return `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${query}&maxResults=50`;
}

function buildVideosUrlYouTube(videoIds) {
  return `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoIds}&maxResults=50`;
}

function buildChannelsUrlYouTube(channelIds) {
  return `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelIds}&maxResults=50`;
}

const {
  YOUTUBE_API_KEY_DEV, // this fails every time
  YOUTUBE_API_KEY,
  YOUTUBE_API_KEY2,
  YOUTUBE_API_KEY3,
  YOUTUBE_API_KEY4,
  YOUTUBE_API_KEY5,
} = process.env;

const keys = inDevEnv()
  ? [YOUTUBE_API_KEY2]
  : [YOUTUBE_API_KEY, YOUTUBE_API_KEY2, YOUTUBE_API_KEY3, YOUTUBE_API_KEY4, YOUTUBE_API_KEY5];

async function fetchDataWithRetry(url: string) {
  let retries = 0;
  let fetchedResult: Response | null = null;

  async function tryFetch(apiKeyIndex: number) {
    const apiKey = keys[apiKeyIndex];
    const requestUrl = `${url}&key=${apiKey}`;
    const response = await fetch(requestUrl);
    if (response.ok) {
      return response;
    } else if (response.status === 403) {
      keys.splice(apiKeyIndex, 1);
    }
    return Promise.reject(response);
  }

  while (keys.length > 0) {
    const randomIndex = Math.floor(keys.length * Math.random());

    try {
      fetchedResult = await tryFetch(randomIndex);
      return fetchedResult;
    } catch (error) {
      const err = error;
      // Retry only on 403 errors (unauthorized API key) non-successful responses
      if (err.status !== 403) {
        throw new Error(err.statusText);
      }
    }

    retries++;
    // You can adjust the delay between retries here, e.g., using setTimeout.
    // For simplicity, we're using a constant delay of 1000 milliseconds (1 second).
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  throw new Error(
    inDevEnv()
      ? JSON.stringify({fetchedResult, retries} ?? {}, null, 1)
      : ALL_QUOTAS_EXCEEDED_ERROR,
  );
}
