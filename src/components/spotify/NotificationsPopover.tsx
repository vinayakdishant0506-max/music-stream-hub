import { Bell } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const items = [
  { id: 1, title: "New release from Voyager 88", time: "2h ago" },
  { id: 2, title: "Mira Hale just dropped 'Soft Geometry'", time: "Yesterday" },
  { id: 3, title: "Your Discover Weekly is ready", time: "Mon" },
];

export const NotificationsPopover = () => (
  <Popover>
    <PopoverTrigger asChild>
      <button
        aria-label="Notifications"
        className="h-9 w-9 grid place-items-center rounded-full bg-black/40 text-silver hover:text-foreground"
      >
        <Bell className="h-4 w-4" />
      </button>
    </PopoverTrigger>
    <PopoverContent align="end" className="w-80 bg-surface-2 border-surface-3 p-0">
      <div className="px-4 py-3 border-b border-surface-3">
        <div className="text-sm font-bold">What's New</div>
      </div>
      <ul className="py-2">
        {items.map((n) => (
          <li key={n.id} className="px-4 py-2 hover:bg-surface-3 cursor-pointer">
            <div className="text-sm font-semibold truncate">{n.title}</div>
            <div className="text-xs text-silver mt-0.5">{n.time}</div>
          </li>
        ))}
      </ul>
    </PopoverContent>
  </Popover>
);
