import { useMemo } from "react";
import { PlaylistCard } from "./PlaylistCard";
import { QuickPick } from "./QuickPick";
import { featuredPlaylists, recentlyPlayed, tracks, type Track } from "@/data/library";
import { Play } from "lucide-react";

type Props = {
  onPlayTrack: (t: Track) => void;
};

const greet = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
};

export const MainContent = ({ onPlayTrack }: Props) => {
  const greeting = useMemo(greet, []);
  const quickPicks = recentlyPlayed.slice(0, 6);

  return (
    <div className="px-6 pb-8 pt-2">
      <h1 className="text-3xl font-bold mb-6">{greeting}</h1>

      {/* Quick picks grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
        {quickPicks.map((p, i) => (
          <QuickPick
            key={p.id}
            title={p.title}
            cover={p.cover}
            onPlay={() => onPlayTrack(tracks[i % tracks.length])}
          />
        ))}
      </div>

      {/* Made For You */}
      <Section title="Made For You">
        {featuredPlaylists.map((p, i) => (
          <PlaylistCard
            key={p.id}
            title={p.title}
            desc={p.desc}
            cover={p.cover}
            onPlay={() => onPlayTrack(tracks[i % tracks.length])}
          />
        ))}
      </Section>

      {/* Trending tracks list */}
      <div className="mt-10">
        <div className="flex items-end justify-between mb-4">
          <h2 className="text-2xl font-bold hover:underline cursor-pointer">Trending Now</h2>
          <button className="text-xs text-silver font-bold hover:underline btn-uppercase">Show all</button>
        </div>
        <div className="bg-surface-1/60 rounded-lg overflow-hidden">
          {tracks.map((t, idx) => (
            <button
              key={t.id}
              onClick={() => onPlayTrack(t)}
              className="group grid grid-cols-[24px_1fr_auto] sm:grid-cols-[24px_1fr_1fr_auto] items-center gap-4 px-4 py-2 w-full hover:bg-surface-3 transition-colors text-left"
            >
              <div className="text-silver text-sm tabular-nums w-6 text-center relative">
                <span className="group-hover:hidden">{idx + 1}</span>
                <Play className="h-3.5 w-3.5 fill-current text-foreground hidden group-hover:block absolute inset-0 m-auto" />
              </div>
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={t.cover}
                  alt=""
                  width={40}
                  height={40}
                  loading="lazy"
                  className="h-10 w-10 rounded object-cover shrink-0"
                />
                <div className="min-w-0">
                  <div className="text-sm font-semibold truncate">{t.title}</div>
                  <div className="text-xs text-silver truncate">{t.artist}</div>
                </div>
              </div>
              <div className="hidden sm:block text-xs text-silver truncate">{t.album}</div>
              <div className="text-xs text-silver tabular-nums">{t.duration}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Recently Played */}
      <Section title="Recently Played" className="mt-10">
        {recentlyPlayed.map((p, i) => (
          <PlaylistCard
            key={p.id}
            title={p.title}
            desc={p.desc}
            cover={p.cover}
            onPlay={() => onPlayTrack(tracks[i % tracks.length])}
          />
        ))}
      </Section>
    </div>
  );
};

const Section = ({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <section className={className}>
    <div className="flex items-end justify-between mb-4">
      <h2 className="text-2xl font-bold hover:underline cursor-pointer">{title}</h2>
      <button className="text-xs text-silver font-bold hover:underline btn-uppercase">Show all</button>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1">
      {children}
    </div>
  </section>
);