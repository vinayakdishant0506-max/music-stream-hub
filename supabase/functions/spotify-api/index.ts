import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SPOTIFY_API = "https://api.spotify.com/v1";

async function refreshAccessToken(refresh_token: string) {
  const clientId = Deno.env.get("SPOTIFY_CLIENT_ID")!;
  const clientSecret = Deno.env.get("SPOTIFY_CLIENT_SECRET")!;
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + btoa(`${clientId}:${clientSecret}`),
    },
    body: new URLSearchParams({ grant_type: "refresh_token", refresh_token }),
  });
  if (!res.ok) throw new Error(`Refresh failed [${res.status}]: ${await res.text()}`);
  return await res.json() as { access_token: string; expires_in: number; refresh_token?: string; scope?: string };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: claimsData, error: claimsErr } = await supabase.auth.getClaims(authHeader.replace("Bearer ", ""));
    if (claimsErr || !claimsData?.claims?.sub) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = claimsData.claims.sub;

    const url = new URL(req.url);
    // path is everything after "/spotify-api"
    let path = url.searchParams.get("path") ?? "";
    if (!path) {
      return new Response(JSON.stringify({ error: "Missing 'path' query parameter (e.g. ?path=/me/playlists)" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!path.startsWith("/")) path = "/" + path;

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: conn, error: connErr } = await admin
      .from("spotify_connections")
      .select("access_token, refresh_token, expires_at")
      .eq("user_id", userId)
      .maybeSingle();

    if (connErr) throw connErr;
    if (!conn) {
      return new Response(JSON.stringify({ error: "Spotify not connected", code: "NOT_CONNECTED" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let accessToken = conn.access_token;
    const expiresAt = new Date(conn.expires_at).getTime();
    if (expiresAt - Date.now() < 60_000) {
      const refreshed = await refreshAccessToken(conn.refresh_token);
      accessToken = refreshed.access_token;
      const newExpiry = new Date(Date.now() + refreshed.expires_in * 1000).toISOString();
      await admin
        .from("spotify_connections")
        .update({
          access_token: refreshed.access_token,
          refresh_token: refreshed.refresh_token ?? conn.refresh_token,
          expires_at: newExpiry,
        })
        .eq("user_id", userId);
    }

    // Forward query params (everything except `path`) to Spotify
    const forwardParams = new URLSearchParams();
    for (const [k, v] of url.searchParams.entries()) {
      if (k !== "path") forwardParams.set(k, v);
    }
    const qs = forwardParams.toString();
    const targetUrl = `${SPOTIFY_API}${path}${qs ? `?${qs}` : ""}`;

    const init: RequestInit = {
      method: req.method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    };
    if (req.method !== "GET" && req.method !== "HEAD") {
      const text = await req.text();
      if (text) init.body = text;
    }

    const sp = await fetch(targetUrl, init);
    const ct = sp.headers.get("Content-Type") ?? "application/json";
    const body = await sp.text();
    return new Response(body || "{}", {
      status: sp.status,
      headers: { ...corsHeaders, "Content-Type": ct },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("spotify-api error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});