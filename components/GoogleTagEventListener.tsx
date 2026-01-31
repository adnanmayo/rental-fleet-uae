"use client";

import { useEffect } from "react";

/**
 * Listens for clicks on elements with data-ga-event and fires gtag.
 * Add data-ga-event="cta_click" data-ga-label="hero_autycloud" (optional: data-ga-category, data-ga-value).
 */
export default function GoogleTagEventListener() {
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      const el = target.closest?.("[data-ga-event]") as HTMLElement | null;
      if (!el || typeof window.gtag !== "function") return;

      const eventName = el.getAttribute("data-ga-event");
      if (!eventName) return;

      const category = el.getAttribute("data-ga-category") ?? "engagement";
      const label = el.getAttribute("data-ga-label") ?? "";
      const value = el.getAttribute("data-ga-value");
      const params: Record<string, string | number> = {
        event_category: category,
        event_label: label,
      };
      if (value !== null && value !== "") {
        const num = Number(value);
        if (Number.isFinite(num)) params.value = num;
      }

      window.gtag("event", eventName, params);
    }

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  return null;
}
