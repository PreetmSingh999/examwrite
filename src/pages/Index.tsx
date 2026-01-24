import { useState } from 'react';
import { PenLine, RotateCcw } from 'lucide-react';
import { WritingEditor } from '@/components/WritingEditor';
import { WritingStats } from '@/components/WritingStats';
import { ThemeToggle } from '@/components/ThemeToggle';
import { AISuggestions } from '@/components/AISuggestions';
import { TimerGoal } from '@/components/TimerGoal';
import { Button } from '@/components/ui/button';
import { useWritingStats } from '@/hooks/useWritingStats';
import { useTheme } from '@/hooks/useTheme';

const Index = () => {
  const [text, setText] = useState('');
  const { stats, resetStats } = useWritingStats(text);
  const { isDark, toggleTheme } = useTheme();

  const handleClear = () => {
    setText('');
    resetStats();
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 py-6 md:py-10">
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 md:mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <PenLine className="w-6 h-6 md:w-8 md:h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                ExamWrite
              </h1>
              <p className="text-sm text-muted-foreground">
                Write freely. Get instant feedback.
              </p>
            </div>
          </div>
          <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
        </header>

        {/* Stats Bar */}
        <div className="mb-6 space-y-3">
          <WritingStats
            wordCount={stats.wordCount}
            typingSpeed={stats.typingSpeed}
            elapsedTime={stats.elapsedTime}
            isTyping={stats.isTyping}
          />
          <div className="flex justify-center">
            <TimerGoal />
          </div>
        </div>

        {/* Editor */}
        <div className="mb-6">
          <WritingEditor
            text={text}
            onChange={setText}
            placeholder="Begin your writing journey here... The timer will start when you type and pause when you stop. Your words per minute will be calculated based on your active writing time."
          />
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <AISuggestions text={text} />
          
          <div className="flex justify-center">
            <Button
              variant="ghost"
              onClick={handleClear}
              className="gap-2 text-muted-foreground hover:text-foreground"
              disabled={!text}
            >
              <RotateCcw className="w-4 h-4" />
              Clear & Reset
            </Button>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-10 pt-6 border-t border-border/50 text-center">
          <p className="text-sm text-muted-foreground">
            Start typing to begin tracking your writing session. 
            The timer pauses when you stop typing.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
