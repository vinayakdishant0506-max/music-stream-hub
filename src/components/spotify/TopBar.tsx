import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { NotificationsPopover } from "./NotificationsPopover";
import { FriendActivityPopover } from "./FriendActivityPopover";
import { AccountMenu } from "./AccountMenu";

type Props = {
  view: string;
  query: string;
  onQueryChange: (q: string) => void;
  onFocusSearch: () => void;
  onBack?: () => void;
  onForward?: () => void;
};

export const TopBar = ({ view, query, onQueryChange, onFocusSearch, onBack, onForward }: Props) => {
  const showSearch = view === "search";
  return (
    <header className="flex items-center gap-3 px-6 py-3 sticky top-0 z-10 bg-surface-base/70 backdrop-blur-md">
      <div className="flex items-center gap-2 shrink-0">
        <button onClick={onBack} aria-label="Back" className="h-8 w-8 grid place-items-center rounded-full bg-black/40 text-foreground hover:bg-black/60">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button onClick={onForward} aria-label="Forward" className="h-8 w-8 grid place-items-center rounded-full bg-black/40 text-silver hover:bg-black/60">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {showSearch && (
        <div className="flex-1 max-w-[420px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-silver pointer-events-none" />
            <input
              autoFocus
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              onFocus={onFocusSearch}
              placeholder="What do you want to play?"
              className="w-full h-10 rounded-full bg-surface-3 pl-10 pr-9 text-sm text-foreground placeholder:text-silver outline-none focus:ring-2 focus:ring-foreground/40"
            />
            {query && (
              <button
                onClick={() => onQueryChange("")}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 grid place-items-center rounded-full text-silver hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 ml-auto">
        <button className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 text-silver hover:text-foreground text-xs font-bold">
          <span>Explore Premium</span>
        </button>
        <NotificationsPopover />
        <FriendActivityPopover />
        <AccountMenu />
      </div>
    </header>
  );
};