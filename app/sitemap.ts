import {MetadataRoute} from 'next';
import {getAllArtistSlugs, getAllReleaseSlugs} from '../packages/records/data';

type ChangeFrequency = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://lyrist.app';

  // Main pages with SEO priority
  const mainRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      changeFrequency: 'weekly' as ChangeFrequency,
      priority: 1,
    },
    {
      url: `${baseUrl}/pricing`,
      changeFrequency: 'monthly' as ChangeFrequency,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/faq`,
      changeFrequency: 'monthly' as ChangeFrequency,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/roadmap`,
      changeFrequency: 'weekly' as ChangeFrequency,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/records`,
      changeFrequency: 'weekly' as ChangeFrequency,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/terms`,
      changeFrequency: 'yearly' as ChangeFrequency,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      changeFrequency: 'yearly' as ChangeFrequency,
      priority: 0.3,
    },
  ];

  // Artist pages
  const artistRoutes: MetadataRoute.Sitemap = getAllArtistSlugs().map(artist => ({
    url: `${baseUrl}/records/${artist}`,
    changeFrequency: 'monthly' as ChangeFrequency,
    priority: 0.6,
  }));

  // Release pages
  const releaseRoutes: MetadataRoute.Sitemap = getAllReleaseSlugs().map(({artist, release}) => ({
    url: `${baseUrl}/records/${artist}/${release}`,
    changeFrequency: 'monthly' as ChangeFrequency,
    priority: 0.5,
  }));

  return [...mainRoutes, ...artistRoutes, ...releaseRoutes];
}
