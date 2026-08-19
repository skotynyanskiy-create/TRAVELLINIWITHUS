/**
 * Tipi condivisi fra `server.ts` (dev) e `src/server/apiRoutes.ts` (montato sia
 * dal dev server sia dalla Cloud Function). Estratti allo stadio 1: prima
 * vivevano dentro `server.ts`, che non e' importabile perche' e' uno script di
 * avvio, quindi il router estratto non poteva raggiungerli.
 */

/** Forma dei valori nella REST API di Firestore (non l'SDK admin). */
export interface FirestoreValue {
  stringValue?: string;
  integerValue?: string;
  doubleValue?: number;
  timestampValue?: string;
  booleanValue?: boolean;
  arrayValue?: {
    values?: FirestoreValue[];
  };
  mapValue?: {
    fields?: Record<string, FirestoreValue>;
  };
}

export interface FirestoreDocument {
  name?: string;
  fields?: Record<string, FirestoreValue>;
}

export interface FirestoreListResponse {
  documents?: FirestoreDocument[];
}

export interface FirestoreRunQueryResponse {
  document?: FirestoreDocument;
}

/** Riga di carrello risolta lato server: prezzo e nome vengono dal database,
 *  mai dal client, altrimenti il totale sarebbe manipolabile. */
export interface CheckoutItem {
  id: string;
  name: string;
  imageUrl?: string;
  price: number;
  quantity: number;
}

/** Cio' che il client ha il permesso di mandare: solo id e quantita'. */
export interface CheckoutRequestItem {
  id: string;
  quantity: number;
}

export interface ProductRecord {
  id: string;
  name: string;
  slug: string;
  price: number;
  description?: string;
  imageUrl?: string;
  category?: string;
  isDigital?: boolean;
}

export interface CouponRecord {
  code: string;
  type: 'percent' | 'fixed';
  value: number;
  description: string;
  active: boolean;
  expiryDate: string | null;
}

export interface ProductAssetRecord {
  downloadUrl: string | null;
}

export interface StripeOrderRecord {
  customerName: string;
  email: string;
  total: number;
  status: 'completed';
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    downloadUrl: string | null;
    isDigital: boolean;
  }>;
  userId: string | null;
  stripeSessionId: string;
}

/** Ritorno di `verifyOptionalIdToken`: null quando l'header manca o il token
 *  non e' valido — la rotta decide se quello e' un errore o un ospite. */
export interface VerifiedUser {
  uid: string;
  email: string | null;
}
