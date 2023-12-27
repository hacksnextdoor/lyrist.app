export const AUDIO_PLATFORMS = ['YouTube', 'SoundCloud'];
const AUDIO_PLATFORMS_LOWERCASE = ['youtube', 'soundcloud'] as const;
export type AudioPlatform = (typeof AUDIO_PLATFORMS_LOWERCASE)[number];

export type Audio = {
  platform: AudioPlatform;
  id: string;
  type: string;
  img_url?: string;
  publisher: string;
  title: string;
  dateUploaded?: string;
  viewCount?: number | string;
  channelThumbnail?: string | null;
  url?: string;
};
