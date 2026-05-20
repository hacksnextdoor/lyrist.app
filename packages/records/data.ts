export interface Quote {
  pre?: string;
  lines: string[];
}

export interface Release {
  slug: string;
  title: string;
  performanceImage: string;
  spotifyTrackId: string;
  metadata: {
    title: string;
    description: string;
  };
  headline: string;
  intro: string;
  quotes: Quote[];
  outro: string;
}

export interface Artist {
  slug: string;
  name: string;
  site: string;
  location: string;
  bio: string;
  instagram: string;
  image: string;
  releases: Release[];
}

export const artists: Artist[] = [
  {
    slug: 'peyt-spencer',
    name: 'Peyt Spencer',
    site: 'https://peytspencer.com/listen',
    location: 'Bellevue, WA',
    bio: `(peyt rhymes with heat) is a rapper and software engineer from Bellevue, Washington, often praised for his East Coast cadence reminiscent of Jay-Z.

Raised on 2000s hip-hop from Ja Rule and LL Cool J to Ludacris and T.I., he mastered the craft while changing the subject. He's now taking his From The Ground Up tour across North America: part concert, part conversation about his path of growth, applying universal principles for a well-rounded life.

Much of his songwriting is inspired by the Baha'i Faith, the same Faith that guided him on a year of service in Veraguas, Panama, after high school. He lived alongside families in Santiago, teaching virtues to children, animating peer-led groups of early adolescents, facilitating study circles for youth and adults, and tutoring reading and math. During his downtime, he recorded raps on his laptop over mainstream beats. His first performed rap ever was in Spanish, at a community gathering.

After completing his year of service, he attended the University of Florida, where he immersed himself in Gainesville's local scene, handing out mixtape CDs, selling shirts, and performing solo, with a live band, and as a member of both UF's Hip-Hop Collective and the theater troupe Signs of Life.

During his senior year, he became a regular participant in NBA star Damian Lillard's weekly #4BarFriday Instagram rap challenge. After graduation, he landed a software testing job in Gainesville and stayed another year before moving to the West Coast to join Microsoft, where he's spent the last decade as a software engineer. His bars eventually caught the attention of Dame D.O.L.L.A., who reposted his videos and featured him live on the #4BarFriday IG Cypher during Covid. Soon after, he released one last single before stepping away from music to focus on family and his tech career.

Four years later, he returned with the maturity to wear every hat his independence demands. Music and code are his life's work. He founded Lyrist to help other songwriters find beats and beat writer's block, and is the entire team behind his own catalog, tour, merch, and live streams.`,
    instagram: 'peytspencer',
    image: '/peyt-spencer.jpg',
    releases: [
      {
        slug: 'patience',
        title: 'Patience',
        performanceImage: '/right-one-live.jpg',
        spotifyTrackId: '6fLGU3WGrIg7RZSx5bRDaJ',
        metadata: {
          title: 'Peyt Spencer practices "Patience" in his introspective new single',
          description:
            'Peyt Spencer delivers wisdom on discipline, focus, and trusting the process in his latest release.',
        },
        headline: 'Peyt Spencer Practices "Patience" in His Upbeat Single',
        intro:
          'Peyt Spencer puts his phone on airplane mode and encourages himself to stay locked in when no one is watching.',
        quotes: [
          {
            pre: 'He treats his craft with as much care as his newborn:',
            lines: [
              'I strive to get strong mentally',
              "Pray and practice I plan for what's meant to be",
              'Intentions to remain an independent entity',
              'Treat my craft like a baby no registry',
            ],
          },
          {
            pre: 'In the second verse, he lays out the whole system, every part in sync:',
            lines: [
              'Put myself in prime position for greatness',
              'Mind body soul trained on a regular basis',
              'System of a piano player drummer and bassist',
              'No one could ever break this homeostasis',
            ],
          },
        ],
        outro:
          "It's not every day a rap drops words like \"homeostasis\", but when Peyt Spencer's on the mic, be assured you'll hear something you've never heard before. For a record that chooses intention over impulse, stream Patience, available on all platforms.",
      },
      {
        slug: 'safe',
        title: 'Safe',
        performanceImage: '/right-one-live.jpg',
        spotifyTrackId: '5IcsNneXQkOvW1DbuQHzY4',
        metadata: {
          title: 'Peyt Spencer changes pace on "Safe"',
          description: 'Peyt Spencer makes the case for patience in love with his latest single.',
        },
        headline: 'Peyt Spencer Changes Pace on "Safe"',
        intro:
          "Peyt Spencer steps outside his typical sound to bar up an R&B dancehall beat. The Bellevue artist builds a whole song around the idea that love works better when you don't rush it without even saying the word.",
        quotes: [
          {
            pre: 'He centers emotional safety as a strong listener:',
            lines: [
              'Tell me ya story',
              'In all your glory',
              "I promise you won't bore me",
              'The details are obligatory',
            ],
          },
          {
            pre: 'Rather than rushing romance, he gives the relationship room to unfold:',
            lines: [
              "I'm here for ya growth",
              'To listen to ya fears and ya hopes',
              'Where ya parents wanna hear from ya folks',
              'Days would feel like years if you ghost',
            ],
          },
          {
            pre: 'then leans into a rough-edged croon on the chorus:',
            lines: ["You're safe with me"],
          },
        ],
        outro: 'For a calm and intentional take on love, stream Safe, available on all platforms.',
      },
      {
        slug: 'right-one',
        title: 'Right One',
        performanceImage: '/right-one-live.jpg',
        spotifyTrackId: '6UdiHSxkfvXlrRwaZi2qZp',
        metadata: {
          title: 'Peyt Spencer finds the "Right One" in his summer solstice release',
          description: "Peyt Spencer channels Baha'i principles for an anthem about relationships.",
        },
        headline: 'Peyt Spencer Finds The "Right One" in His Summer Solstice Release',
        intro:
          'As a rising talent in both music and tech worlds, Peyt Spencer hits a new high with his latest single, Right One, delivering an anthem celebrating his wife.',
        quotes: [
          {
            pre: 'His lyrics capture the essence of nurturing meaningful relationships, mirroring his own journey of personal growth and exploration:',
            lines: [
              'They say, "truthfulness is the foundation of all human virtues"',
              "I promise I won't lie or do anything to hurt you",
              "Ya presence is a gift I probably don't deserve you",
              "Take you out for dinner I'm never gonna desert you",
            ],
          },
          {
            pre: 'His bars are vulnerable, yet charming. Fresh off his five-year anniversary, Right One doubles as a quiet tribute:',
            lines: [
              'They say, "love lights a flame in the heart that is cold"',
              "All that glimmers don't compare to a heart that is gold",
              'The hardship of heartbreak we both been thru it',
              'My last name same as yours has a ring to it',
            ],
          },
        ],
        outro:
          'For clever wordplay that makes you smile, stream Right One, available on all platforms.',
      },
    ],
  },
];

export function getArtist(slug: string): Artist | undefined {
  return artists.find(a => a.slug === slug);
}

export function getRelease(artistSlug: string, releaseSlug: string): Release | undefined {
  const artist = getArtist(artistSlug);
  return artist?.releases.find(r => r.slug === releaseSlug);
}

export function getAllArtistSlugs(): string[] {
  return artists.map(a => a.slug);
}

export function getAllReleaseSlugs(): {artist: string; release: string}[] {
  return artists.flatMap(a => a.releases.map(r => ({artist: a.slug, release: r.slug})));
}
