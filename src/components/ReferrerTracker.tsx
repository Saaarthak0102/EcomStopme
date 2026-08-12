"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

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

        // Track Click in Database (session-unique)
        (async () => {
          try {
            let sessionId = sessionStorage.getItem("stopme_session_id");
            if (!sessionId) {
              sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
              sessionStorage.setItem("stopme_session_id", sessionId);
            }

            const sessionClickKey = `stopme_click_${ref}`;
            if (!sessionStorage.getItem(sessionClickKey)) {
              sessionStorage.setItem(sessionClickKey, "logged");
              
              const supabase = createClient();
              const { error } = await supabase.from("referral_clicks").insert({
                referrer: ref,
                session_id: sessionId,
                path: window.location.pathname + window.location.search
              });
              if (error) {
                console.error("[ReferrerTracker] Failed to record click in DB:", error.message);
              } else {
                console.log("[ReferrerTracker] Click recorded in DB");
              }
            }
          } catch (e) {
            console.error("[ReferrerTracker] Error inserting click:", e);
          }
        })();

        return;
      }

      // 2. Check document.referrer (HTTP Referrer)
      if (document.referrer) {
        const refUrl = new URL(document.referrer);
        // Do not log if referrer is our own website or if a referrer code is already stored
        if (refUrl.hostname !== window.location.hostname && !localStorage.getItem("stopme_referrer")) {
          const domain = refUrl.hostname;
          localStorage.setItem("stopme_referrer", domain);
          console.log(`[ReferrerTracker] Logged referrer domain: ${domain}`);

          // Track Click in Database (session-unique)
          (async () => {
            try {
              let sessionId = sessionStorage.getItem("stopme_session_id");
              if (!sessionId) {
                sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
                sessionStorage.setItem("stopme_session_id", sessionId);
              }

              const sessionClickKey = `stopme_click_${domain}`;
              if (!sessionStorage.getItem(sessionClickKey)) {
                sessionStorage.setItem(sessionClickKey, "logged");
                
                const supabase = createClient();
                const { error } = await supabase.from("referral_clicks").insert({
                  referrer: domain,
                  session_id: sessionId,
                  path: window.location.pathname + window.location.search
                });
                if (error) {
                  console.error("[ReferrerTracker] Failed to record domain click in DB:", error.message);
                } else {
                  console.log("[ReferrerTracker] Domain click recorded in DB");
                }
              }
            } catch (e) {
              console.error("[ReferrerTracker] Error inserting domain click:", e);
            }
          })();
        }
      }
    } catch (error) {
      console.error("[ReferrerTracker] Error tracking referrer:", error);
    }
  }, []);

  return null;
}
