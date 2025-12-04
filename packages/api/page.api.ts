'use client';
import firebase from 'firebase/compat/app';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import database from '../firebase/firebase-database-web';
import {encrypt} from '../encryption';
import type {DeletePagePayload, SavePagePayload} from '../types';
import {useAuthContext} from '../context/AuthProvider';

const FIRST_COLLECTION_ID = 'library';

function calculateByteSize(str: string): number {
  return new TextEncoder().encode(str).length;
}

export const savePageData = async (payload: SavePagePayload, userId: string): Promise<string> => {
  const rootRef = database().ref();
  const serverTimestamp = firebase.database.ServerValue.TIMESTAMP;
  console.log('[savePageData API] Saving page data', payload);
  const {id, parentId, title, body, audio} = payload;
  let updates: Record<string, any> = {};
  let pageIdToUse = id;
  let isNewPage = false;

  if (pageIdToUse == null) {
    isNewPage = true;
    const pagesRef = database().ref(`authors/${userId}/pages`);
    const newPageId = pagesRef.push().key;
    if (!newPageId) {
      throw new Error('Failed to generate page ID.');
    }
    pageIdToUse = newPageId;

    // Initial updates for new page
    updates[`authors/${userId}/pages/${pageIdToUse}/id`] = pageIdToUse;
    updates[`authors/${userId}/pages/${pageIdToUse}/dateCreated`] = serverTimestamp;
    updates[`authors/${userId}/pages/${pageIdToUse}/dateLastModified`] = serverTimestamp;
    updates[`library/${pageIdToUse}/id`] = pageIdToUse;
    updates[`library/${pageIdToUse}/dateCreated`] = serverTimestamp;
    updates[`library/${pageIdToUse}/dateLastModified`] = serverTimestamp;
    updates[`library/${pageIdToUse}/authors`] = {[userId]: true};

    if (parentId && parentId !== FIRST_COLLECTION_ID) {
      updates[`authors/${userId}/pages/${pageIdToUse}/parentId`] = parentId;
      updates[`library/${pageIdToUse}/parentId`] = parentId;
      updates[`collections/${userId}/${parentId}/children/pages/${pageIdToUse}`] = true;
      updates[`collections/${userId}/${parentId}/updatedAt`] = serverTimestamp;
    }

    console.log(`[savePageData API] Creating new page ${pageIdToUse}. Merged initial updates.`);
  } else {
    console.log(`[savePageData API] Updating existing page ${pageIdToUse}`);
  }

  let fieldUpdated = false;
  if (title !== undefined) {
    fieldUpdated = true;
    updates[`authors/${userId}/pages/${pageIdToUse}/title`] = title ?? '';
    updates[`library/${pageIdToUse}/title`] = title ?? '';
  }
  if (body !== undefined) {
    fieldUpdated = true;
    const cleanBody = body ?? '';
    const preview = encrypt(cleanBody.substring(0, 39));
    const encryptedBody = encrypt(cleanBody);
    const size = calculateByteSize(encryptedBody);
    updates[`pages/${pageIdToUse}/body`] = encryptedBody;
    updates[`pages/${pageIdToUse}/sizeInBytes`] = size;
    updates[`authors/${userId}/pages/${pageIdToUse}/preview`] = preview;
    updates[`library/${pageIdToUse}/preview`] = preview;
  }
  if (audio !== undefined) {
    fieldUpdated = true;
    const {dateUploaded, viewCount, channelThumbnail, ...itemForServer} = audio as any;
    updates[`authors/${userId}/pages/${pageIdToUse}/audio`] = itemForServer;
    updates[`library/${pageIdToUse}/audio`] = itemForServer;
  }

  if (fieldUpdated) {
    updates[`authors/${userId}/pages/${pageIdToUse}/dateLastModified`] = serverTimestamp;
    updates[`library/${pageIdToUse}/dateLastModified`] = serverTimestamp;
  }

  if (Object.keys(updates).length > 0) {
    console.log(
      `[savePageData API] Saving updates for page ${pageIdToUse}`,
      Object.keys(updates).length,
    );
    await rootRef.update(updates);
  }
  console.log('[savePageData API] Finished saving page data', pageIdToUse);
  return pageIdToUse;
};

export const deletePage = async (
  payload: DeletePagePayload,
  userId: string,
): Promise<{parentId: string | null}> => {
  const rootRef = database().ref();
  const serverTimestamp = firebase.database.ServerValue.TIMESTAMP;
  const {id: pageId} = payload;
  let parentId: string | null = null;

  try {
    const parentIdRef = database().ref(`library/${pageId}/parentId`);
    const snap = await parentIdRef.get();
    parentId = snap.val();
  } catch (e) {
    console.error(`Failed to fetch parentId for page ${pageId} on delete`, e);
  }

  const updates: Record<string, any> = {
    [`authors/${userId}/pages/${pageId}`]: null,
    [`library/${pageId}`]: null,
    [`pages/${pageId}`]: null,
  };
  if (parentId) {
    updates[`collections/${userId}/${parentId}/children/pages/${pageId}`] = null;
    updates[`collections/${userId}/${parentId}/updatedAt`] = serverTimestamp;
  }

  await rootRef.update(updates);
  return {parentId};
};

/**
 * React Query mutation hook for saving pages.
 * Provides loading states, error handling, and automatic cache invalidation.
 */
export function useSavePageMutation() {
  const {user} = useAuthContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SavePagePayload) => {
      if (!user?.uid) {
        throw new Error('Authentication required');
      }
      return savePageData(payload, user.uid);
    },
    onSuccess: (pageId, variables) => {
      // Invalidate pages list when creating a new page
      if (variables.id == null) {
        queryClient.invalidateQueries({queryKey: ['pages']});
      }
    },
  });
}

export interface CreatePageParams {
  title: string;
  body: string;
  audio: SavePagePayload['audio'];
  parentId?: string;
}

/**
 * Hook specifically for CREATING a new page.
 *
 * Use this when the user explicitly clicks "Save" for the first time.
 * Returns the new page ID on success.
 *
 * This is separate from useSavePageMutation to make the intent clear:
 * - useCreatePage: First save, creates new page
 * - useSavePageMutation: Updates to existing page (or creates if id is null)
 */
export function useCreatePage() {
  const {user} = useAuthContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: CreatePageParams): Promise<string> => {
      if (!user?.uid) {
        throw new Error('Authentication required to save');
      }
      const payload: SavePagePayload = {
        id: null, // Always null for creation
        parentId: params.parentId ?? null,
        title: params.title,
        body: params.body,
        audio: params.audio,
      };
      return savePageData(payload, user.uid);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['pages']});
    },
  });
}

/**
 * React Query mutation hook for deleting pages.
 */
export function useDeletePageMutation() {
  const {user} = useAuthContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: DeletePagePayload) => {
      if (!user?.uid) {
        throw new Error('Authentication required');
      }
      return deletePage(payload, user.uid);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['pages']});
    },
  });
}
