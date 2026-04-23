import album1 from "@/assets/album-1.jpg";
import album2 from "@/assets/album-2.jpg";
import album3 from "@/assets/album-3.jpg";
import album4 from "@/assets/album-4.jpg";
import album5 from "@/assets/album-5.jpg";
import album6 from "@/assets/album-6.jpg";

export const covers = [album1, album2, album3, album4, album5, album6];

export type Track = {
  id: string;
  title: string;
  artist: string;
  album: string;
  cover: string;
  duration: string;
};

export const featuredPlaylists = [
  { id: "p1", title: "Midnight Drive", desc: "Synthwave for empty highways", cover: album2 },
  { id: "p2", title: "Sunset Lounge", desc: "Warm chords and golden hour", cover: album1 },
  { id: "p3", title: "Pastel Mornings", desc: "Soft indie to start the day", cover: album3 },
  { id: "p4", title: "Circuit Breaker", desc: "High-voltage electronic", cover: album4 },
  { id: "p5", title: "Gold Standard", desc: "Modern hip hop heat", cover: album5 },
  { id: "p6", title: "Smoke & Brass", desc: "Late-night jazz sessions", cover: album6 },
];

export const recentlyPlayed = [
  { id: "r1", title: "Daily Mix 1", desc: "Made for you", cover: album1 },
  { id: "r2", title: "Discover Weekly", desc: "Your weekly mixtape", cover: album2 },
  { id: "r3", title: "Liked Songs", desc: "248 songs", cover: album3 },
  { id: "r4", title: "Release Radar", desc: "New from artists you follow", cover: album4 },
  { id: "r5", title: "Chill Hits", desc: "Kick back to the best", cover: album5 },
  { id: "r6", title: "Jazz Classics", desc: "The greats, remastered", cover: album6 },
];

export const tracks: Track[] = [
  { id: "t1", title: "Neon Horizon", artist: "Voyager 88", album: "Midnight Drive", cover: album2, duration: "3:42" },
  { id: "t2", title: "Velvet Static", artist: "The Lumen Field", album: "Sunset Lounge", cover: album1, duration: "4:18" },
  { id: "t3", title: "Paper Cranes", artist: "Mira Hale", album: "Pastel Mornings", cover: album3, duration: "2:56" },
  { id: "t4", title: "Circuit Bloom", artist: "DSP Forest", album: "Circuit Breaker", cover: album4, duration: "5:12" },
  { id: "t5", title: "Gold Teeth", artist: "Kid Atlas", album: "Gold Standard", cover: album5, duration: "3:24" },
  { id: "t6", title: "Two AM Brass", artist: "August Quartet", album: "Smoke & Brass", cover: album6, duration: "6:01" },
  { id: "t7", title: "Soft Geometry", artist: "Mira Hale", album: "Pastel Mornings", cover: album3, duration: "3:08" },
  { id: "t8", title: "Phantom Lane", artist: "Voyager 88", album: "Midnight Drive", cover: album2, duration: "4:44" },
];
