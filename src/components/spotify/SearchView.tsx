import { useSpotifySearch, type SpTrack } from "@/hooks/useSpotifySearch";
import { Play, ExternalLink, Loader2 } from "lucide-react";
import type { Track } from "@/data/library";

const fmt = (ms: number) => {
  const s = Math.round(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

const toLocalTrack = (t: SpTrack): Track => ({
  id: t.id,
  title: t.name,
  artist: t.artists,
  album: t.album,
  cover: t.cover || "/placeholder.svg",
  duration: fmt(t.duration_ms),
});

type Props = {
  query: string;
  onPlayTrack: (t: Track) => void;
};

export const SearchView = ({ query, onPlayTrack }: Props) => {
  const { data, loading, error } = useSpotifySearch(query);
  const q = query.trim();

  if (!q) {
    return (
      <div className="px-6 py-12">
        <h1 className="text-3xl font-bold mb-2">Search</h1>
        <p className="text-silver">Find your next favorite song, artist or playlist.</p>
      </div>
    );
  }

  return (
    <div className="px-6 pb-8 pt-2">
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold">Results for "{q}"</h1>
        {loading && <Loader2 className="h-4 w-4 animate-spin text-silver" />}
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-md bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      {!error && !loading && data.tracks.length === 0 && data.artists.length === 0 && (
        <p className="text-silver">No results found.</p>
      )}

      {data.tracks.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">Songs</h2>
          <div className="bg-surface-1/60 rounded-lg overflow-hidden">
            {data.tracks.slice(0, 8).map((t, idx) => (
              <button
                key={t.id}
                onClick={() => onPlayTrack(toLocalTrack(t))}
                className="group grid grid-cols-[24px_1fr_auto] sm:grid-cols-[24px_1fr_1fr_auto] items-center gap-4 px-4 py-2 w-full hover:bg-surface-3 transition-colors text-left"
              >
                <div className="text-silver text-sm tabular-nums w-6 text-center relative">
                  <span className="group-hover:hidden">{idx + 1}</span>
                  <Play className="h-3.5 w-3.5 fill-current text-foreground hidden group-hover:block absolute inset-0 m-auto" />
                </div>
                <div className="flex items-center gap-3 min-w-0">
                  {t.cover ? (
                    <img src={t.cover} alt="" width={40} height={40} loading="lazy" className="h-10 w-10 rounded object-cover shrink-0" />
                  ) : (
                    <div className="h-10 w-10 rounded bg-surface-3 shrink-0" />
                  )}
                  <div className="min-w-0">
                    <div className="text-sm font-semibold truncate">{t.name}</div>
                    <div className="text-xs text-silver truncate">{t.artists}</div>
                  </div>
                </div>
                <div className="hidden sm:block text-xs text-silver truncate">{t.album}</div>
                <div className="text-xs text-silver tabular-nums">{fmt(t.duration_ms)}</div>
              </button>
            ))}
          </div>
        </section>
      )}

      {data.artists.length > 0 && (
        <Section title="Artists">
          {data.artists.slice(0, 6).map((a) => (
            <a key={a.id} href={a.external_url} target="_blank" rel="noreferrer"
              className="group bg-surface-1 hover:bg-surface-3 transition-colors p-4 rounded-md cursor-pointer block">
              {a.cover
                ? <img src={a.cover} alt={a.name} className="w-full aspect-square rounded-full object-cover shadow-medium mb-4" />
                : <div className="w-full aspect-square rounded-full bg-surface-3 mb-4" />}
              <h3 className="text-sm font-bold truncate">{a.name}</h3>
              <p className="text-xs text-silver mt-1">Artist</p>
            </a>
          ))}
        </Section>
      )}

      {data.albums.length > 0 && (
        <Section title="Albums" className="mt-10">
          {data.albums.slice(0, 6).map((a) => (
            <a key={a.id} href={a.external_url} target="_blank" rel="noreferrer"
              className="group bg-surface-1 hover:bg-surface-3 transition-colors p-4 rounded-md cursor-pointer block">
              {a.cover
                ? <img src={a.cover} alt={a.name} className="w-full aspect-square rounded-md object-cover shadow-medium mb-4" />
                : <div className="w-full aspect-square rounded-md bg-surface-3 mb-4" />}
              <h3 className="text-sm font-bold truncate">{a.name}</h3>
              <p className="text-xs text-silver mt-1 truncate">{a.artists}</p>
            </a>
          ))}
        </Section>
      )}

      {data.playlists.length > 0 && (
        <Section title="Playlists" className="mt-10">
          {data.playlists.slice(0, 6).map((p) => (
            <a key={p.id} href={p.external_url} target="_blank" rel="noreferrer"
              className="group bg-surface-1 hover:bg-surface-3 transition-colors p-4 rounded-md cursor-pointer block">
              {p.cover
                ? <img src={p.cover} alt={p.name} className="w-full aspect-square rounded-md object-cover shadow-medium mb-4" />
                : <div className="w-full aspect-square rounded-md bg-surface-3 mb-4" />}
              <h3 className="text-sm font-bold truncate flex items-center gap-1">
                {p.name} <ExternalLink className="h-3 w-3 text-silver" />
              </h3>
              <p className="text-xs text-silver mt-1 truncate">By {p.owner}</p>
            </a>
          ))}
        </Section>
      )}
    </div>
  );
};

const Section = ({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) => (
  <section className={className}>
    <h2 className="text-xl font-bold mb-4">{title}</h2>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">{children}</div>
  </section>
);
