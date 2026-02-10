'use client';
import {useRouter} from 'next/navigation';
import {useState, useEffect, useMemo, memo} from 'react';
import {StyleSheet, View, Pressable} from 'react-native';
import {LyristText} from 'packages/components';
import {FiSearch} from 'react-icons/fi';
import {TbPointer} from 'react-icons/tb';
import {LYRIST_BLUE} from 'packages/constants';
import {useScale, useHydratedDimensions} from 'packages/hooks/useScale';
import {useLoading} from 'packages/context/LoadingProvider';

// GLOBAL_ARTISTS: High-frequency rotation (most popular artists across all genres)
// These must exist in mobile's ARTISTS_BY_GENRE for consistency
const GLOBAL_ARTISTS = [
  // Hip-Hop
  '21 Savage',
  'ASAP Rocky',
  'Central Cee',
  'Doja Cat',
  'Drake',
  'Future',
  'Gunna',
  'Ice Spice',
  'J. Cole',
  'Jack Harlow',
  'JID',
  'Kanye West',
  'Kendrick Lamar',
  'Lil Baby',
  'Lil Uzi Vert',
  'Lil Wayne',
  'Megan Thee Stallion',
  'Metro Boomin',
  'Nicki Minaj',
  'Playboi Carti',
  'Travis Scott',
  'Tyler The Creator',
  // R&B
  'Ariana Grande',
  'Beyonce',
  'SZA',
  'The Weeknd',
  'Usher',
  'Chris Brown',
  // Pop
  'Billie Eilish',
  'Dua Lipa',
  'Harry Styles',
  'Justin Bieber',
  'Olivia Rodrigo',
  'Post Malone',
  'Sabrina Carpenter',
  'Taylor Swift',
  // Country
  'Luke Combs',
  'Morgan Wallen',
  'Zach Bryan',
  // Latin
  'Bad Bunny',
  'Karol G',
  'J Balvin',
];

// ALL_ARTISTS: Full rotation - all artists from mobile's genre lists
// These must exist in mobile's ARTISTS_BY_GENRE for consistency
const ALL_ARTISTS = [
  // Hip-Hop additions
  'Baby Keem',
  'Don Toliver',
  'Ken Carson',
  'Yeat',
  // R&B
  '6LACK',
  'Brent Faiyaz',
  'Bryson Tiller',
  'Chloe',
  'Daniel Caesar',
  'Frank Ocean',
  'Giveon',
  'H.E.R.',
  'Jhene Aiko',
  'Kehlani',
  'Khalid',
  'Lucky Daye',
  'Summer Walker',
  'Tinashe',
  'Tyla',
  'Victoria Monet',
  // Pop
  'Benson Boone',
  'Camila Cabello',
  'Chappell Roan',
  'Charlie Puth',
  'Charli XCX',
  'Gracie Abrams',
  'Renee Rapp',
  'Rosalia',
  'Tate McRae',
  'Teddy Swims',
  'Zara Larsson',
  // Rock
  'Arctic Monkeys',
  'Bring Me The Horizon',
  'Coldplay',
  'Fall Out Boy',
  'Foo Fighters',
  'Green Day',
  'Greta Van Fleet',
  'Imagine Dragons',
  'Kings of Leon',
  'Maneskin',
  'Muse',
  'Panic! At The Disco',
  'Paramore',
  'Royal Blood',
  'The 1975',
  'The Black Keys',
  'Twenty One Pilots',
  // Country
  'Bailey Zimmerman',
  'Chris Stapleton',
  'Cody Johnson',
  'Hardy',
  'Jelly Roll',
  'Jordan Davis',
  'Kacey Musgraves',
  'Kane Brown',
  'Lainey Wilson',
  'Megan Moroney',
  'Shaboozey',
  'Tyler Childers',
  // Latin
  'Anitta',
  'Anuel AA',
  'Becky G',
  'Bizarrap',
  'Daddy Yankee',
  'DJ Snake',
  'Feid',
  'Jhayco',
  'Maluma',
  'Mora',
  'Myke Towers',
  'Ozuna',
  'Peso Pluma',
  'Rauw Alejandro',
  'Tainy',
  'Young Miko',
  // Electronic
  'Aphex Twin',
  'Calvin Harris',
  'David Guetta',
  'Deadmau5',
  'Disclosure',
  'Flume',
  'Four Tet',
  'Fred Again',
  'Illenium',
  'James Blake',
  'Kaytranada',
  'Kygo',
  'Madeon',
  'Marshmello',
  'ODESZA',
  'Porter Robinson',
  'Skrillex',
  'Tiesto',
  'Zedd',
  // Indie
  'beabadoobee',
  'Bon Iver',
  'Boygenius',
  'BROCKHAMPTON',
  'Cigarettes After Sex',
  'Clairo',
  'Dominic Fike',
  'Girl in Red',
  'Hozier',
  'Lizzy McAlpine',
  'Mac DeMarco',
  'Mitski',
  'Noah Kahan',
  'Phoebe Bridgers',
  'Remi Wolf',
  'Rex Orange County',
  'Steve Lacy',
  'Tame Impala',
  'The Japanese House',
  'Wallows',
  // Styles (matches mobile's styles genre)
  'Boom Bap',
  'Chill',
  'Dark',
  'Drill',
  'Emotional',
  'Hype',
  'Lo-Fi',
  'Melodic',
  'Sad',
  'Trap',
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
const BASE_FONT_SIZE = 80;

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
  const [isPaused, setIsPaused] = useState(false);
  const [caretVisible, setCaretVisible] = useState(true);
  const [stampVisible, setStampVisible] = useState(true);
  const {showLoading, isLoading} = useLoading();

  // Blinking cursor only when paused (after full text typed)
  useEffect(() => {
    if (!isPaused) {
      setCaretVisible(true);
      return;
    }
    const interval = setInterval(() => {
      setCaretVisible(v => !v);
    }, 500);
    return () => clearInterval(interval);
  }, [isPaused]);

  useEffect(() => {
    if (!showStamp) return;
    const interval = setInterval(() => {
      setStampVisible(v => !v);
    }, 1500);
    return () => clearInterval(interval);
  }, [showStamp]);

  useEffect(() => {
    const i = loopNum % artists.length;
    const fullText = artists[i].toLowerCase();

    // Update current artist index when we start typing a new artist
    if (!isDeleting && text === '') {
      setCurrentArtistIndex(i);
    }

    let timer;

    if (isDeleting) {
      setIsPaused(false);
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
        setIsPaused(true);
        timer = setTimeout(() => {
          setIsPaused(false);
          setIsDeleting(true);
        }, 2000);
      } else {
        setIsPaused(false);
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
      <Pressable
        style={({pressed}) => [
          styles.inputContainer,
          {
            opacity: pressed ? 0.8 : 1,
            transform: pressed ? 'scale(0.995)' : 'scale(1)',
            transition: 'all 0.1s ease',
          },
        ]}
        onPress={handleNavigate}>
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
          <View
            style={[
              styles.stamp,
              small && styles.stampSmall,
              {opacity: stampVisible ? 1 : 0, transition: 'opacity 0.5s ease-in-out'},
            ]}>
            <TbPointer size={small ? 8 : 10} color="white" style={{marginRight: small ? 3 : 4}} />
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
    paddingVertical: 4,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  stampSmall: {
    bottom: -10,
    right: 4,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  stampText: {
    color: 'white',
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  stampTextSmall: {
    fontSize: 8,
    letterSpacing: 0.3,
  },
});
