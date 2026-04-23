import { Users } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const friends = [
  { id: 1, name: "Alex", track: "Neon Horizon", artist: "Voyager 88", time: "now" },
  { id: 2, name: "Sam",  track: "Two AM Brass", artist: "August Quartet", time: "12m" },
  { id: 3, name: "Jules", track: "Paper Cranes", artist: "Mira Hale", time: "1h" },
];

export const FriendActivityPopover = () => (
  <Popover>
    <PopoverTrigger asChild>
      <button
        aria-label="Friend Activity"
        className="h-9 w-9 grid place-items-center rounded-full bg-black/40 text-silver hover:text-foreground"
      >
        <Users className="h-4 w-4" />
      </button>
    </PopoverTrigger>
    <PopoverContent align="end" className="w-80 bg-surface-2 border-surface-3 p-0">
      <div className="px-4 py-3 border-b border-surface-3">
        <div className="text-sm font-bold">Friend Activity</div>
      </div>
      <ul className="py-2">
        {friends.map((f) => (
          <li key={f.id} className="px-4 py-2 hover:bg-surface-3 flex gap-3 items-start cursor-pointer">
            <div className="h-9 w-9 rounded-full bg-spotify-green-deep text-primary-foreground grid place-items-center text-xs font-bold shrink-0">
              {f.name[0]}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold flex justify-between gap-2">
                <span className="truncate">{f.name}</span>
                <span className="text-xs text-silver shrink-0">{f.time}</span>
              </div>
              <div className="text-xs text-silver truncate">{f.track} • {f.artist}</div>
            </div>
          </li>
        ))}
      </ul>
    </PopoverContent>
  </Popover>
);
