import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useSpotifyConnection } from "@/hooks/useSpotifyConnection";
import { spotifyApi } from "@/hooks/useSpotifyApi";
import { Loader2, Music2, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

type Playlist = {
  id: string;
  name: string;
  images: { url: string }[];
  owner: { display_name: string };
  tracks: { total: number };
  external_urls: { spotify: string };
};

type SavedTrack = {
  added_at: string;
  track: {
    id: string; name: string;
    artists: { name: string }[];
    album: { name: string; images: { url: string }[] };
    external_urls: { spotify: string };
  };
};

export const LibraryView = () => {
  const { user, loading: authLoading } = useAuth();
  const { connection, loading: connLoading } = useSpotifyConnection();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [liked, setLiked] = useState<SavedTrack[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !connection) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [pls, sav] = await Promise.all([
          spotifyApi<{ items: Playlist[] }>("/me/playlists", { query: { limit: 30 } }),
          spotifyApi<{ items: SavedTrack[] }>("/me/tracks", { query: { limit: 20 } }),
        ]);
        if (cancelled) return;
        setPlaylists((pls.items ?? []).filter(Boolean));
        setLiked(sav.items ?? []);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load library");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [user, connection]);

  if (authLoading) return <div className="px-6 py-12"><Loader2 className="h-5 w-5 animate-spin text-silver" /></div>;

  if (!user) {
    return (
      <EmptyState title="Sign in to see your library" cta={<Link to="/auth" className="px-4 py-2 rounded-full bg-spotify-green text-black font-bold text-sm">Sign in</Link>} />
    );
  }

  if (connLoading) return <div className="px-6 py-12"><Loader2 className="h-5 w-5 animate-spin text-silver" /></div>;

  if (!connection) {
    return (
      <EmptyState
        title="Connect Spotify to see your playlists"
        body="Click 'Connect Spotify' in the top bar to link your account."
      />
    );
  }

  return (
    <div className="px-6 pb-8 pt-2">
      <h1 className="text-3xl font-bold mb-6">Your Library</h1>

      {error && <div className="mb-6 p-4 rounded-md bg-destructive/10 text-destructive text-sm">{error}</div>}
      {loading && <Loader2 className="h-5 w-5 animate-spin text-silver mb-4" />}

      <section className="mb-10">
        <h2 className="text-xl font-bold mb-4">Your Playlists</h2>
        {!loading && playlists.length === 0 && <p className="text-silver text-sm">No playlists yet.</p>}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {playlists.map((p) => (
            <a key={p.id} href={p.external_urls?.spotify} target="_blank" rel="noreferrer"
              className="bg-surface-1 hover:bg-surface-3 transition-colors p-4 rounded-md block">
              {p.images?.[0]?.url
                ? <img src={p.images[0].url} alt={p.name} className="w-full aspect-square rounded-md object-cover shadow-medium mb-3" />
                : <div className="w-full aspect-square rounded-md bg-surface-3 grid place-items-center mb-3"><Music2 className="h-8 w-8 text-silver" /></div>}
              <h3 className="text-sm font-bold truncate flex items-center gap-1">{p.name} <ExternalLink className="h-3 w-3 text-silver" /></h3>
              <p className="text-xs text-silver mt-1 truncate">{p.tracks?.total ?? 0} tracks · {p.owner?.display_name}</p>
            </a>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">Liked Songs</h2>
        {!loading && liked.length === 0 && <p className="text-silver text-sm">No liked songs yet.</p>}
        <div className="bg-surface-1/60 rounded-lg overflow-hidden">
          {liked.map((s, idx) => (
            <a key={s.track.id} href={s.track.external_urls?.spotify} target="_blank" rel="noreferrer"
              className="grid grid-cols-[24px_1fr_auto] items-center gap-4 px-4 py-2 hover:bg-surface-3 transition-colors">
              <div className="text-silver text-sm tabular-nums w-6 text-center">{idx + 1}</div>
              <div className="flex items-center gap-3 min-w-0">
                {s.track.album?.images?.[0]?.url
                  ? <img src={s.track.album.images[0].url} alt="" className="h-10 w-10 rounded object-cover shrink-0" />
                  : <div className="h-10 w-10 rounded bg-surface-3 shrink-0" />}
                <div className="min-w-0">
                  <div className="text-sm font-semibold truncate">{s.track.name}</div>
                  <div className="text-xs text-silver truncate">{s.track.artists?.map(a => a.name).join(", ")}</div>
                </div>
              </div>
              <ExternalLink className="h-3 w-3 text-silver" />
            </a>
          ))}
        </div>
      </section>
    </div>
  );
};

const EmptyState = ({ title, body, cta }: { title: string; body?: string; cta?: React.ReactNode }) => (
  <div className="px-6 py-16 text-center">
    <Music2 className="h-12 w-12 mx-auto text-silver mb-4" />
    <h2 className="text-2xl font-bold mb-2">{title}</h2>
    {body && <p className="text-silver mb-6 max-w-md mx-auto">{body}</p>}
    {cta}
  </div>
);