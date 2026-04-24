import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { consumePkce, getRedirectUri } from "@/lib/spotifyOAuth";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function SpotifyCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"working" | "error">("working");
  const [message, setMessage] = useState("Connecting your Spotify account…");

  useEffect(() => {
    (async () => {
      try {
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");
        const state = url.searchParams.get("state");
        const error = url.searchParams.get("error");
        if (error) throw new Error(error);
        if (!code) throw new Error("Missing authorization code");

        const { verifier, state: storedState } = consumePkce();
        if (!verifier) throw new Error("Missing PKCE verifier — please retry connecting from the app.");
        if (!storedState || storedState !== state) throw new Error("State mismatch — possible CSRF, please retry.");

        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          // Send them to auth page; preserve nothing because PKCE was consumed
          throw new Error("You must be signed in to link Spotify.");
        }

        const base = import.meta.env.VITE_SUPABASE_URL as string;
        const res = await fetch(`${base}/functions/v1/spotify-oauth-callback`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string,
          },
          body: JSON.stringify({ code, code_verifier: verifier, redirect_uri: getRedirectUri() }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error ?? `Failed [${res.status}]`);

        toast.success(`Connected as ${json.display_name ?? json.spotify_user_id ?? "Spotify user"}`);
        navigate("/", { replace: true });
      } catch (e) {
        const m = e instanceof Error ? e.message : "Failed to connect Spotify";
        setMessage(m);
        setStatus("error");
        toast.error(m);
      }
    })();
  }, [navigate]);

  return (
    <div className="min-h-screen grid place-items-center bg-black text-foreground px-4">
      <div className="text-center max-w-md">
        {status === "working" ? (
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-spotify-green" />
        ) : (
          <div className="text-destructive mb-4">⚠️</div>
        )}
        <p className="text-sm text-silver mb-4">{message}</p>
        {status === "error" && (
          <button onClick={() => navigate("/")} className="text-spotify-green font-bold hover:underline text-sm">
            Back to home
          </button>
        )}
      </div>
    </div>
  );
}