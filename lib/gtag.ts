/**
 * Google Analytics / gtag helpers for event tracking.
 * Use from client components only (window.gtag).
 */

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export const GA_EVENT_CTA_CLICK = "cta_click";
export const GA_EVENT_FORM_SUBMIT = "form_submit";
export const GA_EVENT_DOWNLOAD = "download";

/**
 * Fire a gtag event (client-side only). No-op if gtag is not loaded.
 */
export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
): void {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", eventName, params);
}
