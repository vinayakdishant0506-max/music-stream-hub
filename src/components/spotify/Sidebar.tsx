import { Home, Search, Library, Plus, Heart, Music2 } from "lucide-react";
import { recentlyPlayed } from "@/data/library";

type Props = {
  active: string;
  onNavigate: (key: string) => void;
};

export const Sidebar = ({ active, onNavigate }: Props) => {
  const navItems = [
    { key: "home", label: "Home", icon: Home },
    { key: "search", label: "Search", icon: Search },
  ];

  return (
    <aside className="hidden md:flex flex-col gap-2 w-[300px] shrink-0 p-2 h-full">
      {/* Top nav */}
      <div className="bg-surface-1 rounded-lg p-2">
        {navItems.map(({ key, label, icon: Icon }) => {
          const isActive = active === key;
          return (
            <button
              key={key}
              onClick={() => onNavigate(key)}
              className={`flex items-center gap-4 w-full px-4 py-3 rounded-md transition-colors ${
                isActive ? "text-foreground" : "text-silver hover:text-foreground"
              }`}
            >
              <Icon className="h-6 w-6" strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-sm ${isActive ? "font-bold" : "font-semibold"}`}>{label}</span>
            </button>
          );
        })}
      </div>

      {/* Library */}
      <div className="bg-surface-1 rounded-lg flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between px-4 py-3 shrink-0">
          <button className="flex items-center gap-3 text-silver hover:text-foreground transition-colors">
            <Library className="h-6 w-6" />
            <span className="text-sm font-bold">Your Library</span>
          </button>
          <button className="h-8 w-8 grid place-items-center rounded-full text-silver hover:text-foreground hover:bg-surface-3 transition-colors">
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {/* Filter pills */}
        <div className="px-4 pb-3 flex gap-2 overflow-x-auto scrollbar-hide shrink-0">
          {["Playlists", "Artists", "Albums"].map((f) => (
            <button
              key={f}
              className="px-3 py-1.5 rounded-full bg-surface-3 text-foreground text-xs font-medium hover:bg-surface-3/80 whitespace-nowrap"
            >
              {f}
            </button>
          ))}
        </div>

        {/* Library list */}
        <div className="overflow-y-auto px-2 pb-2 scrollbar-hide">
          <button className="flex items-center gap-3 w-full p-2 rounded-md hover:bg-surface-3 transition-colors text-left">
            <div className="h-12 w-12 rounded-md bg-gradient-to-br from-spotify-green to-foreground/30 grid place-items-center shrink-0">
              <Heart className="h-5 w-5 text-foreground fill-foreground" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold truncate">Liked Songs</div>
              <div className="text-xs text-silver mt-0.5 flex items-center gap-1.5">
                <span className="text-spotify-green">📌</span> Playlist · 248 songs
              </div>
            </div>
          </button>

          {recentlyPlayed.map((p) => (
            <button
              key={p.id}
              className="flex items-center gap-3 w-full p-2 rounded-md hover:bg-surface-3 transition-colors text-left"
            >
              <img
                src={p.cover}
                alt=""
                width={48}
                height={48}
                loading="lazy"
                className="h-12 w-12 rounded-md object-cover shrink-0"
              />
              <div className="min-w-0">
                <div className="text-sm font-semibold truncate">{p.title}</div>
                <div className="text-xs text-silver mt-0.5 truncate flex items-center gap-1">
                  <Music2 className="h-3 w-3" /> Playlist · You
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};