import type { ContentItem } from '../types/content';
import { applyCaptionEnrichment } from './instagramCaptionEnrichment';

/**
 * Predisposizione API Instagram (Graph API) — adapter media → ContentItem.
 *
 * Quando colleghi il token (LATO SERVER, mai nel client: è un segreto), questo
 * adapter trasforma la risposta `media` dell'API nei campi raw di ContentItem.
 * I campi curati (hook/title/description/place/zone/types/partnership) restano
 * da arricchire — via parsing della caption o dal pannello admin — quindi
 * l'item nasce `isPlaceholder: true` finché non è completato.
 *
 * NON chiamare l'API Instagram dal browser: l'access token non deve mai
 * raggiungere il bundle client (`VITE_*` sarebbe esposto). Il fetch va in
 * `server.ts` / una function, che salva i ContentItem su Firestore.
 */

export interface InstagramMedia {
  id: string;
  permalink: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url?: string;
  thumbnail_url?: string;
  caption?: string;
  timestamp?: string;
}

const MEDIA_TYPE_MAP: Record<InstagramMedia['media_type'], ContentItem['mediaType']> = {
  VIDEO: 'reel',
  IMAGE: 'post',
  CAROUSEL_ALBUM: 'carousel',
};

/** Mappa un singolo media IG nei campi raw di un ContentItem (curati = placeholder). */
export function mapInstagramMediaToContentItem(media: InstagramMedia): ContentItem {
  return {
    id: `ig-${media.id}`,
    source: 'instagram',
    permalink: media.permalink,
    mediaType: MEDIA_TYPE_MAP[media.media_type] ?? 'post',
    cover: media.thumbnail_url ?? media.media_url ?? '',
    caption: media.caption,
    publishedAt: media.timestamp,
    // Campi curati — da arricchire prima di pubblicare.
    hook: '',
    title: '',
    description: '',
    place: { name: '', country: '' },
    zone: 'Italia',
    types: [],
    partnership: { kind: 'organic' },
    isPlaceholder: true,
  };
}

/** Mappa un elenco di media IG in ContentItem raw. */
export function mapInstagramFeed(media: InstagramMedia[]): ContentItem[] {
  return media.map(mapInstagramMediaToContentItem);
}

/**
 * Mappa + arricchisce: raw mapping seguito da parsing della caption (hook,
 * prezzo, partner, disclosure ADV). È il punto d'ingresso che il job IG userà
 * per produrre ContentItem già quasi pronti dai media reali.
 */
export function enrichInstagramFeed(media: InstagramMedia[]): ContentItem[] {
  return media.map((m) => applyCaptionEnrichment(mapInstagramMediaToContentItem(m)));
}
