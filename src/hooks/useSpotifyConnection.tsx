import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export type SpotifyConnection = {
  spotify_user_id: string | null;
  display_name: string | null;
  avatar_url: string | null;
  scope: string;
  expires_at: string;
};

export function useSpotifyConnection() {
  const { user } = useAuth();
  const [connection, setConnection] = useState<SpotifyConnection | null>(null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) { setConnection(null); return; }
    setLoading(true);
    const { data, error } = await supabase
      .from("spotify_connections")
      .select("spotify_user_id, display_name, avatar_url, scope, expires_at")
      .eq("user_id", user.id)
      .maybeSingle();
    if (error) console.error("spotify_connections fetch:", error);
    setConnection(data ?? null);
    setLoading(false);
  }, [user]);

  useEffect(() => { refresh(); }, [refresh]);

  const disconnect = async () => {
    if (!user) return;
    await supabase.from("spotify_connections").delete().eq("user_id", user.id);
    setConnection(null);
  };

  return { connection, loading, refresh, disconnect, isConnected: !!connection };
}