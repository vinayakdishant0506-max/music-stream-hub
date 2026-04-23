import {
  Heart,
  Shuffle,
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Repeat,
  Mic2,
  ListMusic,
  Laptop2,
  Volume2,
  Maximize2,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { Track } from "@/data/library";

type Props = {
  track: Track;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
};

const parseDuration = (d: string) => {
  const [m, s] = d.split(":").map(Number);
  return m * 60 + s;
};

const fmt = (sec: number) => {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

export const Player = ({ track, isPlaying, onTogglePlay, onNext, onPrev }: Props) => {
  const total = parseDuration(track.duration);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(70);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    setProgress(0);
  }, [track.id]);

  useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(() => {
      setProgress((p) => {
        if (p >= total) {
          onNext();
          return 0;
        }
        return p + 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [isPlaying, total, onNext]);

  const pct = (progress / total) * 100;

  return (
    <footer className="h-[88px] bg-surface-base border-t border-white/5 px-4 flex items-center gap-4 shrink-0">
      {/* Track info */}
      <div className="flex items-center gap-3 w-[30%] min-w-0">
        <img
          src={track.cover}
          alt={track.album}
          width={56}
          height={56}
          loading="lazy"
          className="h-14 w-14 rounded object-cover shrink-0"
        />
        <div className="min-w-0">
          <div className="text-sm font-semibold truncate hover:underline cursor-pointer">{track.title}</div>
          <div className="text-xs text-silver truncate hover:underline cursor-pointer">{track.artist}</div>
        </div>
        <button
          onClick={() => setLiked((l) => !l)}
          className={`ml-2 h-8 w-8 grid place-items-center transition-colors ${
            liked ? "text-spotify-green" : "text-silver hover:text-foreground"
          }`}
          aria-label="Save to liked"
        >
          <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
        </button>
      </div>

      {/* Controls */}
      <div className="flex-1 flex flex-col items-center gap-2 max-w-[722px] mx-auto">
        <div className="flex items-center gap-4">
          <button className="text-silver hover:text-foreground" aria-label="Shuffle">
            <Shuffle className="h-4 w-4" />
          </button>
          <button onClick={onPrev} className="text-silver hover:text-foreground" aria-label="Previous">
            <SkipBack className="h-5 w-5 fill-current" />
          </button>
          <button
            onClick={onTogglePlay}
            className="h-8 w-8 rounded-full bg-foreground text-background grid place-items-center hover:scale-105 transition-transform"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current ml-0.5" />}
          </button>
          <button onClick={onNext} className="text-silver hover:text-foreground" aria-label="Next">
            <SkipForward className="h-5 w-5 fill-current" />
          </button>
          <button className="text-silver hover:text-foreground" aria-label="Repeat">
            <Repeat className="h-4 w-4" />
          </button>
        </div>
        <div className="flex items-center gap-2 w-full">
          <span className="text-[11px] text-silver tabular-nums w-9 text-right">{fmt(progress)}</span>
          <div
            className="group relative flex-1 h-1 bg-surface-3 rounded-full cursor-pointer"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const ratio = (e.clientX - rect.left) / rect.width;
              setProgress(Math.max(0, Math.min(total, ratio * total)));
            }}
          >
            <div
              className="absolute inset-y-0 left-0 bg-foreground group-hover:bg-spotify-green rounded-full"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-[11px] text-silver tabular-nums w-9">{track.duration}</span>
        </div>
      </div>

      {/* Right controls */}
      <div className="hidden md:flex items-center gap-2 w-[30%] justify-end text-silver">
        <button className="hover:text-foreground" aria-label="Lyrics"><Mic2 className="h-4 w-4" /></button>
        <button className="hover:text-foreground" aria-label="Queue"><ListMusic className="h-4 w-4" /></button>
        <button className="hover:text-foreground" aria-label="Devices"><Laptop2 className="h-4 w-4" /></button>
        <Volume2 className="h-4 w-4" />
        <div
          className="group w-24 h-1 bg-surface-3 rounded-full cursor-pointer relative"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const ratio = (e.clientX - rect.left) / rect.width;
            setVolume(Math.max(0, Math.min(100, ratio * 100)));
          }}
        >
          <div className="absolute inset-y-0 left-0 bg-foreground group-hover:bg-spotify-green rounded-full" style={{ width: `${volume}%` }} />
        </div>
        <button className="hover:text-foreground" aria-label="Fullscreen"><Maximize2 className="h-4 w-4" /></button>
      </div>
    </footer>
  );
};