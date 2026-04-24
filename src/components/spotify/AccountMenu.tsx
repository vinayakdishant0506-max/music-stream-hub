import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

export const AccountMenu = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const initial = (user?.user_metadata?.display_name ?? user?.email ?? "L").toString().charAt(0).toUpperCase();

  if (!user) {
    return (
      <button
        onClick={() => navigate("/auth")}
        className="px-3 py-1.5 rounded-full bg-foreground text-background text-xs font-bold hover:scale-105 transition-transform"
      >
        Sign in
      </button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Account"
          className="h-8 w-8 grid place-items-center rounded-full bg-spotify-green-deep text-primary-foreground font-bold text-sm hover:scale-105 transition-transform"
        >
          {initial}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-surface-2 border-surface-3">
        <DropdownMenuItem disabled className="opacity-70 truncate">{user.email}</DropdownMenuItem>
        <DropdownMenuSeparator className="bg-surface-3" />
        <DropdownMenuItem onClick={() => toast("Profile — coming soon")}>Profile</DropdownMenuItem>
        <DropdownMenuItem onClick={() => toast("Settings — coming soon")}>Settings</DropdownMenuItem>
        <DropdownMenuSeparator className="bg-surface-3" />
        <DropdownMenuItem onClick={async () => { await signOut(); toast.success("Signed out"); }}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
