// PKCE helpers + Spotify Authorization Code flow with PKCE
const SPOTIFY_AUTHORIZE = "https://accounts.spotify.com/authorize";

export const SPOTIFY_SCOPES = [
  "user-read-private",
  "user-read-email",
  "user-read-playback-state",
  "user-library-read",
  "user-library-modify",
  "playlist-read-private",
  "playlist-read-collaborative",
  "playlist-modify-private",
  "playlist-modify-public",
  "user-top-read",
].join(" ");

// Public Spotify Client ID — required client-side for the authorize URL.
// Mirrors the SPOTIFY_CLIENT_ID secret used by edge functions.
// We can't read backend secrets from the browser; user supplied it via Vite env or we hardcode.
// Here we expect VITE_SPOTIFY_CLIENT_ID. Fallback handled in UI.
export const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID as string | undefined;

const STORAGE_VERIFIER = "spotify_pkce_verifier";
const STORAGE_STATE = "spotify_pkce_state";

function base64url(bytes: ArrayBuffer | Uint8Array): string {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let str = "";
  for (let i = 0; i < arr.length; i++) str += String.fromCharCode(arr[i]);
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function randomString(len = 64): string {
  const arr = new Uint8Array(len);
  crypto.getRandomValues(arr);
  return base64url(arr).slice(0, len);
}

async function sha256(input: string): Promise<ArrayBuffer> {
  return crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
}

export function getRedirectUri() {
  return `${window.location.origin}/spotify/callback`;
}

export async function startSpotifyAuth(clientId: string) {
  const verifier = randomString(96);
  const state = randomString(24);
  const challenge = base64url(await sha256(verifier));

  sessionStorage.setItem(STORAGE_VERIFIER, verifier);
  sessionStorage.setItem(STORAGE_STATE, state);

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    redirect_uri: getRedirectUri(),
    code_challenge_method: "S256",
    code_challenge: challenge,
    scope: SPOTIFY_SCOPES,
    state,
  });

  window.location.href = `${SPOTIFY_AUTHORIZE}?${params.toString()}`;
}

export function consumePkce(): { verifier: string | null; state: string | null } {
  const verifier = sessionStorage.getItem(STORAGE_VERIFIER);
  const state = sessionStorage.getItem(STORAGE_STATE);
  sessionStorage.removeItem(STORAGE_VERIFIER);
  sessionStorage.removeItem(STORAGE_STATE);
  return { verifier, state };
}