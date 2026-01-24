import { Clock, Keyboard, FileText, Pause, Play } from 'lucide-react';

interface WritingStatsProps {
  wordCount: number;
  typingSpeed: number;
  elapsedTime: number;
  isTyping: boolean;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const WritingStats = ({ wordCount, typingSpeed, elapsedTime, isTyping }: WritingStatsProps) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 p-4 bg-muted/50 rounded-xl border border-border/50">
      <div className="flex items-center gap-2 text-sm md:text-base">
        <FileText className="w-4 h-4 md:w-5 md:h-5 text-primary" />
        <span className="text-muted-foreground">Words:</span>
        <span className="font-semibold text-foreground tabular-nums">{wordCount}</span>
      </div>

      <div className="flex items-center gap-2 text-sm md:text-base">
        <Keyboard className="w-4 h-4 md:w-5 md:h-5 text-primary" />
        <span className="text-muted-foreground">Speed:</span>
        <span className="font-semibold text-foreground tabular-nums">{typingSpeed} WPM</span>
      </div>

      <div className="flex items-center gap-2 text-sm md:text-base">
        <Clock className="w-4 h-4 md:w-5 md:h-5 text-primary" />
        <span className="text-muted-foreground">Time:</span>
        <span className="font-semibold text-foreground tabular-nums">{formatTime(elapsedTime)}</span>
        {isTyping ? (
          <Play className="w-3 h-3 text-green-500 animate-pulse" />
        ) : (
          <Pause className="w-3 h-3 text-muted-foreground" />
        )}
      </div>
    </div>
  );
};
