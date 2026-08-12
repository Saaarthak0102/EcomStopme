"use client";

import { useEffect } from "react";

export function ReferrerTracker() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      // 1. Check URL query parameters for ref, referrer, or utm_source
      const params = new URLSearchParams(window.location.search);
      const ref = params.get("ref") || params.get("referrer") || params.get("utm_source");

      if (ref) {
        localStorage.setItem("stopme_referrer", ref);
        console.log(`[ReferrerTracker] Logged referrer code: ${ref}`);
        return;
      }

      // 2. Check document.referrer (HTTP Referrer)
      if (document.referrer) {
        const refUrl = new URL(document.referrer);
        // Do not log if referrer is our own website or if a referrer code is already stored
        if (refUrl.hostname !== window.location.hostname && !localStorage.getItem("stopme_referrer")) {
          localStorage.setItem("stopme_referrer", refUrl.hostname);
          console.log(`[ReferrerTracker] Logged referrer domain: ${refUrl.hostname}`);
        }
      }
    } catch (error) {
      console.error("[ReferrerTracker] Error tracking referrer:", error);
    }
  }, []);

  return null;
}
