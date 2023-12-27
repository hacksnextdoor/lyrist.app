export interface DatamuseResponse {
  word?: string;
  score?: number;
  numSyllables?: number;
}

// Based on https://developers.soundcloud.com/docs/api/explorer/open-api#/search/get_tracks

export interface SoundCloudTrackResponse {
  id?: number;
  kind?: string;
  artwork_url?: string;
  user?: {
    username?: string;
    avatar_url?: string;
  };
  stream_url?: string;
  title?: string;
  created_at?: string;
  playback_count?: number;
  permalink_url?: string;
}

// Based on https://github.com/googleapis/google-api-nodejs-client/blob/main/src/apis/youtube/v3.ts

export interface Schema$SearchListResponse {
  /**
   * Etag of this resource.
   */
  etag?: string | null;
  /**
   * Serialized EventId of the request which produced this response.
   */
  eventId?: string | null;
  /**
   * Pagination information for token pagination.
   */
  items?: Schema$SearchResult[];
  /**
   * Identifies what kind of resource this is. Value: the fixed string "youtube#searchListResponse".
   */
  kind?: string | null;
  /**
   * The token that can be used as the value of the pageToken parameter to retrieve the next page in the result set.
   */
  nextPageToken?: string | null;
  /**
   * General pagination information.
   */
  pageInfo?: Schema$PageInfo;
  /**
   * The token that can be used as the value of the pageToken parameter to retrieve the previous page in the result set.
   */
  prevPageToken?: string | null;
  regionCode?: string | null;
  tokenPagination?: Schema$TokenPagination;
  /**
   * The visitorId identifies the visitor.
   */
  visitorId?: string | null;
}

export interface Schema$SearchResult {
  /**
   * Etag of this resource.
   */
  etag?: string | null;
  /**
   * The id object contains information that can be used to uniquely identify the resource that matches the search request.
   */
  id?: Schema$ResourceId;
  /**
   * Identifies what kind of resource this is. Value: the fixed string "youtube#searchResult".
   */
  kind?: string | null;
  /**
   * The snippet object contains basic details about a search result, such as its title or description. For example, if the search result is a video, then the title will be the video's title and the description will be the video's description.
   */
  snippet?: Schema$SearchResultSnippet;
}

export interface Schema$ResourceId {
  /**
   * The ID that YouTube uses to uniquely identify the referred resource, if that resource is a channel. This property is only present if the resourceId.kind value is youtube#channel.
   */
  channelId?: string | null;
  /**
   * The type of the API resource.
   */
  kind?: string | null;
  /**
   * The ID that YouTube uses to uniquely identify the referred resource, if that resource is a playlist. This property is only present if the resourceId.kind value is youtube#playlist.
   */
  playlistId?: string | null;
  /**
   * The ID that YouTube uses to uniquely identify the referred resource, if that resource is a video. This property is only present if the resourceId.kind value is youtube#video.
   */
  videoId?: string | null;
}

export interface Schema$PageInfo {
  /**
   * The number of results included in the API response.
   */
  resultsPerPage?: number | null;
  /**
   * The total number of results in the result set.
   */
  totalResults?: number | null;
}

/**
 * Stub token pagination template to suppress results.
 */
export interface Schema$TokenPagination {}

/**
 * Basic details about a search result, including title, description and thumbnails of the item referenced by the search result.
 */
export interface Schema$SearchResultSnippet {
  /**
   * The value that YouTube uses to uniquely identify the channel that published the resource that the search result identifies.
   */
  channelId?: string | null;
  /**
   * The title of the channel that published the resource that the search result identifies.
   */
  channelTitle?: string | null;
  /**
   * A description of the search result.
   */
  description?: string | null;
  /**
   * It indicates if the resource (video or channel) has upcoming/active live broadcast content. Or it's "none" if there is not any upcoming/active live broadcasts.
   */
  liveBroadcastContent?: string | null;
  /**
   * The creation date and time of the resource that the search result identifies.
   */
  publishedAt?: string | null;
  /**
   * A map of thumbnail images associated with the search result. For each object in the map, the key is the name of the thumbnail image, and the value is an object that contains other information about the thumbnail.
   */
  thumbnails?: Schema$ThumbnailDetails;
  /**
   * The title of the search result.
   */
  title?: string | null;
}

/**
 * Internal representation of thumbnails for a YouTube resource.
 */
export interface Schema$ThumbnailDetails {
  /**
   * The default image for this resource.
   */
  default?: Schema$Thumbnail;
  /**
   * The high quality image for this resource.
   */
  high?: Schema$Thumbnail;
  /**
   * The maximum resolution quality image for this resource.
   */
  maxres?: Schema$Thumbnail;
  /**
   * The medium quality image for this resource.
   */
  medium?: Schema$Thumbnail;
  /**
   * The standard quality image for this resource.
   */
  standard?: Schema$Thumbnail;
}

export interface Schema$Thumbnail {
  /**
   * (Optional) Height of the thumbnail image.
   */
  height?: number | null;
  /**
   * The thumbnail image's URL.
   */
  url?: string | null;
  /**
   * (Optional) Width of the thumbnail image.
   */
  width?: number | null;
}

export interface Schema$VideoListResponse {
  /**
   * Etag of this resource.
   */
  etag?: string | null;
  /**
   * Serialized EventId of the request which produced this response.
   */
  eventId?: string | null;
  items?: Schema$Video[];
  /**
   * Identifies what kind of resource this is. Value: the fixed string "youtube#videoListResponse".
   */
  kind?: string | null;
  /**
   * The token that can be used as the value of the pageToken parameter to retrieve the next page in the result set.
   */
  nextPageToken?: string | null;
  /**
   * General pagination information.
   */
  pageInfo?: Schema$PageInfo;
  /**
   * The token that can be used as the value of the pageToken parameter to retrieve the previous page in the result set.
   */
  prevPageToken?: string | null;
  tokenPagination?: Schema$TokenPagination;
  /**
   * The visitorId identifies the visitor.
   */
  visitorId?: string | null;
}

export interface Schema$Video {
  /**
   * Etag of this resource.
   */
  etag?: string | null;
  /**
   * The ID that YouTube uses to uniquely identify the video.
   */
  id?: string | null;
  /**
   * Identifies what kind of resource this is. Value: the fixed string "youtube#video".
   */
  kind?: string | null;
  /**
   * The localizations object contains localized versions of the basic details about the video, such as its title and description.
   */
  localizations?: {
    [key: string]: Schema$VideoLocalization;
  } | null;
  /**
   * The snippet object contains basic details about the video, such as its title, description, and category.
   */
  snippet?: Schema$VideoSnippet;
  /**
   * The statistics object contains statistics about the video.
   */
  statistics?: Schema$VideoStatistics;
  /**
   * The topicDetails object encapsulates information about Freebase topics associated with the video.
   */
  topicDetails?: Schema$VideoTopicDetails;
}

/**
 * Basic details about a video, including title, description, uploader, thumbnails and category.
 */
export interface Schema$VideoSnippet {
  /**
   * The YouTube video category associated with the video.
   */
  categoryId?: string | null;
  /**
   * The ID that YouTube uses to uniquely identify the channel that the video was uploaded to.
   */
  channelId?: string | null;
  /**
   * Channel title for the channel that the video belongs to.
   */
  channelTitle?: string | null;
  /**
   * The default_audio_language property specifies the language spoken in the video's default audio track.
   */
  defaultAudioLanguage?: string | null;
  /**
   * The language of the videos's default snippet.
   */
  defaultLanguage?: string | null;
  /**
   * The video's description. @mutable youtube.videos.insert youtube.videos.update
   */
  description?: string | null;
  /**
   * Indicates if the video is an upcoming/active live broadcast. Or it's "none" if the video is not an upcoming/active live broadcast.
   */
  liveBroadcastContent?: string | null;
  /**
   * Localized snippet selected with the hl parameter. If no such localization exists, this field is populated with the default snippet. (Read-only)
   */
  localized?: Schema$VideoLocalization;
  /**
   * The date and time when the video was uploaded.
   */
  publishedAt?: string | null;
  /**
   * A list of keyword tags associated with the video. Tags may contain spaces.
   */
  tags?: string[] | null;
  /**
   * A map of thumbnail images associated with the video. For each object in the map, the key is the name of the thumbnail image, and the value is an object that contains other information about the thumbnail.
   */
  thumbnails?: Schema$ThumbnailDetails;
  /**
   * The video's title. @mutable youtube.videos.insert youtube.videos.update
   */
  title?: string | null;
}

/**
 * Localized versions of certain video properties (e.g. title).
 */
export interface Schema$VideoLocalization {
  /**
   * Localized version of the video's description.
   */
  description?: string | null;
  /**
   * Localized version of the video's title.
   */
  title?: string | null;
}

export interface Schema$VideoStatistics {
  /**
   * The number of comments for the video.
   */
  commentCount?: string | null;
  /**
   * The number of users who have indicated that they disliked the video by giving it a negative rating.
   */
  dislikeCount?: string | null;
  /**
   * The number of users who currently have the video marked as a favorite video.
   */
  favoriteCount?: string | null;
  /**
   * The number of users who have indicated that they liked the video by giving it a positive rating.
   */
  likeCount?: string | null;
  /**
   * The number of times the video has been viewed.
   */
  viewCount?: string | null;
}

/**
 * Freebase topic information related to the video.
 */
export interface Schema$VideoTopicDetails {
  /**
   * Similar to topic_id, except that these topics are merely relevant to the video. These are topics that may be mentioned in, or appear in the video. You can retrieve information about each topic using Freebase Topic API.
   */
  relevantTopicIds?: string[] | null;
  /**
   * A list of Wikipedia URLs that provide a high-level description of the video's content.
   */
  topicCategories?: string[] | null;
  /**
   * A list of Freebase topic IDs that are centrally associated with the video. These are topics that are centrally featured in the video, and it can be said that the video is mainly about each of these. You can retrieve information about each topic using the < a href="http://wiki.freebase.com/wiki/Topic_API"\>Freebase Topic API.
   */
  topicIds?: string[] | null;
}

export interface Schema$ChannelListResponse {
  /**
   * Etag of this resource.
   */
  etag?: string | null;
  /**
   * Serialized EventId of the request which produced this response.
   */
  eventId?: string | null;
  items?: Schema$Channel[];
  /**
   * Identifies what kind of resource this is. Value: the fixed string "youtube#channelListResponse".
   */
  kind?: string | null;
  /**
   * The token that can be used as the value of the pageToken parameter to retrieve the next page in the result set.
   */
  nextPageToken?: string | null;
  /**
   * General pagination information.
   */
  pageInfo?: Schema$PageInfo;
  /**
   * The token that can be used as the value of the pageToken parameter to retrieve the previous page in the result set.
   */
  prevPageToken?: string | null;
  tokenPagination?: Schema$TokenPagination;
  /**
   * The visitorId identifies the visitor.
   */
  visitorId?: string | null;
}

/**
 * A *channel* resource contains information about a YouTube channel.
 */
export interface Schema$Channel {
  /**
   * Etag of this resource.
   */
  etag?: string | null;
  /**
   * The ID that YouTube uses to uniquely identify the channel.
   */
  id?: string | null;
  /**
   * Identifies what kind of resource this is. Value: the fixed string "youtube#channel".
   */
  kind?: string | null;
  /**
   * Localizations for different languages
   */
  localizations?: {
    [key: string]: Schema$ChannelLocalization;
  } | null;
  /**
   * The snippet object contains basic details about the channel, such as its title, description, and thumbnail images.
   */
  snippet?: Schema$ChannelSnippet;
}

/**
 * Basic details about a channel, including title, description and thumbnails.
 */
export interface Schema$ChannelSnippet {
  /**
   * The country of the channel.
   */
  country?: string | null;
  /**
   * The custom url of the channel.
   */
  customUrl?: string | null;
  /**
   * The language of the channel's default title and description.
   */
  defaultLanguage?: string | null;
  /**
   * The description of the channel.
   */
  description?: string | null;
  /**
   * Localized title and description, read-only.
   */
  localized?: Schema$ChannelLocalization;
  /**
   * The date and time that the channel was created.
   */
  publishedAt?: string | null;
  /**
   * A map of thumbnail images associated with the channel. For each object in the map, the key is the name of the thumbnail image, and the value is an object that contains other information about the thumbnail. When displaying thumbnails in your application, make sure that your code uses the image URLs exactly as they are returned in API responses. For example, your application should not use the http domain instead of the https domain in a URL returned in an API response. Beginning in July 2018, channel thumbnail URLs will only be available in the https domain, which is how the URLs appear in API responses. After that time, you might see broken images in your application if it tries to load YouTube images from the http domain. Thumbnail images might be empty for newly created channels and might take up to one day to populate.
   */
  thumbnails?: Schema$ThumbnailDetails;
  /**
   * The channel's title.
   */
  title?: string | null;
}

/**
 * Channel localization setting
 */
export interface Schema$ChannelLocalization {
  /**
   * The localized strings for channel's description.
   */
  description?: string | null;
  /**
   * The localized strings for channel's title.
   */
  title?: string | null;
}
