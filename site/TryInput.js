'use client';
import {useRouter} from 'next/navigation';
import {useState, useEffect, useMemo, memo} from 'react';
import {StyleSheet, View, Pressable} from 'react-native';
import {LyristText} from 'packages/components';
import {FiSearch} from 'react-icons/fi';
import {LYRIST_BLUE} from 'packages/constants';
import {useScale, useHydratedDimensions} from 'packages/hooks/useScale';
import {useLoading} from 'packages/context/LoadingProvider';

const GLOBAL_ARTISTS = [
  'Drake',
  'Kendrick Lamar',
  'J. Cole',
  'Kanye West',
  'Eminem',
  'Taylor Swift',
  'The Weeknd',
  'Ariana Grande',
  'Post Malone',
  'Dua Lipa',
  'Olivia Rodrigo',
  'Harry Styles',
  'Ed Sheeran',
  'Bad Bunny',
  'Doja Cat',
  'Justin Bieber',
  'Billie Eilish',
  'Travis Scott',
  'SZA',
  'Morgan Wallen',
  'Luke Combs',
  'Miley Cyrus',
  'Jack Harlow',
  'Lil Nas X',
  'Rihanna',
  'Bruno Mars',
  'Beyonce',
  'Adele',
  'Lady Gaga',
  'Coldplay',
  'Lil Wayne',
  'Nicki Minaj',
  'Future',
  '21 Savage',
  'Lil Baby',
  'Gunna',
  'Young Thug',
  'Migos',
  'Offset',
  'Quavo',
  'Cardi B',
  'Megan Thee Stallion',
  'Juice WRLD',
  'Pop Smoke',
  'Roddy Ricch',
  'Lil Uzi Vert',
  'Playboi Carti',
  'Tyler The Creator',
  'ASAP Rocky',
  'Metro Boomin',
  '50 Cent',
  'Lil Jon',
  'T.I.',
  'Ludacris',
  'Rick Ross',
  'Wiz Khalifa',
  'Big Sean',
  'Meek Mill',
  '2 Chainz',
  'Gucci Mane',
];

const ALL_ARTISTS = [
  'Polo G',
  'DaBaby',
  'Lil Durk',
  'NBA YoungBoy',
  'Tate McRae',
  'Sabrina Carpenter',
  'Benson Boone',
  'Teddy Swims',
  'Hozier',
  'Noah Kahan',
  'Zach Bryan',
  'Jelly Roll',
  'Bailey Zimmerman',
  'Joji',
  'Khalid',
  'The Kid LAROI',
  '24kGoldn',
  'Lauv',
  'Conan Gray',
  'Shawn Mendes',
  'Charlie Puth',
  'Sam Smith',
  'Lizzo',
  'Ice Spice',
  'Coi Leray',
  'GloRilla',
  'Sexyy Red',
  'Latto',
  'Karol G',
  'Peso Pluma',
  'Feid',
  'Rauw Alejandro',
  'J Balvin',
  'Anitta',
  'Becky G',
  'Bizarrap',
  'Quevedo',
  'Central Cee',
  'Rema',
  'Burna Boy',
  'Tems',
  'Wizkid',
  'Usher',
  'Chris Brown',
  'Bryson Tiller',
  'Summer Walker',
  'Brent Faiyaz',
  '6LACK',
  'H.E.R.',
  'Ella Mai',
  'Kehlani',
  'Victoria Monet',
  'Tyla',
  'Raye',
  'PinkPantheress',
  'NewJeans',
  'Stray Kids',
  'Jung Kook',
  'Jimin',
  'Tomorrow X Together',
  'Childish Gambino',
  'Kid Cudi',
  'Vince Staples',
  'JID',
  'Denzel Curry',
  'Connor Price',
  'Nic D',
  'Trap',
  'Drill',
  'Boom Bap',
  'Lo-Fi',
  'Plugg',
  'Rage',
  'Jersey Club',
  'UK Drill',
  'NY Drill',
  'Afrobeat',
  'Reggaeton',
  'Latin Trap',
  'Hyperpop',
  'Emo Rap',
  'Cloud Rap',
  'Melodic',
  'R&B',
  'Soul',
  'Funk',
  'Jazz Hop',
  'Chill',
  'Ambient',
  'Experimental',
  'Dark',
  'Hard',
  'Soft',
  'Orchestral',
  'Piano',
  'Guitar',
  'Country',
  'Sample',
  '80s',
  '90s',
  '2000s',
  '2010s',
  'Atlanta',
  'Detroit',
  'Chicago',
  'Memphis',
  'Houston',
  'LA',
  'New York',
  'London',
  'Toronto',
  'Miami',
  'Brooklyn',
  'Bronx',
  'Queens',
  'Harlem',
  'South Side',
  'West Coast',
  'East Coast',
  'Down South',
  'Midwest',
  'Bay Area',
  'DMV',
  'Paris',
  'Berlin',
  'Tokyo',
  'Seoul',
  'Lagos',
  'Kingston',
  'Jamaica',
  'Caribbean',
  'Sad',
  'Emotional',
  'Uplifting',
  'Wavy',
  'Smooth',
  'Aggressive',
  'Hype',
];

// Shuffle array using Fisher-Yates algorithm
const shuffleArray = array => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const getRandomSample = (array, count) => {
  return shuffleArray(array).slice(0, count);
};

const MAX_WIDTH = 1400;
const BASE_FONT_SIZE = 81.6;

export const TryInput = memo(function TryInput({showStamp = false}) {
  const {width} = useHydratedDimensions();
  const {small} = useScale();

  const viewportWidth = useMemo(() => width || MAX_WIDTH, [width]);
  const scaledFontSize = useMemo(() => {
    return Math.min(BASE_FONT_SIZE, (viewportWidth / MAX_WIDTH) * BASE_FONT_SIZE);
  }, [viewportWidth]);
  const artists = useMemo(() => {
    const rotation = getRandomSample(ALL_ARTISTS, 40);
    const combined = [...GLOBAL_ARTISTS, ...rotation];
    return shuffleArray(combined);
  }, []);

  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [currentArtistIndex, setCurrentArtistIndex] = useState(0);
  const [caretVisible, setCaretVisible] = useState(true);
  const {showLoading, isLoading} = useLoading();

  useEffect(() => {
    const interval = setInterval(() => {
      setCaretVisible(v => !v);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const i = loopNum % artists.length;
    const fullText = artists[i].toLowerCase();

    // Update current artist index when we start typing a new artist
    if (!isDeleting && text === '') {
      setCurrentArtistIndex(i);
    }

    let timer;

    if (isDeleting) {
      if (text === '') {
        setIsDeleting(false);
        setLoopNum(prev => prev + 1);
      } else {
        timer = setTimeout(() => {
          setText(fullText.substring(0, text.length - 1));
        }, 40);
      }
    } else {
      if (text === fullText) {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 2000);
      } else {
        timer = setTimeout(() => {
          setText(fullText.substring(0, text.length + 1));
        }, 100);
      }
    }

    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, artists]);

  const router = useRouter();

  const handleNavigate = async () => {
    if (isLoading) return; // Prevent double-clicks

    showLoading('Finding type beats...');
    const fullArtist = artists[currentArtistIndex].toLowerCase();
    const query = `${fullArtist} type beats`;

    try {
      const searchPath = `/api/search?${new URLSearchParams({
        q: query,
        plat: 'youtube',
      }).toString()}`;
      const data = await fetch(searchPath, {cache: 'no-store'});
      const json = await data.json();

      window.localStorage.setItem(
        'search',
        JSON.stringify({
          results: json,
          q: query,
          plat: 'youtube',
        }),
      );
    } catch (e) {
      window.localStorage.setItem(
        'search',
        JSON.stringify({
          results: [],
          q: query,
          plat: 'youtube',
        }),
      );
    }

    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <View style={styles.inputWrapper}>
      <Pressable style={styles.inputContainer} onPress={handleNavigate}>
        <FiSearch size={scaledFontSize * 0.5} color="#999" style={{marginRight: 8}} />
        <LyristText style={[styles.inputText, {fontSize: scaledFontSize}]} weight={'Medium'}>
          {text}
          <LyristText
            style={{
              color: LYRIST_BLUE,
              fontSize: scaledFontSize,
              opacity: caretVisible ? 1 : 0,
              marginLeft: scaledFontSize * -0.15,
              position: 'absolute',
            }}>
            |
          </LyristText>{' '}
          type beats
        </LyristText>
        {showStamp && (
          <View style={[styles.stamp, small && styles.stampSmall]}>
            <LyristText style={[styles.stampText, small && styles.stampTextSmall]} weight="Medium">
              try it free
            </LyristText>
          </View>
        )}
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  inputWrapper: {
    justifyContent: 'center',
    position: 'relative',
  },
  inputContainer: {
    backgroundColor: '#F5F5F7',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 2,
    borderColor: '#E5E5EA',
    overflow: 'visible',
    flexDirection: 'row',
    alignItems: 'center',
    willChange: 'contents',
    position: 'relative',
  },
  inputText: {
    textAlign: 'left',
    numberOfLines: 1,
  },
  stamp: {
    position: 'absolute',
    bottom: -10,
    right: 8,
    backgroundColor: LYRIST_BLUE,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  stampSmall: {
    bottom: -8,
    right: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  stampText: {
    color: 'white',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  stampTextSmall: {
    fontSize: 7,
    letterSpacing: 0.3,
  },
});
