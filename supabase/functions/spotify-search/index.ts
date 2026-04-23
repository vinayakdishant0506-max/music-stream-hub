import { corsHeaders } from "@supabase/supabase-js/cors";

let cachedToken: { value: string; exp: number } | null = null;

async function getToken(): Promise<string> {
  const id = Deno.env.get("SPOTIFY_CLIENT_ID");
  const secret = Deno.env.get("SPOTIFY_CLIENT_SECRET");
  if (!id || !secret) throw new Error("Spotify credentials not configured");

  if (cachedToken && cachedToken.exp > Date.now() + 5000) return cachedToken.value;

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + btoa(`${id}:${secret}`),
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) throw new Error(`Spotify token failed [${res.status}]: ${await res.text()}`);
  const json = await res.json();
  cachedToken = { value: json.access_token, exp: Date.now() + json.expires_in * 1000 };
  return cachedToken.value;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const url = new URL(req.url);
    const q = (url.searchParams.get("q") ?? "").trim();
    const type = url.searchParams.get("type") ?? "track,album,artist,playlist";
    const limit = url.searchParams.get("limit") ?? "12";

    if (!q) {
      return new Response(JSON.stringify({ tracks: [], albums: [], artists: [], playlists: [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = await getToken();
    const sp = new URL("https://api.spotify.com/v1/search");
    sp.searchParams.set("q", q);
    sp.searchParams.set("type", type);
    sp.searchParams.set("limit", limit);

    const r = await fetch(sp.toString(), { headers: { Authorization: `Bearer ${token}` } });
    if (!r.ok) {
      const body = await r.text();
      return new Response(JSON.stringify({ error: `Spotify search failed [${r.status}]: ${body}` }), {
        status: r.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const data = await r.json();

    const norm = {
      tracks: (data.tracks?.items ?? []).map((t: any) => ({
        id: t.id,
        name: t.name,
        artists: (t.artists ?? []).map((a: any) => a.name).join(", "),
        album: t.album?.name ?? "",
        cover: t.album?.images?.[0]?.url ?? "",
        duration_ms: t.duration_ms,
        preview_url: t.preview_url,
        external_url: t.external_urls?.spotify,
      })),
      albums: (data.albums?.items ?? []).map((a: any) => ({
        id: a.id,
        name: a.name,
        artists: (a.artists ?? []).map((x: any) => x.name).join(", "),
        cover: a.images?.[0]?.url ?? "",
        external_url: a.external_urls?.spotify,
      })),
      artists: (data.artists?.items ?? []).map((a: any) => ({
        id: a.id,
        name: a.name,
        cover: a.images?.[0]?.url ?? "",
        followers: a.followers?.total ?? 0,
        external_url: a.external_urls?.spotify,
      })),
      playlists: (data.playlists?.items ?? []).filter(Boolean).map((p: any) => ({
        id: p.id,
        name: p.name,
        owner: p.owner?.display_name ?? "",
        cover: p.images?.[0]?.url ?? "",
        external_url: p.external_urls?.spotify,
      })),
    };

    return new Response(JSON.stringify(norm), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("spotify-search error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
