import { useState } from 'react';
import { FileText, Loader2, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface TextSummarizerProps {
  text: string;
}

export const TextSummarizer = ({ text }: TextSummarizerProps) => {
  const [wordLimit, setWordLimit] = useState('50');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSummarize = async () => {
    if (!text.trim()) {
      toast.error('Please write some text in the editor first');
      return;
    }

    const wordCount = text.trim().split(/\s+/).length;
    if (wordCount < 20) {
      toast.error('Please write at least 20 words to summarize');
      return;
    }

    const limit = parseInt(wordLimit, 10);
    if (isNaN(limit) || limit < 10 || limit > 500) {
      toast.error('Word limit must be between 10 and 500');
      return;
    }

    setIsLoading(true);
    setSummary('');

    try {
      const { data, error } = await supabase.functions.invoke('summarize-text', {
        body: { text, wordLimit: limit }
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

      setSummary(data.summary);
    } catch (error) {
      console.error('Error summarizing text:', error);
      toast.error('Failed to summarize text. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const currentWordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Summarize Text
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Current text: {currentWordCount} words</span>
        </div>

        <div className="flex gap-3 items-end">
          <div className="flex-1 space-y-1.5">
            <Label htmlFor="wordLimit">Target word limit</Label>
            <Input
              id="wordLimit"
              type="number"
              min={10}
              max={500}
              value={wordLimit}
              onChange={(e) => setWordLimit(e.target.value)}
            />
          </div>
          <Button 
            onClick={handleSummarize} 
            disabled={isLoading || currentWordCount < 20}
            className="gap-2"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FileText className="w-4 h-4" />
            )}
            Summarize
          </Button>
        </div>

        {summary && (
          <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
            <Textarea
              value={summary}
              readOnly
              className="min-h-[120px] resize-none bg-muted/30"
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {summary.trim().split(/\s+/).length} words
              </span>
              <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1.5">
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
