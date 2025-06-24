export default async function sitemap() {
  const media = [
    {
      url: 'https://open.spotify.com/track/6UdiHSxkfvXlrRwaZi2qZp',
      lastModified: new Date('06/20/2025').toISOString().slice(0, 10),
    },
  ];

  const routes = [
    '',
    'editor',
    'library',
    'pricing',
    'profile',
    'search',
    'faq',
    'privacy',
    'records',
    'terms',
  ].map(route => ({
    url: `https://lyrist.app/${route}`,
    lastModified: new Date().toISOString().slice(0, 10),
  }));

  return [...routes, ...media];
}
