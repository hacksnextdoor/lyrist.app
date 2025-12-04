'use client';
import type firebase from 'firebase/compat';
import {useEffect, useRef, useState} from 'react';
import {useDebouncedCallback} from 'use-debounce';
import database from '../firebase/firebase-database-web';
import {decrypt} from '../encryption';
import {useSavePageMutation} from '../api/page.api';
import {createLogger} from '../utils/logger';
import type {Audio, InitialPage, SavePagePayload} from '../types';

const log = createLogger('[useSave]');
const batchLog = createLogger('[useBatchedSave]');

interface UseSaveOptions {
  initialPage: InitialPage;
  userId: string | null; // Must be authenticated to attach listeners
}

/**
 * Web port of mobile useSave hook.
 *
 * KEY DIFFERENCE FROM MOBILE:
 * - Mobile: Component remounts when navigating to different page (via navigation)
 * - Web: Component stays mounted, URL params change (useQueryState)
 *
 * This means we need to:
 * 1. Track which page is "active" for UI state updates
 * 2. Always complete saves to the page they were initiated for (no data loss)
 * 3. Only attach Firebase listeners when user is authenticated
 */
export function useSave({initialPage, userId}: UseSaveOptions) {
  const [currentId, setCurrentId] = useState(initialPage.id);
  const [currentTitle, setCurrentTitle] = useState('');
  const [currentAudio, setCurrentAudio] = useState(initialPage.audio);
  const [currentBody, setCurrentBody] = useState('');
  const [editorLoading, setEditorLoading] = useState(initialPage.id != null);
  const [editorKey, setEditorKey] = useState(0); // Increments on page switch to force Editor remount

  // Refs that track the page being created (for queueing)
  const initialParentIdRef = useRef<string | null>(initialPage.parentId ?? null);
  const isCreatingRef = useRef<boolean>(false);
  const pendingUpdateRef = useRef<{title?: string; body?: string; audio?: Audio} | null>(null);

  // Track which page is currently displayed (for UI state updates only)
  const activePageIdRef = useRef<string | null>(initialPage.id);
  const activeAudioIdRef = useRef<string | undefined>(initialPage.audio?.id);
  const isInitialMountRef = useRef(true);

  log(`INIT: initialPage.id=${initialPage.id}, audio=${initialPage.audio?.id}`);

  const savePage = useSavePageMutation().mutateAsync;

  /**
   * doSave - saves to the specified page
   *
   * @param payload - the data to save
   * @param targetPageId - the page this save is for (captured at time of trigger)
   * @param targetAudioId - the audio this save is for (captured at time of trigger)
   *
   * IMPORTANT: Saves ALWAYS complete to prevent data loss.
   * We only skip updating local state if we've switched pages.
   */
  const doSave = async (
    payload: SavePagePayload,
    targetPageId: string | null,
    targetAudioId: string | undefined,
  ) => {
    log(`doSave: targetPageId=${targetPageId}, payload.id=${payload.id}`);
    log(
      `doSave: activePageIdRef=${activePageIdRef.current}, activeAudioIdRef=${activeAudioIdRef.current}`,
    );

    if (!payload.id) {
      // CREATING A NEW PAGE
      log(`doSave: CREATING new page for audio=${targetAudioId}`);

      // Check if we've switched to a different audio - if so, don't create
      // (the user switched away before we could create the page)
      if (targetAudioId !== activeAudioIdRef.current) {
        log(
          `doSave: Audio changed (was ${targetAudioId}, now ${activeAudioIdRef.current}), skipping create`,
        );
        return;
      }

      isCreatingRef.current = true;
      try {
        const newId = await savePage({audio: currentAudio, ...payload});
        log(`doSave: Created page with newId=${newId}`);

        isCreatingRef.current = false;

        // Only update state if we're still on the same audio
        if (targetAudioId === activeAudioIdRef.current) {
          log(`doSave: Still on same audio, updating currentId to ${newId}`);
          setCurrentId(newId);
          activePageIdRef.current = newId;

          // Flush any pending updates that came in while creating
          if (pendingUpdateRef.current) {
            const pending = pendingUpdateRef.current;
            pendingUpdateRef.current = null;
            log(`doSave: Flushing pending updates:`, Object.keys(pending));
            await savePage({id: newId, ...pending});
          }
        } else {
          log(
            `doSave: Audio changed during create, not updating state (but page WAS created: ${newId})`,
          );
          // The page was still created - no data loss. User just switched away.
        }
      } catch (err) {
        log.error(`doSave: ERROR creating page:`, err);
        isCreatingRef.current = false;
      }
    } else {
      // UPDATING AN EXISTING PAGE
      // ALWAYS save - this prevents data loss
      log(`doSave: UPDATING page ${payload.id}`);
      try {
        await savePage(payload);
        log(`doSave: Update complete for page ${payload.id}`);
      } catch (err) {
        log.error(`doSave: ERROR updating page ${payload.id}:`, err);
      }
    }
  };

  /**
   * triggerSave - called by useBatchedSave when ready to save
   * Captures the current page context at call time.
   */
  const triggerSave = (field: 'title' | 'body' | 'audio', value: any) => {
    const valuePreview = typeof value === 'string' ? value.substring(0, 50) : JSON.stringify(value);
    log(`triggerSave: field=${field}, value="${valuePreview}..."`);
    log(`triggerSave: currentId=${currentId}, isCreating=${isCreatingRef.current}`);

    // If we're in the middle of creating a page, queue this update
    if (!currentId && isCreatingRef.current) {
      log(`triggerSave: Queuing to pendingUpdateRef (create in progress)`);
      pendingUpdateRef.current = {...(pendingUpdateRef.current ?? {}), [field]: value};
      return;
    }

    const payload: SavePagePayload = {
      id: currentId,
      parentId: currentId ? undefined : initialParentIdRef.current,
      [field]: value,
    };

    const hasFields = Object.keys(payload).some(k => k !== 'id' && k !== 'parentId');
    if (!hasFields) {
      log(`triggerSave: No fields to save, skipping`);
      if (!currentId) isCreatingRef.current = false;
      return;
    }

    // Capture current context for the save operation
    const targetPageId = currentId;
    const targetAudioId = activeAudioIdRef.current;

    doSave(payload, targetPageId, targetAudioId);
  };

  // Sync when initialPage changes (URL navigation on web)
  useEffect(() => {
    log(`SYNC EFFECT: initialPage changed`);
    log(`SYNC EFFECT: new id=${initialPage.id}, audio=${initialPage.audio?.id}`);
    log(
      `SYNC EFFECT: prev activePageIdRef=${activePageIdRef.current}, activeAudioIdRef=${activeAudioIdRef.current}`,
    );
    log(`SYNC EFFECT: isInitialMount=${isInitialMountRef.current}`);

    // Skip state updates on initial mount - useState already has the correct values
    // and the listener will load the body
    if (isInitialMountRef.current) {
      log(`SYNC EFFECT: Initial mount, skipping state updates`);
      isInitialMountRef.current = false;
      return;
    }

    // Check if audio actually changed BEFORE updating refs
    const audioChanged = initialPage.audio?.id !== activeAudioIdRef.current;

    // Update active refs (these control what we accept from listeners)
    activePageIdRef.current = initialPage.id;
    activeAudioIdRef.current = initialPage.audio?.id;

    // Reset creation state for new audio
    if (audioChanged) {
      log(`SYNC EFFECT: Audio changed, resetting creation state`);
      isCreatingRef.current = false;
      pendingUpdateRef.current = null;
    }

    // Update state
    setCurrentId(initialPage.id);
    setCurrentAudio(initialPage.audio);
    setEditorLoading(initialPage.id != null);
    setEditorKey(k => k + 1); // Force Editor remount with new defaultValue

    if (initialPage.id == null) {
      log(`SYNC EFFECT: New page (no id) - clearing body/title`);
      setCurrentBody('');
      setCurrentTitle('');
    }

    log(`SYNC EFFECT: Complete`);
  }, [initialPage.id, initialPage.audio?.id]);

  // Firebase listeners - only attach when user is authenticated
  useEffect(() => {
    if (currentId == null) {
      log(`LISTENER EFFECT: currentId is null, no listeners attached`);
      return;
    }

    if (!userId) {
      log(`LISTENER EFFECT: userId is null, waiting for auth`);
      // Don't show editorLoading while waiting for auth - auth has its own loading state
      setEditorLoading(false);
      return;
    }

    // User is authenticated, start loading data from Firebase
    setEditorLoading(true);

    // Capture currentId for this effect's closure
    const listenerId = currentId;
    log(`LISTENER EFFECT: Attaching listeners for id=${listenerId}, userId=${userId}`);

    const bodyRef = database().ref(`pages/${listenerId}/body`);
    const titleRef = database().ref(`library/${listenerId}/title`);
    const audioRef = database().ref(`library/${listenerId}/audio`);

    const onValueBodyRef = (snapshot: firebase.database.DataSnapshot) => {
      // Only update state if this listener is for the currently active page
      if (activePageIdRef.current !== listenerId) {
        log(`LISTENER: Body for ${listenerId} ignored (active=${activePageIdRef.current})`);
        return;
      }
      if (snapshot.exists() && snapshot.val() != null) {
        log(`LISTENER: Body received for ${listenerId}`);
        setCurrentBody(decrypt(snapshot.val()));
      } else {
        log(`LISTENER: Body empty for ${listenerId}`);
        setCurrentBody('');
      }
      setEditorLoading(false);
    };

    const onValueTitleRef = (snapshot: firebase.database.DataSnapshot) => {
      if (activePageIdRef.current !== listenerId) {
        log(`LISTENER: Title for ${listenerId} ignored (active=${activePageIdRef.current})`);
        return;
      }
      if (snapshot.exists() && snapshot.val() != null) {
        log(`LISTENER: Title received for ${listenerId}: "${snapshot.val()}"`);
        setCurrentTitle(snapshot.val());
      } else {
        log(`LISTENER: Title empty for ${listenerId}`);
        setCurrentTitle('');
      }
    };

    const onValueAudioRef = (snapshot: firebase.database.DataSnapshot) => {
      if (activePageIdRef.current !== listenerId) {
        log(`LISTENER: Audio for ${listenerId} ignored (active=${activePageIdRef.current})`);
        return;
      }
      if (snapshot.exists() && snapshot.val() != null) {
        log(`LISTENER: Audio received for ${listenerId}`);
        setCurrentAudio(snapshot.val());
      }
    };

    bodyRef.on('value', onValueBodyRef, (error: Error) => {
      log.error(`LISTENER ERROR: body for ${listenerId}:`, error);
      if (activePageIdRef.current === listenerId) {
        setEditorLoading(false);
        setCurrentBody('');
      }
    });
    titleRef.on('value', onValueTitleRef, (error: Error) => {
      log.error(`LISTENER ERROR: title for ${listenerId}:`, error);
    });
    audioRef.on('value', onValueAudioRef, (error: Error) => {
      log.error(`LISTENER ERROR: audio for ${listenerId}:`, error);
    });

    return () => {
      log(`LISTENER CLEANUP: Detaching for ${listenerId}`);
      bodyRef.off('value', onValueBodyRef);
      titleRef.off('value', onValueTitleRef);
      audioRef.off('value', onValueAudioRef);
    };
  }, [currentId, userId]);

  return {
    currentId,
    currentTitle,
    currentAudio,
    currentBody,
    editorLoading,
    editorKey,
    triggerSave,
  };
}

type PageField = 'title' | 'body' | 'audio';

/**
 * useBatchedSave - batches rapid saves into single operations
 *
 * IMPORTANT: flush() should be called before switching pages to prevent data loss
 */
export function useBatchedSave(
  triggerSave: (field: PageField, value: any) => void,
  delayMs: number,
) {
  const stashRef = useRef<Partial<Record<PageField, any>>>({});

  const flushPending = useDebouncedCallback(
    () => {
      const pending = {...stashRef.current};
      stashRef.current = {};
      const fields = Object.keys(pending) as PageField[];
      if (fields.length === 0) return;

      batchLog(`FLUSH: ${fields.length} fields: ${fields.join(', ')}`);
      for (const field of fields) {
        triggerSave(field, pending[field]);
      }
    },
    delayMs,
    {leading: false, trailing: true},
  );

  const batchedSave = (field: PageField, value: any) => {
    const valuePreview = typeof value === 'string' ? value.substring(0, 30) : JSON.stringify(value);
    batchLog(`BATCH: field=${field}, value="${valuePreview}..."`);
    stashRef.current[field] = value;
    flushPending();
  };

  /**
   * Immediately flush pending saves - call before switching pages
   */
  const flushNow = () => {
    const pendingCount = Object.keys(stashRef.current).length;
    if (pendingCount > 0) {
      batchLog(`FLUSH NOW: ${pendingCount} pending fields`);
      flushPending.flush();
    }
  };

  return {batchedSave, flush: flushNow};
}
