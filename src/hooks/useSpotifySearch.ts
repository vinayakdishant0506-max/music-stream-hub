import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type SpTrack = {
  id: string; name: string; artists: string; album: string;
  cover: string; duration_ms: number; preview_url: string | null; external_url: string;
};
export type SpAlbum = { id: string; name: string; artists: string; cover: string; external_url: string };
export type SpArtist = { id: string; name: string; cover: string; followers: number; external_url: string };
export type SpPlaylist = { id: string; name: string; owner: string; cover: string; external_url: string };

export type SpResults = {
  tracks: SpTrack[]; albums: SpAlbum[]; artists: SpArtist[]; playlists: SpPlaylist[];
};

const empty: SpResults = { tracks: [], albums: [], artists: [], playlists: [] };

export function useSpotifySearch(query: string, debounceMs = 350) {
  const [data, setData] = useState<SpResults>(empty);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query.trim();
    if (!q) { setData(empty); setError(null); setLoading(false); return; }

    let cancelled = false;
    setLoading(true);
    const handle = setTimeout(async () => {
      try {
        const { data: res, error: fnErr } = await supabase.functions.invoke("spotify-search", {
          body: null,
          // pass query via URL search params
          method: "GET" as any,
          headers: {},
        } as any);
        // supabase-js doesn't support GET query params cleanly; fall back to fetch
        if (fnErr || !res) {
          const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/spotify-search?q=${encodeURIComponent(q)}`;
          const r = await fetch(url, {
            headers: { apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string },
          });
          const json = await r.json();
          if (cancelled) return;
          if (!r.ok) throw new Error(json.error ?? `HTTP ${r.status}`);
          setData(json); setError(null);
        } else {
          if (cancelled) return;
          setData(res as SpResults); setError(null);
        }
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Search failed");
        setData(empty);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, debounceMs);

    return () => { cancelled = true; clearTimeout(handle); };
  }, [query, debounceMs]);

  return { data, loading, error };
}
