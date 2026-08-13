/**
 * Meta Pixel helper — safe wrapper around window.fbq()
 * Works with the pixel already installed in src/app/layout.tsx.
 *
 * All events include `content_type: 'product'` so Meta can match
 * them against catalog items by their content_ids.
 */

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export interface FbqViewContentPayload {
  content_ids: string[];
  content_type: "product";
  content_name?: string;
  value?: number;
  currency?: string;
}

export interface FbqAddToCartPayload {
  content_ids: string[];
  content_type: "product";
  content_name?: string;
  value?: number;
  currency?: string;
  num_items?: number;
}

export interface FbqPurchasePayload {
  content_ids: string[];
  content_type: "product";
  value: number;
  currency: string;
  num_items?: number;
}

type FbqEventMap = {
  ViewContent: FbqViewContentPayload;
  AddToCart: FbqAddToCartPayload;
  Purchase: FbqPurchasePayload;
};

/**
 * Fire a Meta Pixel standard event.
 * Safe to call server-side or before the pixel loads — it will no-op.
 *
 * @example
 * fbqEvent('ViewContent', { content_ids: ['prod-001'], content_type: 'product', value: 2499, currency: 'INR' });
 */
export function fbqEvent<T extends keyof FbqEventMap>(
  event: T,
  payload: FbqEventMap[T]
): void {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  window.fbq("track", event, payload);
}
