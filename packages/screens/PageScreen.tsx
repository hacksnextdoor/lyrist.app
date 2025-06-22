import {useRouter} from 'next/navigation';
import {useQueryState} from 'next-usequerystate';
import {useState, useRef, useEffect} from 'react';
import {Modal, Pressable, StyleSheet, TextInput, View} from 'react-native';
import ReactPlayer from 'react-player';
import {useDebouncedCallback} from 'use-debounce';
import {Editor, LyristText} from '../components';
import {
  LYRICS_PAGE_ENTERED,
  LYRICS_PAGE_EXITED,
  LYRIST_BLUE,
  MAX_PAGES,
  TURQUOISE,
} from '../constants';
import {useAuthContext, usePagesContext} from '../context';
import {decrypt} from '../encryption';
import {logFirebaseEvent, PageManager} from '../firebase';
import database, {generateId} from '../firebase/firebase-database-web';
import {Audio, AudioPlatform} from '../types';
import {inDevEnv, normalize} from '../utils';

function getUrl(platform: AudioPlatform, audioId: string) {
  return platform === 'soundcloud'
    ? `https://api.soundcloud.com/tracks/${audioId}`
    : `https://youtube.com/watch?v=${audioId}`;
}

export function PageScreen() {
  /* STYLES */

  /* NAVIGATION */
  const router = useRouter();

  /* STATE */
  // should be populated when pageId does not exist
  const [audioStr, setAudio] = useQueryState('audio');

  // should be populated when there is already a page
  const [pageId, setId] = useQueryState('id');
  const [source, setSource] = useQueryState('source');
  const [sourceId, setSourceId] = useQueryState('source-id');

  let url: string | null = null;
  let audio: Audio | null = null;

  if (source && sourceId) {
    url = getUrl(source as AudioPlatform, sourceId);
  }

  if (audioStr) {
    audio = JSON.parse(audioStr);
    if (audio) {
      url = getUrl(audio.platform, audio.id);
    }
  }

  const [playerLoading, setPlayerLoading] = useState(true);
  const [message, setMessage] = useState('player status');
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);

  const [body, setBody] = useState('');
  const [editorMessage, setEditorMessage] = useState('editor status');
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [editorLoading, setEditorLoading] = useState(true);
  const {hasPlus, user, userLoading, setOpenAuthModal} = useAuthContext();
  const {findPageFromPageId, pages, pagesLoading} = usePagesContext();
  const pagesLeftFreeTier = Math.max(0, 3 - (pages?.length ?? 0));

  /* REFS */
  const playerRef = useRef<ReactPlayer>(null);
  const editorRef = useRef<TextInput>(null);
  const lockEditor = useRef<boolean | null>(null);

  /**
   * hacky way of handling the following cases
   * - coming from search screen (pages have loaded already)
   * - coming from library screen (pages have loaded already)
   * - entering page for the first time (pages loading)
   *    could have pageId (exist in library)
   *    or not have pageId (search)
   *
   */
  let isInFreeSet = false;
  if (lockEditor.current == null && pages) {
    if (audioStr) {
      lockEditor.current = pages.length >= MAX_PAGES && !hasPlus;
    }
    if (pageId) {
      isInFreeSet = pages
        .sort((a, b) => (a.dateLastModified > b.dateLastModified ? -1 : 1))
        .slice(0, Math.min(MAX_PAGES, pages.length))
        .some(page => page.id === pageId);
      lockEditor.current = !hasPlus && !isInFreeSet;
    }
  }

  /* EVENTS */
  const handlePlay = () => {
    setPlaying(true);
  };

  const handlePause = () => {
    setPlaying(false);
  };

  const OPERATION_DELAY = 3000; // weird stuff in the browser like touching the url cancels this method
  const handleChangeTextDebounced = useDebouncedCallback(async text => {
    if (pageId && text.length === 0) {
      const currentPage = findPageFromPageId(pageId)!; // page should always exist in list of pages
      const {audio} = currentPage;
      await PageManager.removePage(pageId);
      setEditorMessage('UNSAVED');
      setId(null);
      if (audio) {
        setAudio(JSON.stringify(audio));
        setSource(null);
        setSourceId(null);
      }
      return;
    }
    if (!pageId) {
      const newId = generateId();
      await PageManager.createPage(newId, audio, '', text);
      setEditorMessage('CREATED');
      setId(newId);
      if (audio) {
        setAudio(null);
        setSource(audio.platform);
        setSourceId(audio.id);
      }
      return;
    }
    await PageManager.updatePage(pageId, text);
    setEditorMessage('UPDATED');
  }, OPERATION_DELAY);

  const [mobile, setMobile] = useState(false);

  /* EFFECTS */
  useEffect(() => {
    const isMobile = () => {
      // Use a regular expression to identify common mobile user agents
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      return mobileRegex.test(window.navigator.userAgent);
    };
    // Update the 'mobile' state when the window is resized
    const handleResize = () => {
      setMobile(isMobile());
    };

    window.addEventListener('resize', handleResize);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    logFirebaseEvent(LYRICS_PAGE_ENTERED);
    return () => {
      handleChangeTextDebounced.flush();
      // setCurrentPage(null);
      // dispatchClearCurrentPage();
      logFirebaseEvent(LYRICS_PAGE_EXITED);
    };
  }, []); // [dispatchClearCurrentPage, dispatchSetCurrentPage, handleChangeTextDebounced, initialPage]);

  useEffect(() => {
    if (!user) {
      // seems like an anti-pattern to have to listen for user changes here
      setEditorMessage('user has not synced');
      setEditorLoading(false);
      return;
    }

    let ref = database().ref(`pages/${pageId}/body`);

    const onValue = snapshot => {
      if (snapshot && snapshot.val()) {
        // Visual state: SAVED
        setBody(decrypt(snapshot.val()));
      } else {
        // Visual state: DISCARDED
        setBody('');
      }
      if (editorLoading) {
        setEditorLoading(false);
      }
      setEditorMessage('synced body with database');
    };

    const onError = (a: Error) => {
      setEditorMessage(a.message);
      if (editorLoading) {
        setEditorLoading(false);
      }
    };

    ref.on('value', onValue, onError);

    return () => {
      ref.off('value', onValue);
    };
  }, [editorLoading, user]);

  useEffect(() => {
    if (playerLoading) {
      // gets triggered on an embed_not_loaded error
      setPlayerLoading(false);
    }
  }, [playerLoading]);

  /* JSX */
  return (
    <View style={{alignItems: 'center'}}>
      <View style={{width: 405, maxWidth: 405, height: 720, maxHeight: 720}}>
        {pagesLoading ? (
          <LyristText>Loading...</LyristText>
        ) : (
          !lockEditor.current && (
            <LyristText
              onPress={() => router.push('/pricing')}
              style={{paddingVertical: normalize(12), textAlign: 'center'}}>
              You have {pagesLeftFreeTier} free page{pagesLeftFreeTier !== 1 && 's'} left. Get{' '}
              <LyristText style={{color: TURQUOISE}} weight={'Medium'}>
                Lyrist Plus
              </LyristText>{' '}
              for more!
            </LyristText>
          )
        )}
        {inDevEnv() && (
          <>
            <LyristText>player: {message}</LyristText>
            <LyristText>editor: {editorMessage}</LyristText>
          </>
        )}
        {playerLoading ? (
          <LyristText>Loading player</LyristText>
        ) : url ? (
          <View style={{aspectRatio: 16 / 9}}>
            {/* https://stackoverflow.com/questions/51969269/embedded-youtube-video-doesnt-work-on-local-server */}
            <ReactPlayer
              url={url}
              width="100%"
              height="100%"
              playing={playing}
              volume={1.0}
              muted={muted}
              ref={playerRef}
              style={{backgroundColor: 'rgba(0,0,0,0.1)'}}
              controls={true}
              loop={true}
              onPlay={handlePlay}
              onPause={handlePause}
              onStart={() => !mobile && setMuted(false)}
              onReady={() => setMessage('ready')}
              onBuffer={() => setMessage('buffering')}
              onBufferEnd={() => setMessage('buffering finished')}
              onEnded={() => setMessage('ended')}
              onError={err => setMessage(JSON.stringify(err))}
            />
          </View>
        ) : null}
        {editorLoading || pagesLoading || userLoading ? (
          <LyristText>Loading...</LyristText>
        ) : lockEditor.current ? (
          <LyristText
            onPress={() => router.push('/pricing')}
            style={{
              backgroundColor: TURQUOISE,
              borderBottomLeftRadius: 4,
              borderBottomRightRadius: 4,
              color: 'white',
              paddingVertical: normalize(12),
              textAlign: 'center',
            }}>
            Get Lyrist Plus
          </LyristText>
        ) : user == null ? (
          <LyristText
            onPress={() => setOpenAuthModal(true)}
            style={{
              backgroundColor: LYRIST_BLUE,
              borderBottomLeftRadius: 4,
              borderBottomRightRadius: 4,
              color: 'white',
              paddingVertical: normalize(12),
              textAlign: 'center',
            }}>
            Sign in to use the editor
          </LyristText>
        ) : (
          <Editor
            color={'black'}
            inputAccessoryViewID={'PageScreen'}
            onChangeText={(text: string) => {
              setEditorMessage('TYPING');
              if (!lockEditor.current && !hasPlus && text.length > 10000) {
                editorRef.current?.blur();
                setShowSizeModal(true);
                return;
              }
              handleChangeTextDebounced(text);
            }}
            placeholder={'Start typing here...'}
            ref={editorRef}
            text={body}
          />
        )}
      </View>
      <Modal animationType="fade" transparent={true} visible={!!showSizeModal}>
        <Pressable
          onPress={() => setShowSizeModal(false)}
          style={[
            StyleSheet.absoluteFill,
            {backgroundColor: 'rgba(0,0,0,0.4)'},
            {cursor: 'auto'} as any,
          ]}
        />
        {showSizeModal ? (
          <View
            style={{
              alignItems: 'center',
              backgroundColor: 'white',
              borderRadius: 5,
              borderLeftWidth: 5,
              borderLeftColor: LYRIST_BLUE,
              justifyContent: 'center',
              margin: 'auto',
              padding: normalize(24),
              maxWidth: 296,
            }}>
            <View style={{gap: 16}}>
              <LyristText weight={'SemiBold'}>Character limit exceeded</LyristText>
              <LyristText>With a Plus subscription you can save unlimited pages!</LyristText>
              <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                <LyristText onPress={() => setShowSizeModal(false)}>No thanks</LyristText>
                <LyristText
                  onPress={() => {
                    setShowSizeModal(false);
                    router.push('/pricing');
                  }}>
                  Get Lyrist Plus
                </LyristText>
              </View>
            </View>
          </View>
        ) : null}
      </Modal>
    </View>
  );
}
