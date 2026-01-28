import { useState } from 'react';
import { PenLine, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { WritingEditor } from '@/components/WritingEditor';
import { WritingStats } from '@/components/WritingStats';
import { ThemeToggle } from '@/components/ThemeToggle';
import { AISuggestions } from '@/components/AISuggestions';
import { TimerGoal } from '@/components/TimerGoal';
import { PassageGenerator } from '@/components/PassageGenerator';
import { TextSummarizer } from '@/components/TextSummarizer';
import { Button } from '@/components/ui/button';
import { useWritingStats } from '@/hooks/useWritingStats';
import { useTheme } from '@/hooks/useTheme';

const Index = () => {
  const [text, setText] = useState('');
  const { stats, resetStats } = useWritingStats(text);
  const { isDark, toggleTheme } = useTheme();
  const [showAITools, setShowAITools] = useState(false);

  const handleClear = () => {
    setText('');
    resetStats();
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-10">
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

        {/* Main Content Area with Resizable Panels */}
        <div className="relative">
          {/* Toggle Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAITools(!showAITools)}
            className="mb-3 gap-2"
          >
            {showAITools ? (
              <>
                <ChevronLeft className="h-4 w-4" />
                Hide AI Tools
              </>
            ) : (
              <>
                <ChevronRight className="h-4 w-4" />
                Show AI Tools
              </>
            )}
          </Button>

          {showAITools ? (
            <ResizablePanelGroup orientation="horizontal" className="min-h-[500px] rounded-lg border">
              {/* AI Tools Panel */}
              <ResizablePanel defaultSize={35} minSize={25} maxSize={50}>
                <div className="h-full p-3 flex flex-col gap-4 overflow-auto">
                  <PassageGenerator onInsert={(passage) => setText(prev => prev ? `${prev}\n\n${passage}` : passage)} />
                  <TextSummarizer editorText={text} />
                </div>
              </ResizablePanel>

              {/* Resize Handle */}
              <ResizableHandle withHandle />

              {/* Editor Panel */}
              <ResizablePanel defaultSize={65} minSize={40}>
                <div className="h-full p-3">
                  <WritingEditor
                    text={text}
                    onChange={setText}
                    placeholder="Begin your writing journey here... The timer will start when you type and pause when you stop. Your words per minute will be calculated based on your active writing time."
                  />
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          ) : (
            <div className="min-h-[400px]">
              <WritingEditor
                text={text}
                onChange={setText}
                placeholder="Begin your writing journey here... The timer will start when you type and pause when you stop. Your words per minute will be calculated based on your active writing time."
              />
            </div>
          )}
        </div>

        {/* Grammar & Tips */}
        <div className="mt-6 space-y-4">
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
