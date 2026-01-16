import {useRouter} from 'next/navigation';
import {useCallback, useRef, useState} from 'react';
import {Animated, Clipboard, Modal, Pressable, ScrollView, StyleSheet, View} from 'react-native';
import {LyristText, PageItem, PlusButton} from '../components';
import {LYRIST_BLUE, MAX_PAGES} from '../constants';
import {useAuthContext, usePagesContext} from '../context';
import {decrypt} from '../encryption';
import {PageManager} from '../firebase';
import database from '../firebase/firebase-database-web';
import {useScale} from '../hooks/useScale';
import {Page} from '../types';
import {normalize} from '../utils';

type MyLibraryScreenProps = {
  panelMode?: boolean;
  onSelectPage?: (page: Page) => void;
};

export function MyLibraryScreen({panelMode = false, onSelectPage}: MyLibraryScreenProps = {}) {
  const {small} = useScale();
  /* STYLES */

  /* NAVIGATION */
  const router = useRouter();

  /* STATE */
  const [pageToDelete, setPageToDelete] = useState<Page | null>(null);
  const [copiedTitle, setCopiedTitle] = useState<string | null>(null);
  const {hasPlus, user, setOpenAuthModal, setOpenPricingModal} = useAuthContext();
  const {pages, pagesLoading, error} = usePagesContext();
  const pagesLeftBasicUser = Math.max(0, MAX_PAGES - (pages?.length ?? 0));
  const pagesToFilter = pages?.sort((a, b) => (a.dateLastModified > b.dateLastModified ? -1 : 1));

  /* REFS */
  const animatedValues = useRef<Map<string, Animated.Value>>(new Map());
  if (pages) {
    animatedValues.current = new Map(pages.map(page => [page.id!, new Animated.Value(1)]));
  }

  /* EVENTS */
  const handlePressItem = useCallback((item: Page) => {
    // If callback provided (three-panel mode), use it instead of navigating
    if (onSelectPage) {
      onSelectPage(item);
      return;
    }
    // Otherwise navigate to editor
    let searchParamsForNextPage = '';
    let itemForClient: Record<string, string> = {id: item.id!}; // id is always there for library items
    if (item.audio) {
      itemForClient = {
        ...itemForClient,
        source: item.audio.platform,
        ['source-id']: item.audio.id,
      };
    }
    searchParamsForNextPage = `/editor?${new URLSearchParams(itemForClient).toString()}`;
    router.push(searchParamsForNextPage);
  }, [onSelectPage, router]);

  const handleRenderItem = useCallback(
    ({item, index}) => (
      <PageItem
        key={index}
        animatedValue={animatedValues.current?.get(item.id)}
        index={index}
        page={item}
        onDelete={() => setPageToDelete(item)}
        onShare={async () => {
          const itemBody = await database().ref(`pages/${item.id}/body`).once('value');
          const bodyText = itemBody.val() ? decrypt(itemBody.val()) : '';
          const copiedText = `${item.title}\n${bodyText}\nhttps://lyrist.app`;
          // https://webkit.org/blog/10855/async-clipboard-api/
          // The API is limited to secure contexts, which means that navigator.clipboard is not present for http:// websites.
          const shareObj = {title: item.title, text: copiedText};
          if (window.navigator.canShare && window.navigator.canShare(shareObj)) {
            window.navigator.share(shareObj);
            // logFirebaseEvent(LYRICS_SHARED);
          } else {
            Clipboard.setString(copiedText);
            setCopiedTitle(item.title);
            setTimeout(() => {
              setCopiedTitle(null);
            }, 3000);
          }
        }}
        onPressItem={handlePressItem}
      />
    ),
    [handlePressItem],
  );

  /* JSX */
  return (
    <View style={styles.container}>
      <View style={[styles.innerContainer, (panelMode || !small) && {maxWidth: '100%'}]}>
        <View style={styles.header}>
          <LyristText weight={'Medium'}>My Library</LyristText>
          {hasPlus ? null : (
            <>
              {user ? (
                <PlusButton
                  text={`${pagesLeftBasicUser} free page${
                    pagesLeftBasicUser !== 1 ? 's' : ''
                  } left`}
                  onPress={() => setOpenPricingModal(true)}
                  small
                />
              ) : (
                <LyristText onPress={() => setOpenAuthModal(true)}>Sign In</LyristText>
              )}
            </>
          )}
        </View>
        {pagesLoading ? (
          <LyristText style={styles.loadingText}>Getting pages...</LyristText>
        ) : error ? (
          <LyristText>{error.message}</LyristText>
        ) : (
          <ScrollView style={styles.resultsContainer} contentContainerStyle={styles.resultsContent}>
            {pagesToFilter?.length ?? 0 > 0 ? (
              pagesToFilter?.map((item, index) => handleRenderItem({item, index}))
            ) : (
              <LyristText style={styles.emptyText}>
                Use Search to find audio and start typing!
              </LyristText>
            )}
          </ScrollView>
        )}
      </View>
      <Modal animationType="fade" transparent={true} visible={!!pageToDelete}>
        <Pressable
          onPress={() => setPageToDelete(null)}
          style={[
            StyleSheet.absoluteFill,
            {backgroundColor: 'rgba(0,0,0,0.4)'},
            {cursor: 'auto'} as any,
          ]}
        />
        {pageToDelete ? (
          <View
            style={{
              alignItems: 'center',
              backgroundColor: 'white',
              borderRadius: 5,
              justifyContent: 'center',
              margin: 'auto',
              padding: normalize(24),
              maxWidth: 296,
            }}>
            <View style={{gap: 16}}>
              <LyristText weight={'SemiBold'}>Remove item</LyristText>
              <LyristText>{pageToDelete.title} will be removed permanently.</LyristText>
              <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
                <LyristText onPress={() => setPageToDelete(null)}>Cancel</LyristText>
                <LyristText
                  onPress={() => {
                    PageManager.removePage(pageToDelete.id);
                    setPageToDelete(null);
                  }}>
                  OK
                </LyristText>
              </View>
            </View>
          </View>
        ) : null}
      </Modal>
      <Modal animationType="fade" transparent={true} visible={!!copiedTitle}>
        <Pressable
          disabled={true}
          style={[
            StyleSheet.absoluteFill,
            {backgroundColor: 'rgba(0,0,0,0.4)'},
            {cursor: 'auto'} as any,
          ]}
        />
        {copiedTitle ? (
          <View
            style={{
              borderLeftWidth: 5,
              borderLeftColor: LYRIST_BLUE,
              alignItems: 'center',
              backgroundColor: 'white',
              borderRadius: 5,
              justifyContent: 'center',
              margin: 'auto',
              padding: normalize(16),
              maxWidth: 296,
            }}>
            <View style={{gap: 8}}>
              <LyristText weight={'SemiBold'}>You copied text</LyristText>
              <LyristText>Now you can share your content in {copiedTitle}.</LyristText>
            </View>
          </View>
        ) : null}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden',
  },
  innerContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 600,
    gap: 8,
    paddingVertical: normalize(12),
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: normalize(12),
    alignItems: 'center',
  },
  loadingText: {
    paddingHorizontal: normalize(12),
  },
  resultsContainer: {
    flex: 1,
    minHeight: 0,
  },
  resultsContent: {
    paddingBottom: normalize(48),
  },
  emptyText: {
    paddingHorizontal: normalize(12),
  },
});
