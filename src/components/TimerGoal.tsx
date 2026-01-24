import { useState, useEffect, useCallback } from 'react';
import { Timer, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface TimerGoalProps {
  elapsedTime: number;
  isTyping: boolean;
}

export const TimerGoal = ({ elapsedTime, isTyping }: TimerGoalProps) => {
  const [goalMinutes, setGoalMinutes] = useState<string>('');
  const [goalSeconds, setGoalSeconds] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const remainingTime = goalSeconds !== null ? Math.max(0, goalSeconds - elapsedTime) : null;
  const isComplete = remainingTime === 0 && goalSeconds !== null;

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSetGoal = useCallback(() => {
    const minutes = parseInt(goalMinutes, 10);
    if (!isNaN(minutes) && minutes > 0) {
      setGoalSeconds(minutes * 60);
      setIsOpen(false);
    }
  }, [goalMinutes]);

  const handleClearGoal = useCallback(() => {
    setGoalSeconds(null);
    setGoalMinutes('');
  }, []);

  const progress = goalSeconds !== null ? ((goalSeconds - (remainingTime ?? 0)) / goalSeconds) * 100 : 0;

  return (
    <div className="flex items-center gap-2">
      {goalSeconds !== null ? (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-lg border border-primary/20">
          <Timer className={`w-4 h-4 ${isComplete ? 'text-green-500' : 'text-primary'}`} />
          <div className="flex flex-col">
            <span className={`text-sm font-semibold tabular-nums ${isComplete ? 'text-green-500' : 'text-foreground'}`}>
              {isComplete ? '🎉 Goal reached!' : formatTime(remainingTime!)}
            </span>
            {!isComplete && (
              <div className="w-20 h-1 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-muted-foreground hover:text-foreground"
            onClick={handleClearGoal}
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      ) : (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Timer className="w-4 h-4" />
              Set Timer
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 bg-popover border border-border shadow-lg z-50" align="center">
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Set writing goal (minutes)</p>
              <div className="flex gap-2">
                <Input
                  type="number"
                  min="1"
                  max="180"
                  placeholder="e.g. 25"
                  value={goalMinutes}
                  onChange={(e) => setGoalMinutes(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSetGoal()}
                  className="flex-1"
                />
                <Button size="sm" onClick={handleSetGoal}>
                  Start
                </Button>
              </div>
              <div className="flex gap-1 flex-wrap">
                {[5, 10, 15, 25, 30].map((mins) => (
                  <Button
                    key={mins}
                    variant="secondary"
                    size="sm"
                    className="text-xs px-2 py-1 h-7"
                    onClick={() => {
                      setGoalSeconds(mins * 60);
                      setIsOpen(false);
                    }}
                  >
                    {mins}m
                  </Button>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};
