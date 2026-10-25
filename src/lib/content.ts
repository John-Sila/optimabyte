// Editable site content (portfolio screenshots) stored in Firestore doc
// content/portfolio as { images: { [projectId]: url } }.
//
// Reads are cached in localStorage and refreshed in the background
// (stale-while-revalidate), so the portfolio paints instantly on repeat visits.

import { useCallback, useEffect, useState } from "react";
import { firebaseConfigured, prepareFirebase } from "./firebase";

export type PortfolioImages = Record<string, string>;

const CACHE_KEY = "ob_content_portfolio_v1";
const FRESH_MS = 5 * 60 * 1000;

interface Cached {
  images: PortfolioImages;
  at: number;
}

function readCache(): Cached | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Cached;
    return parsed && typeof parsed.at === "number" && parsed.images ? parsed : null;
  } catch {
    return null;
  }
}

function writeCache(images: PortfolioImages) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ images, at: Date.now() }));
  } catch {
    /* storage unavailable or full */
  }
}

/** Only http(s) image URLs are ever rendered. */
export function isSafeImageUrl(value: string): boolean {
  try {
    const u = new URL(value);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

async function fetchRemote(): Promise<PortfolioImages> {
  const fs = await import("firebase/firestore/lite");
  const db = fs.getFirestore(await prepareFirebase());
  const snap = await fs.getDoc(fs.doc(db, "content", "portfolio"));
  const raw = (snap.exists() ? (snap.data().images as PortfolioImages | undefined) : undefined) ?? {};
  const clean: PortfolioImages = {};
  for (const [id, url] of Object.entries(raw)) {
    if (typeof url === "string" && isSafeImageUrl(url)) clean[id] = url;
  }
  return clean;
}

export function usePortfolioImages() {
  const [images, setImages] = useState<PortfolioImages>(() => readCache()?.images ?? {});

  useEffect(() => {
    if (!firebaseConfigured) return;
    const cached = readCache();
    if (cached && Date.now() - cached.at < FRESH_MS) return;
    let cancelled = false;
    fetchRemote()
      .then((remote) => {
        if (cancelled) return;
        writeCache(remote);
        setImages(remote);
      })
      .catch(() => {
        /* offline or not configured: keep whatever is cached */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  /** Called by the admin editor after a successful save, so the page updates at once. */
  const applyLocal = useCallback((id: string, url: string | null) => {
    setImages((prev) => {
      const next = { ...prev };
      if (url) next[id] = url;
      else delete next[id];
      writeCache(next);
      return next;
    });
  }, []);

  return { images, applyLocal };
}
