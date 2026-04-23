import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export const AccountMenu = () => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <button
        aria-label="Account"
        className="h-8 w-8 grid place-items-center rounded-full bg-spotify-green-deep text-primary-foreground font-bold text-sm hover:scale-105 transition-transform"
      >
        L
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-56 bg-surface-2 border-surface-3">
      <DropdownMenuItem onClick={() => toast("Account — coming soon")}>Account</DropdownMenuItem>
      <DropdownMenuItem onClick={() => toast("Profile — coming soon")}>Profile</DropdownMenuItem>
      <DropdownMenuItem onClick={() => toast("Settings — coming soon")}>Settings</DropdownMenuItem>
      <DropdownMenuSeparator className="bg-surface-3" />
      <DropdownMenuItem onClick={() => toast("Log out — sign-in not enabled yet")}>Log out</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);
