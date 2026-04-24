import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSpotifyConnection } from "@/hooks/useSpotifyConnection";
import { useAuth } from "@/hooks/useAuth";
import { SPOTIFY_CLIENT_ID, startSpotifyAuth } from "@/lib/spotifyOAuth";
import { Loader2, Music2, Unlink } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const ConnectSpotifyButton = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { connection, loading, disconnect } = useSpotifyConnection();
  const [busy, setBusy] = useState(false);
  const [manualClientId, setManualClientId] = useState("");
  const [askDialog, setAskDialog] = useState(false);

  const begin = async (clientId: string) => {
    setBusy(true);
    try {
      await startSpotifyAuth(clientId);
    } catch (e) {
      setBusy(false);
      toast.error(e instanceof Error ? e.message : "Failed to start Spotify auth");
    }
  };

  const onClick = async () => {
    if (!user) { navigate("/auth"); return; }
    if (SPOTIFY_CLIENT_ID) {
      await begin(SPOTIFY_CLIENT_ID);
    } else {
      setAskDialog(true);
    }
  };

  if (loading) {
    return <Button variant="outline" size="sm" disabled className="rounded-full"><Loader2 className="h-3 w-3 animate-spin" /></Button>;
  }

  if (connection) {
    return (
      <Button
        variant="outline" size="sm"
        onClick={async () => { await disconnect(); toast.success("Disconnected from Spotify"); }}
        className="rounded-full bg-surface-3 border-0 text-foreground hover:bg-surface-3/80 gap-1.5"
      >
        <Unlink className="h-3.5 w-3.5" />
        <span className="text-xs font-bold truncate max-w-[120px]">{connection.display_name ?? "Connected"}</span>
      </Button>
    );
  }

  return (
    <>
      <Button
        size="sm" onClick={onClick} disabled={busy}
        className="rounded-full bg-spotify-green text-black hover:bg-spotify-green/90 gap-1.5 font-bold"
      >
        {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Music2 className="h-3.5 w-3.5" />}
        <span className="text-xs">Connect Spotify</span>
      </Button>

      <Dialog open={askDialog} onOpenChange={setAskDialog}>
        <DialogContent className="bg-surface-2 border-surface-3">
          <DialogHeader>
            <DialogTitle>Spotify Client ID needed</DialogTitle>
            <DialogDescription>
              Paste your Spotify app's Client ID (from the Spotify Developer Dashboard). To skip this prompt next time,
              add <code className="px-1 rounded bg-surface-3">VITE_SPOTIFY_CLIENT_ID</code> to your project env.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="cid">Client ID</Label>
            <Input id="cid" value={manualClientId} onChange={(e) => setManualClientId(e.target.value)} placeholder="abcd1234..." />
          </div>
          <DialogFooter>
            <Button
              onClick={() => { if (manualClientId.trim()) { setAskDialog(false); begin(manualClientId.trim()); } }}
              className="bg-spotify-green text-black hover:bg-spotify-green/90 font-bold"
            >Continue</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};