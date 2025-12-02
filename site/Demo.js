'use client';
import {useState, useEffect, useCallback, useMemo} from 'react';
import {View, TextInput, Pressable, StyleSheet, Platform, ActivityIndicator} from 'react-native';
import ReactPlayer from 'react-player/youtube';
import {LyristText} from 'packages/components/LyristText';
import {LYRIST_BLUE, TURQUOISE, CREAM_BACKGROUND} from 'packages/constants';
import {useScale} from 'packages/hooks/useScale';
import {FiRefreshCw} from 'react-icons/fi';
import {FaPlay, FaPause} from 'react-icons/fa';

const DEMO_STORAGE_KEY = 'lyrist_demo';
const GENRES = ['Drake', 'Trap', 'Lo-Fi', 'R&B', 'Pop'];

// ============================================================
// OPTION A: Keyword filter (filters live API results)
// ============================================================
const BLOCKED_KEYWORDS = [
  // Alcohol
  'drink',
  'drunk',
  'liquor',
  'vodka',
  'hennessy',
  'whiskey',
  'beer',
  'wine',
  'champagne',
  'alcohol',
  'sippin',
  'pour up',
  'bottles',
  'shot',
  // Drugs
  'drug',
  'smoke',
  'weed',
  'high',
  'cocaine',
  'molly',
  'lean',
  'percocet',
  'xan',
  'pill',
  'blunt',
  '420',
  'dope',
  'crack',
  'heroin',
  'oxy',
  // Sexual
  'sex',
  'freaky',
  'strip',
  'thot',
  'onlyfans',
  'nsfw',
  'explicit',
  'xxx',
  'pussy',
  'ass',
  'twerk',
  'horny',
  'naked',
  'nude',
  // Violence
  'kill',
  'murder',
  'gun',
  'shoot',
  'blood',
  'gang',
  'dead',
  'die',
];

function isContentSafe(title, publisher) {
  const combined = `${title} ${publisher}`.toLowerCase();
  return !BLOCKED_KEYWORDS.some(keyword => combined.includes(keyword));
}

function findSafeBeat(results) {
  for (const beat of results) {
    if (isContentSafe(beat.title, beat.publisher)) {
      return beat;
    }
  }
  return null;
}

// ============================================================
// OPTION B: Curated whitelist (no API calls, 100% safe)
// ============================================================
const CURATED_BEATS = {
  Drake: [
    {
      id: 'dQw4w9WgXcQ',
      title: 'Drake Type Beat - "Emotions"',
      publisher: 'Prod. By Demo',
      url: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
    },
    {
      id: 'abc123',
      title: 'Drake Type Beat - "Late Night"',
      publisher: 'Chill Beats',
      url: 'https://youtube.com/watch?v=abc123',
    },
  ],
  Trap: [
    {
      id: 'trap001',
      title: 'Hard Trap Beat - "Victory"',
      publisher: 'Beat Lab',
      url: 'https://youtube.com/watch?v=trap001',
    },
    {
      id: 'trap002',
      title: 'Dark Trap Instrumental',
      publisher: 'Studio Vibes',
      url: 'https://youtube.com/watch?v=trap002',
    },
  ],
  'Lo-Fi': [
    {
      id: 'lofi001',
      title: 'Lo-Fi Chill Beat - "Peaceful"',
      publisher: 'Lofi Records',
      url: 'https://youtube.com/watch?v=lofi001',
    },
    {
      id: 'lofi002',
      title: 'Study Beats - Relaxing',
      publisher: 'Calm Collective',
      url: 'https://youtube.com/watch?v=lofi002',
    },
  ],
  'R&B': [
    {
      id: 'rnb001',
      title: 'Smooth R&B Type Beat',
      publisher: 'Soul Productions',
      url: 'https://youtube.com/watch?v=rnb001',
    },
    {
      id: 'rnb002',
      title: 'R&B Instrumental - "Feelings"',
      publisher: 'Vibe Studio',
      url: 'https://youtube.com/watch?v=rnb002',
    },
  ],
  Pop: [
    {
      id: 'pop001',
      title: 'Pop Type Beat - "Sunrise"',
      publisher: 'Pop Productions',
      url: 'https://youtube.com/watch?v=pop001',
    },
    {
      id: 'pop002',
      title: 'Upbeat Pop Instrumental',
      publisher: 'Bright Sounds',
      url: 'https://youtube.com/watch?v=pop002',
    },
  ],
};

function getRandomCuratedBeat(genre) {
  const beats = CURATED_BEATS[genre] || [];
  if (beats.length === 0) return null;
  return beats[Math.floor(Math.random() * beats.length)];
}

// ============================================================
// Toggle which approach to use:
// Set to 'filter' for Option A (live API + keyword filter)
// Set to 'curated' for Option B (pre-approved whitelist)
// ============================================================
const CONTENT_MODE = 'filter';

function getStoredDemo() {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(DEMO_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function storeDemo(data) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

export function Demo() {
  const {small, medium, large} = useScale();
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [video, setVideo] = useState(null);
  const [lyrics, setLyrics] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [hovered, setHovered] = useState(null);

  // Restore from localStorage on mount
  useEffect(() => {
    const stored = getStoredDemo();
    if (stored && stored.video && stored.video.url) {
      setSelectedGenre(stored.genre);
      setVideo(stored.video);
      setLyrics(stored.lyrics || '');
      setHasSearched(true);
      // Don't auto-play on restore to avoid issues
      setPlaying(false);
    }
  }, []);

  // Persist lyrics changes - only save when user actually types
  const handleLyricsChange = useCallback(
    text => {
      setLyrics(text);
      // Only save to localStorage if there's actual content
      if (text.trim().length > 0 && video) {
        storeDemo({genre: selectedGenre, video, lyrics: text});
      }
    },
    [video, selectedGenre],
  );

  const searchBeat = useCallback(async genre => {
    setLoading(true);
    setError(null);
    setSelectedGenre(genre);
    setHasSearched(true);

    try {
      let beat;

      if (CONTENT_MODE === 'curated') {
        // OPTION B: Use curated whitelist
        beat = getRandomCuratedBeat(genre);
        if (!beat) {
          throw new Error('No beats available for this genre');
        }
      } else {
        // OPTION A: Live API with keyword filter
        const query = `${genre.toLowerCase()} type beat`;
        const res = await fetch(
          `/api/search?${new URLSearchParams({q: query, plat: 'youtube'}).toString()}`,
          {cache: 'no-store'},
        );
        const results = await res.json();

        if (!results || results.length === 0) {
          throw new Error('No beats found');
        }

        // Find first safe result
        beat = findSafeBeat(results);
        if (!beat) {
          throw new Error('No suitable beats found. Try another genre!');
        }
      }

      const videoData = {
        id: beat.id,
        title: beat.title,
        publisher: beat.publisher,
        url: beat.url,
        img_url: beat.img_url,
      };

      setVideo(videoData);
      setPlaying(true);
      setLyrics('');
    } catch (e) {
      setError(e.message || 'Failed to find beats');
      setVideo(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRefresh = useCallback(() => {
    if (selectedGenre) {
      searchBeat(selectedGenre);
    }
  }, [selectedGenre, searchBeat]);

  const scrollToPricing = useCallback(() => {
    const el = document.getElementById('pricing');
    if (el) {
      el.scrollIntoView({behavior: 'smooth', block: 'start'});
    }
  }, []);

  const containerPadding = useMemo(() => (small ? 16 : 24), [small]);
  const editorHeight = useMemo(() => (small ? 200 : 280), [small]);

  return (
    <View style={styles.wrapper}>
      {/* Header */}
      <View style={styles.header}>
        <LyristText style={styles.headerTitle} weight="Medium">
          Try it now
        </LyristText>
        <LyristText style={styles.headerSubtitle}>
          Pick a vibe, listen, and start writing
        </LyristText>
      </View>

      {/* Genre Pills */}
      <View style={[styles.genreRow, small && styles.genreRowSmall]}>
        {GENRES.map(genre => {
          const isSelected = selectedGenre === genre;
          const isHovered = hovered === genre;
          return (
            <Pressable
              key={genre}
              onPress={() => searchBeat(genre)}
              onHoverIn={() => setHovered(genre)}
              onHoverOut={() => setHovered(null)}
              disabled={loading}
              style={[
                styles.genrePill,
                isSelected && styles.genrePillSelected,
                isHovered && !isSelected && styles.genrePillHovered,
                loading && styles.genrePillDisabled,
              ]}>
              <LyristText
                style={[styles.genreText, isSelected && styles.genreTextSelected]}
                weight={isSelected ? 'Medium' : 'Regular'}>
                {genre}
              </LyristText>
            </Pressable>
          );
        })}
      </View>

      {/* Main Content */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={LYRIST_BLUE} />
          <LyristText style={styles.loadingText}>Finding the perfect beat...</LyristText>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <LyristText style={styles.errorText}>{error}</LyristText>
          <Pressable onPress={handleRefresh} style={styles.retryButton}>
            <LyristText style={styles.retryButtonText} weight="Medium">
              Try Again
            </LyristText>
          </Pressable>
        </View>
      ) : video ? (
        <View style={[styles.demoContainer, {padding: containerPadding}]}>
          <View style={[styles.contentRow, !large && styles.contentRowStacked]}>
            {/* Player Section */}
            <View style={[styles.playerSection, !large && {width: '100%'}]}>
              <View style={styles.playerWrapper}>
                <View style={styles.playerInner}>
                  <ReactPlayer
                    key={video.id}
                    url={video.url}
                    playing={playing}
                    controls={false}
                    width="100%"
                    height="100%"
                    onPlay={() => setPlaying(true)}
                    onPause={() => setPlaying(false)}
                    onReady={() => console.log('Player ready')}
                    onError={e => console.log('Player error:', e)}
                    config={{
                      youtube: {
                        playerVars: {
                          modestbranding: 1,
                          rel: 0,
                          origin: typeof window !== 'undefined' ? window.location.origin : '',
                        },
                      },
                    }}
                  />
                </View>
              </View>
              <View style={styles.playerControls}>
                <View style={styles.videoInfo}>
                  <LyristText style={styles.videoTitle} numberOfLines={1} weight="Medium">
                    {video.title}
                  </LyristText>
                  <LyristText style={styles.videoPublisher} numberOfLines={1}>
                    {video.publisher}
                  </LyristText>
                </View>
                <View style={styles.controlButtons}>
                  <Pressable onPress={() => setPlaying(!playing)} style={styles.controlButton}>
                    {playing ? (
                      <FaPause size={16} color="#333" />
                    ) : (
                      <FaPlay size={16} color="#333" />
                    )}
                  </Pressable>
                  <Pressable onPress={handleRefresh} style={styles.controlButton}>
                    <FiRefreshCw size={16} color="#333" />
                  </Pressable>
                </View>
              </View>
            </View>

            {/* Editor Section */}
            <View style={[styles.editorSection, !large && {width: '100%'}]}>
              <TextInput
                value={lyrics}
                onChangeText={handleLyricsChange}
                placeholder="Start writing your lyrics..."
                placeholderTextColor="#999"
                multiline
                style={[
                  styles.editor,
                  {minHeight: editorHeight},
                  Platform.OS === 'web' && {outline: 'none'},
                ]}
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* CTA */}
          <View style={styles.ctaContainer}>
            <LyristText style={styles.ctaHint}>
              Love it? Get unlimited pages, AI suggestions, and more.
            </LyristText>
            <Pressable
              onPress={scrollToPricing}
              onHoverIn={() => setHovered('cta')}
              onHoverOut={() => setHovered(null)}
              style={[styles.ctaButton, hovered === 'cta' && styles.ctaButtonHovered]}>
              <LyristText style={styles.ctaButtonText} weight="Medium">
                Get Plus
              </LyristText>
            </Pressable>
          </View>
        </View>
      ) : hasSearched ? null : (
        <View style={styles.emptyState}>
          <LyristText style={styles.emptyStateText}>
            👆 Pick a style above to get started
          </LyristText>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    gap: 24,
  },
  header: {
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 32,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  genreRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  genreRowSmall: {
    gap: 8,
  },
  genrePill: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: '#F5F5F7',
    borderWidth: 2,
    borderColor: '#E5E5EA',
    transition: 'all 0.2s ease',
  },
  genrePillSelected: {
    backgroundColor: LYRIST_BLUE,
    borderColor: LYRIST_BLUE,
  },
  genrePillHovered: {
    borderColor: LYRIST_BLUE,
    transform: [{scale: 1.02}],
  },
  genrePillDisabled: {
    opacity: 0.5,
  },
  genreText: {
    fontSize: 16,
    color: '#333',
  },
  genreTextSelected: {
    color: 'white',
  },
  loadingContainer: {
    padding: 48,
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    padding: 48,
    alignItems: 'center',
    gap: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: LYRIST_BLUE,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
  },
  demoContainer: {
    backgroundColor: 'white',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
    gap: 20,
  },
  contentRow: {
    flexDirection: 'row',
    gap: 20,
  },
  contentRowStacked: {
    flexDirection: 'column',
  },
  playerSection: {
    flex: 1,
    gap: 12,
  },
  playerWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#000',
    position: 'relative',
    width: '100%',
    aspectRatio: 16 / 9,
  },
  playerInner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  playerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  videoInfo: {
    flex: 1,
    gap: 2,
  },
  videoTitle: {
    fontSize: 14,
    color: '#333',
  },
  videoPublisher: {
    fontSize: 12,
    color: '#999',
  },
  controlButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  controlButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F5F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editorSection: {
    flex: 1,
  },
  editor: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Fira Sans',
    lineHeight: 24,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  ctaContainer: {
    alignItems: 'center',
    gap: 12,
    paddingTop: 8,
  },
  ctaHint: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  ctaButton: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    backgroundColor: TURQUOISE,
    borderRadius: 999,
    transition: 'transform 0.2s ease',
  },
  ctaButtonHovered: {
    transform: [{scale: 1.05}],
  },
  ctaButtonText: {
    color: 'white',
    fontSize: 18,
  },
  emptyState: {
    padding: 48,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 18,
    color: '#999',
  },
});
