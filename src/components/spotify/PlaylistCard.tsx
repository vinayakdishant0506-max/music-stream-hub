import { Play } from "lucide-react";

type Props = {
  title: string;
  desc: string;
  cover: string;
  onPlay?: () => void;
};

export const PlaylistCard = ({ title, desc, cover, onPlay }: Props) => {
  return (
    <div className="group relative bg-surface-1 hover:bg-surface-3 transition-colors p-4 rounded-md cursor-pointer">
      <div className="relative mb-4">
        <img
          src={cover}
          alt={title}
          width={200}
          height={200}
          loading="lazy"
          className="w-full aspect-square object-cover rounded-md shadow-medium"
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPlay?.();
          }}
          className="absolute right-2 bottom-2 h-12 w-12 rounded-full bg-spotify-green text-primary-foreground grid place-items-center shadow-heavy translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all hover:scale-105"
          aria-label={`Play ${title}`}
        >
          <Play className="h-5 w-5 fill-current" />
        </button>
      </div>
      <h3 className="text-sm font-bold truncate">{title}</h3>
      <p className="text-xs text-silver mt-1 line-clamp-2 min-h-[32px]">{desc}</p>
    </div>
  );
};