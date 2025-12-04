import {Audio} from './Audio';

export type InitialPage = {readonly id: string | null; audio?: Audio; parentId?: string | null};
export type PageBase = {readonly id: string};

export type Page_old = {
  title: string;
  lyrics: string;
  dateModified: string;
  song?: Audio;
  dateCreated?: object;
} & PageBase;

export type Page = {
  title: string;
  body?: string | null; // null for page item previews
  dateCreated: number;
  dateLastModified: number;
  preview: string;
} & InitialPage;

export type PagePayload = {id: Page['id'] | null; body: string; item?: any; title?: string};

export type SavePagePayload = {
  body?: string;
  item?: any;
  title?: string;
  audio?: Audio;
} & InitialPage;

export type DeletePagePayload = {id: string};
