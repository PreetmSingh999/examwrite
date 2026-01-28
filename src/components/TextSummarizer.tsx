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
  editorText?: string;
}

export const TextSummarizer = ({ editorText = '' }: TextSummarizerProps) => {
  const [inputText, setInputText] = useState('');
  const [wordLimit, setWordLimit] = useState('50');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Use input text if provided, otherwise fall back to editor text
  const textToSummarize = inputText.trim() || editorText.trim();
  const currentWordCount = textToSummarize ? textToSummarize.split(/\s+/).length : 0;

  const handleSummarize = async () => {
    if (!textToSummarize) {
      toast.error('Please paste or write some text to summarize');
      return;
    }

    if (currentWordCount < 20) {
      toast.error('Please provide at least 20 words to summarize');
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
        body: { text: textToSummarize, wordLimit: limit }
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

  return (
    <Card className="border-border/50 h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Summarize Text
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 flex-1 flex flex-col">
        <div className="space-y-1.5 flex-1">
          <Label htmlFor="inputText">Text to summarize</Label>
          <Textarea
            id="inputText"
            placeholder="Paste or type text here to summarize..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="min-h-[100px] flex-1 resize-none"
          />
          <p className="text-xs text-muted-foreground">{currentWordCount} words</p>
        </div>

        <div className="flex gap-3 items-end">
          <div className="flex-1 space-y-1.5">
            <Label htmlFor="wordLimit">Target words</Label>
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
              className="min-h-[80px] resize-none bg-muted/30"
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
