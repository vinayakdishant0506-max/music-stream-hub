import { useRef, useState } from "react";
import { Sidebar } from "@/components/spotify/Sidebar";
import { TopBar } from "@/components/spotify/TopBar";
import { MainContent } from "@/components/spotify/MainContent";
import { SearchView } from "@/components/spotify/SearchView";
import { LibraryView } from "@/components/spotify/LibraryView";
import { Player } from "@/components/spotify/Player";
import { tracks, type Track } from "@/data/library";

const Index = () => {
  const [active, setActive] = useState("home");
  const [query, setQuery] = useState("");
  const [currentTrack, setCurrentTrack] = useState<Track>(tracks[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const historyRef = useRef<string[]>(["home"]);
  const cursorRef = useRef(0);

  const navigate = (key: string) => {
    if (key === active) return;
    historyRef.current = historyRef.current.slice(0, cursorRef.current + 1);
    historyRef.current.push(key);
    cursorRef.current = historyRef.current.length - 1;
    setActive(key);
  };

  const goBack = () => {
    if (cursorRef.current > 0) {
      cursorRef.current -= 1;
      setActive(historyRef.current[cursorRef.current]);
    }
  };
  const goForward = () => {
    if (cursorRef.current < historyRef.current.length - 1) {
      cursorRef.current += 1;
      setActive(historyRef.current[cursorRef.current]);
    }
  };

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
        <Sidebar active={active} onNavigate={navigate} />
        <main className="flex-1 m-2 ml-0 md:ml-0 rounded-lg overflow-hidden bg-gradient-to-b from-surface-3 via-surface-base to-surface-base flex flex-col">
          <TopBar
            view={active}
            query={query}
            onQueryChange={setQuery}
            onFocusSearch={() => active !== "search" && navigate("search")}
            onBack={goBack}
            onForward={goForward}
          />
          <div className="overflow-y-auto flex-1 scrollbar-hide">
            {active === "search" ? (
              <SearchView query={query} onPlayTrack={playTrack} />
            ) : active === "library" ? (
              <LibraryView />
            ) : (
              <MainContent onPlayTrack={playTrack} />
            )}
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
