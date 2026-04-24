import { supabase } from "@/integrations/supabase/client";

/** Call the user-scoped Spotify proxy. `path` is the Spotify endpoint (e.g. "/me/playlists"). */
export async function spotifyApi<T = any>(
  path: string,
  opts: { method?: string; query?: Record<string, string | number>; body?: unknown } = {},
): Promise<T> {
  const { method = "GET", query, body } = opts;

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("Not authenticated");

  const base = import.meta.env.VITE_SUPABASE_URL as string;
  const url = new URL(`${base}/functions/v1/spotify-api`);
  url.searchParams.set("path", path);
  if (query) for (const [k, v] of Object.entries(query)) url.searchParams.set(k, String(v));

  const res = await fetch(url.toString(), {
    method,
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string,
      "Content-Type": "application/json",
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  const json = text ? JSON.parse(text) : {};
  if (!res.ok) {
    const msg = json?.error ?? `Spotify request failed [${res.status}]`;
    const err = new Error(typeof msg === "string" ? msg : JSON.stringify(msg)) as Error & { status: number; code?: string };
    err.status = res.status;
    err.code = json?.code;
    throw err;
  }
  return json as T;
}