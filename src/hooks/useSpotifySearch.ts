import { useEffect, useState } from "react";

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

    const ctrl = new AbortController();
    setLoading(true);
    const handle = setTimeout(async () => {
      try {
        const base = import.meta.env.VITE_SUPABASE_URL as string;
        const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;
        const url = `${base}/functions/v1/spotify-search?q=${encodeURIComponent(q)}`;
        const r = await fetch(url, {
          signal: ctrl.signal,
          headers: { apikey: key, Authorization: `Bearer ${key}` },
        });
        const json = await r.json();
        if (!r.ok) throw new Error(json?.error ?? `HTTP ${r.status}`);
        setData(json);
        setError(null);
      } catch (e) {
        if ((e as any)?.name === "AbortError") return;
        setError(e instanceof Error ? e.message : "Search failed");
        setData(empty);
      } finally {
        setLoading(false);
      }
    }, debounceMs);

    return () => { ctrl.abort(); clearTimeout(handle); };
  }, [query, debounceMs]);

  return { data, loading, error };
}
