import { Play } from "lucide-react";

type Props = {
  title: string;
  cover: string;
  onPlay?: () => void;
};

export const QuickPick = ({ title, cover, onPlay }: Props) => {
  return (
    <div className="group relative flex items-center gap-3 bg-surface-2/60 hover:bg-surface-3 transition-colors rounded-md overflow-hidden cursor-pointer pr-4">
      <img
        src={cover}
        alt={title}
        width={80}
        height={80}
        loading="lazy"
        className="h-16 w-16 object-cover shrink-0"
      />
      <span className="text-sm font-bold truncate flex-1">{title}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPlay?.();
        }}
        className="h-10 w-10 rounded-full bg-spotify-green text-primary-foreground grid place-items-center shadow-heavy opacity-0 group-hover:opacity-100 transition-opacity hover:scale-105 shrink-0"
        aria-label={`Play ${title}`}
      >
        <Play className="h-4 w-4 fill-current" />
      </button>
    </div>
  );
};