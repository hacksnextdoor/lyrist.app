import {encrypt} from '../encryption';
import {Audio, Page} from '../types';
import {calculateByteSize} from '../utils';
import auth from './firebase-auth-web';
import database from './firebase-database-web';

const rootRef = database().ref();

export const PageManager: IPageManager = {
  createPage(pageId: Page['id'], item: any, title: string, body: string) {
    const {uid: userId} = auth().currentUser!;
    const currentTime = database.ServerValue.TIMESTAMP;
    const pageTitle = item ? item.title : title;
    let updates: Record<string, unknown> = {};
    updates[`authors/${userId}/pages/${pageId}/id`] = pageId;
    updates[`library/${pageId}/id`] = pageId;
    updates[`authors/${userId}/pages/${pageId}/dateCreated`] = currentTime;
    updates[`library/${pageId}/dateCreated`] = currentTime;
    updates[`authors/${userId}/pages/${pageId}/title`] = pageTitle;
    updates[`library/${pageId}/title`] = pageTitle;
    if (item) {
      const {dateUploaded, viewCount, channelThumbnail, ...itemForServer}: Audio = item;
      updates[`authors/${userId}/pages/${pageId}/audio`] = itemForServer;
      updates[`library/${pageId}/audio`] = itemForServer;
    }
    updates[`library/${pageId}/authors`] = {[userId]: true};
    // duplicate from updatePage
    const preview = encrypt(body.substring(0, 39));
    updates[`authors/${userId}/pages/${pageId}/dateLastModified`] = currentTime;
    updates[`authors/${userId}/pages/${pageId}/preview`] = preview;
    updates[`library/${pageId}/dateLastModified`] = currentTime;
    updates[`library/${pageId}/preview`] = preview;
    const encryptedBody = encrypt(body);
    const size = calculateByteSize(encryptedBody);
    updates[`pages/${pageId}/body`] = encryptedBody;
    updates[`pages/${pageId}/sizeInBytes`] = size;
    return rootRef.update(updates);
    // end
  },
  removePage(pageId: Page['id']) {
    const {uid: userId} = auth().currentUser!;
    const updates = {
      [`authors/${userId}/pages/${pageId}`]: null,
      [`library/${pageId}`]: null,
      [`pages/${pageId}`]: null,
    };
    return rootRef.update(updates);
  },
  updatePage(pageId: Page['id'], body: string) {
    const {uid: userId} = auth().currentUser!;
    const currentTime = database.ServerValue.TIMESTAMP;
    let updates: Record<string, unknown> = {};
    const preview = encrypt(body.substring(0, 39));
    updates[`authors/${userId}/pages/${pageId}/dateLastModified`] = currentTime;
    updates[`authors/${userId}/pages/${pageId}/preview`] = preview;
    updates[`library/${pageId}/dateLastModified`] = currentTime;
    updates[`library/${pageId}/preview`] = preview;
    const encryptedBody = encrypt(body);
    const size = calculateByteSize(encryptedBody);
    updates[`pages/${pageId}/body`] = encryptedBody;
    updates[`pages/${pageId}/sizeInBytes`] = size;
    return rootRef.update(updates);
  },
};

interface IPageManager {
  createPage(pageId: Page['id'], item: any, title: string, body): Promise<void>;
  removePage(pageId: Page['id']): Promise<void>;
  updatePage(pageId: string, body: string): Promise<void>;
}
