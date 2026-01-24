import { useState } from 'react';
import { Sparkles, CheckCircle2, AlertCircle, Loader2, X, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AISuggestionsProps {
  text: string;
}

interface GrammarIssue {
  original: string;
  suggestion: string;
  explanation: string;
}

interface WritingTip {
  category: string;
  tip: string;
}

interface AIResponse {
  grammarIssues: GrammarIssue[];
  writingTips: WritingTip[];
}

export const AISuggestions = ({ text }: AISuggestionsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<AIResponse | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'grammar' | 'tips'>('grammar');

  const analyzeText = async () => {
    if (!text.trim()) {
      toast.error('Please write some text first!');
      return;
    }

    if (text.trim().split(/\s+/).length < 5) {
      toast.error('Please write at least 5 words for analysis.');
      return;
    }

    setIsLoading(true);
    setIsOpen(true);

    try {
      const { data, error } = await supabase.functions.invoke('analyze-writing', {
        body: { text }
      });

      if (error) {
        if (error.message?.includes('429')) {
          toast.error('Too many requests. Please wait a moment and try again.');
        } else if (error.message?.includes('402')) {
          toast.error('AI credits exhausted. Please add credits to continue.');
        } else {
          throw error;
        }
        return;
      }

      setResponse(data);
    } catch (error) {
      console.error('Error analyzing text:', error);
      toast.error('Failed to analyze your writing. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const closeSuggestions = () => {
    setIsOpen(false);
    setResponse(null);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          onClick={analyzeText} 
          disabled={isLoading}
          className="flex-1 gap-2"
          variant="default"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <CheckCircle2 className="w-4 h-4" />
          )}
          Check Grammar
        </Button>
        
        <Button 
          onClick={analyzeText} 
          disabled={isLoading}
          className="flex-1 gap-2"
          variant="secondary"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          Get Writing Tips
        </Button>
      </div>

      {isOpen && (
        <div className="mt-4 p-4 bg-card border border-border rounded-xl shadow-lg animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2">
              <Button
                variant={activeTab === 'grammar' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('grammar')}
                className="gap-1"
              >
                <AlertCircle className="w-3 h-3" />
                Grammar
              </Button>
              <Button
                variant={activeTab === 'tips' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('tips')}
                className="gap-1"
              >
                <Lightbulb className="w-3 h-3" />
                Tips
              </Button>
            </div>
            <Button variant="ghost" size="icon" onClick={closeSuggestions}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <ScrollArea className="h-[200px] md:h-[250px]">
            {isLoading ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                Analyzing your writing...
              </div>
            ) : response ? (
              activeTab === 'grammar' ? (
                <div className="space-y-3">
                  {response.grammarIssues.length === 0 ? (
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                      <CheckCircle2 className="w-5 h-5" />
                      <span>No grammar issues found! Great job!</span>
                    </div>
                  ) : (
                    response.grammarIssues.map((issue, idx) => (
                      <div key={idx} className="p-3 bg-muted/50 rounded-lg border border-border/50">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                          <div className="space-y-1">
                            <p className="text-sm">
                              <span className="line-through text-muted-foreground">{issue.original}</span>
                              <span className="mx-2">→</span>
                              <span className="text-primary font-medium">{issue.suggestion}</span>
                            </p>
                            <p className="text-xs text-muted-foreground">{issue.explanation}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {response.writingTips.length === 0 ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Lightbulb className="w-5 h-5" />
                      <span>Write more content to get personalized tips!</span>
                    </div>
                  ) : (
                    response.writingTips.map((tip, idx) => (
                      <div key={idx} className="p-3 bg-muted/50 rounded-lg border border-border/50">
                        <div className="flex items-start gap-2">
                          <Sparkles className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                          <div className="space-y-1">
                            <p className="text-xs font-medium text-primary uppercase tracking-wide">
                              {tip.category}
                            </p>
                            <p className="text-sm text-foreground">{tip.tip}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )
            ) : null}
          </ScrollArea>
        </div>
      )}
    </div>
  );
};
