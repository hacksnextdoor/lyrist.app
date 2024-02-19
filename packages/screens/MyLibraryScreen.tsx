import {useRouter} from 'next/navigation';
import {useCallback, useRef, useState} from 'react';
import {Animated, Button, Clipboard, Modal, Pressable, StyleSheet, View} from 'react-native';
import {LyristText, PageItem} from '../components';
import {LYRIST_BLUE, MAX_PAGES} from '../constants';
import {useAuthContext, usePagesContext} from '../context';
import {decrypt} from '../encryption';
import {PageManager} from '../firebase';
import database from '../firebase/firebase-database-web';
import {Page} from '../types';
import {normalize} from '../utils';

export function MyLibraryScreen() {
  /* STYLES */

  /* NAVIGATION */
  const router = useRouter();

  /* STATE */
  const [pageToDelete, setPageToDelete] = useState<Page | null>(null);
  const [pageToDownload, setPageToDownload] = useState<Page | null>(null);
  const [copiedTitle, setCopiedTitle] = useState<string | null>(null);
  const {hasPlus, user, setOpenAuthModal} = useAuthContext();
  const {pages, pagesLoading, error} = usePagesContext();
  const pagesLeftBasicUser = Math.max(0, MAX_PAGES - (pages?.length ?? 0));
  const pagesToFilter = pages?.sort((a, b) => (a.dateLastModified > b.dateLastModified ? -1 : 1));

  /* REFS */
  const animatedValues = useRef<Map<string, Animated.Value>>();
  if (pages) {
    animatedValues.current = new Map(pages.map(page => [page.id!, new Animated.Value(1)]));
  }

  /* EVENTS */
  const handlePressItem = useCallback((item: Page) => {
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
  }, []);

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
          const copiedText = `${item.title}\n${decrypt(itemBody.val())}\nhttps://lyrist.app`;
          // https://webkit.org/blog/10855/async-clipboard-api/
          // The API is limited to secure contexts, which means that navigator.clipboard is not present for http:// websites.
          const shareObj = {title: item.title, text: copiedText};
          if (window.navigator.canShare && window.navigator.canShare(shareObj)) {
            window.navigator.share(shareObj);
            // logFirebaseEvent(LYRICS_SHARED);
          } else {
            copyToClipboard(copiedText);
            setCopiedTitle(item.title);
            setTimeout(() => {
              setCopiedTitle(null);
            }, 3000);
          }
        }}
        onSave={async () => 
          {
            try {
                  //const itemBody = await fetch(`api/pages/${item.id}/body`);
                  const itemBody = database().ref(`pages/${item.id}/body`).once('value');
                   if (!itemBody) {
                    throw new Error('Failed to fetch data');
                  } 
                  const bodyText = await (await itemBody).val();
                  const copiedText = `${item.title}\n${decrypt(bodyText)}\nhttps://lyrist.app`;

                  // Create a Blob from the text
                  const blob = new Blob([copiedText], { type: 'text/plain' });

                  // Create a temporary URL for the Blob
                  const url = URL.createObjectURL(blob);

                  // Create an anchor element
                  const anchor = document.createElement('a');
                  anchor.href = url;
                  anchor.download = `${item.title}.txt`; // Set the filename

                  // Simulate a click on the anchor element to trigger the download
                  document.body.appendChild(anchor);
                  anchor.click();

                  // Clean up
                  URL.revokeObjectURL(url);
                  document.body.removeChild(anchor);
                } catch (error) {
                  console.error('Error saving text:', error);
                }
          }
                          
        }
        onPressItem={handlePressItem}
      />
       /* New button for downloading text */
      
  ),  
    [handlePressItem],
  );

  /* JSX */
  return (
    <View style={{flex: 1, gap: 8, paddingVertical: normalize(12)}}>
      <View style={{flexDirection: 'row', gap: 8, paddingHorizontal: normalize(12)}}>
        <LyristText style={{}} weight={'Medium'}>
          My Libraryyyy
        </LyristText>
        {hasPlus ? null : (
          <>
            <LyristText>·</LyristText>
            {user ? (
              <LyristText onPress={() => router.push('/pricing')}>
                {pagesLeftBasicUser} free page{pagesLeftBasicUser !== 1 && 's'} left
              </LyristText>
            ) : (
              <LyristText onPress={() => setOpenAuthModal(true)}>Sign In</LyristText>
            )}
          </>
        )}
      </View>
      {pagesLoading ? (
        <LyristText style={{paddingHorizontal: normalize(12)}}>Getting pages...</LyristText>
      ) : error ? (
        <LyristText>{error.message}</LyristText>
      ) : (
        <View style={{flex: 1, paddingBottom: normalize(48)}}>
          {pagesToFilter?.length ?? 0 > 0 ? (
            pagesToFilter?.map((item, index) => handleRenderItem({item, index}))
          ) : (
            <LyristText style={{paddingHorizontal: normalize(12)}}>
              Use Search to find audio and start typing!
            </LyristText>
          )}
          {/* <FlatList<Page>
            data={pagesToFilter}
            renderItem={handleRenderItem}
            ListEmptyComponent={
              <LyristText style={{ paddingHorizontal: normalize(12) }}>
                Use Search to find audio and start typing!
              </LyristText>
            }
          /> */}
        </View>
      )}
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
      <Modal animationType="fade" transparent={true} visible={!!pageToDownload}>
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
              <LyristText weight={'SemiBold'}>Text to download</LyristText>
              <LyristText>Now you can share your content in {copiedTitle}.</LyristText>
            </View>
          </View>
        ) : null}
      </Modal>
    </View>
    
  );


}
const copyToClipboard = async (text:any) => {
   try {
    // Use the modern Clipboard API to copy text
    await navigator.clipboard.writeText(text);

    // Optional: Notify the user or perform any other action after copying
    console.log('Your text is copied to clipboard:', text);
  } catch (error) {
    console.error('Error copying text to clipboard:', error);
  }
}

