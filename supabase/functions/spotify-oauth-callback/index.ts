import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

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

    const body = await req.json().catch(() => ({}));
    const code: string = body?.code ?? "";
    const redirect_uri: string = body?.redirect_uri ?? "";
    const code_verifier: string = body?.code_verifier ?? "";
    if (!code || !redirect_uri || !code_verifier) {
      return new Response(JSON.stringify({ error: "Missing code, redirect_uri, or code_verifier" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const clientId = Deno.env.get("SPOTIFY_CLIENT_ID")!;
    const clientSecret = Deno.env.get("SPOTIFY_CLIENT_SECRET")!;

    const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + btoa(`${clientId}:${clientSecret}`),
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri,
        code_verifier,
      }),
    });
    if (!tokenRes.ok) {
      const text = await tokenRes.text();
      return new Response(JSON.stringify({ error: `Token exchange failed [${tokenRes.status}]: ${text}` }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const tokens = await tokenRes.json();

    // Fetch Spotify profile
    const meRes = await fetch("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const me = meRes.ok ? await meRes.json() : {};

    const expires_at = new Date(Date.now() + (tokens.expires_in ?? 3600) * 1000).toISOString();

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { error: upsertErr } = await admin
      .from("spotify_connections")
      .upsert({
        user_id: userId,
        spotify_user_id: me.id ?? null,
        display_name: me.display_name ?? null,
        avatar_url: me.images?.[0]?.url ?? null,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        scope: tokens.scope ?? "",
        expires_at,
      }, { onConflict: "user_id" });

    if (upsertErr) {
      return new Response(JSON.stringify({ error: upsertErr.message }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({
      ok: true,
      spotify_user_id: me.id ?? null,
      display_name: me.display_name ?? null,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("spotify-oauth-callback error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});