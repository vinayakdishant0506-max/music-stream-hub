import { useState } from "react";
import { Sidebar } from "@/components/spotify/Sidebar";
import { TopBar } from "@/components/spotify/TopBar";
import { MainContent } from "@/components/spotify/MainContent";
import { Player } from "@/components/spotify/Player";
import { tracks, type Track } from "@/data/library";

const Index = () => {
  const [active, setActive] = useState("home");
  const [currentTrack, setCurrentTrack] = useState<Track>(tracks[0]);
  const [isPlaying, setIsPlaying] = useState(false);

  const playTrack = (t: Track) => {
    setCurrentTrack(t);
    setIsPlaying(true);
  };

  const next = () => {
    const idx = tracks.findIndex((t) => t.id === currentTrack.id);
    setCurrentTrack(tracks[(idx + 1) % tracks.length]);
    setIsPlaying(true);
  };

  const prev = () => {
    const idx = tracks.findIndex((t) => t.id === currentTrack.id);
    setCurrentTrack(tracks[(idx - 1 + tracks.length) % tracks.length]);
    setIsPlaying(true);
  };

  return (
    <div className="h-screen flex flex-col bg-black text-foreground overflow-hidden">
      <div className="flex-1 flex min-h-0">
        <Sidebar active={active} onNavigate={setActive} />
        <main className="flex-1 m-2 ml-0 md:ml-0 rounded-lg overflow-hidden bg-gradient-to-b from-surface-3 via-surface-base to-surface-base flex flex-col">
          <TopBar />
          <div className="overflow-y-auto flex-1 scrollbar-hide">
            <MainContent onPlayTrack={playTrack} />
          </div>
        </main>
      </div>
      <Player
        track={currentTrack}
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying((p) => !p)}
        onNext={next}
        onPrev={prev}
      />
    </div>
  );
};

export default Index;
