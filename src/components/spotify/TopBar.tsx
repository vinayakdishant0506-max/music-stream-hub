import { ChevronLeft, ChevronRight, Bell, Users } from "lucide-react";

export const TopBar = () => {
  return (
    <header className="flex items-center justify-between px-6 py-3 sticky top-0 z-10 bg-surface-base/70 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <button className="h-8 w-8 grid place-items-center rounded-full bg-black/40 text-foreground hover:bg-black/60">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button className="h-8 w-8 grid place-items-center rounded-full bg-black/40 text-silver hover:bg-black/60">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
      <div className="flex items-center gap-2">
        <button className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 text-silver hover:text-foreground text-xs font-bold">
          <span>Explore Premium</span>
        </button>
        <button className="h-9 w-9 grid place-items-center rounded-full bg-black/40 text-silver hover:text-foreground">
          <Bell className="h-4 w-4" />
        </button>
        <button className="h-9 w-9 grid place-items-center rounded-full bg-black/40 text-silver hover:text-foreground">
          <Users className="h-4 w-4" />
        </button>
        <button className="h-8 w-8 grid place-items-center rounded-full bg-spotify-green-deep text-primary-foreground font-bold text-sm">
          L
        </button>
      </div>
    </header>
  );
};