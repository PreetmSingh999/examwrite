import { useState } from 'react';
import { Wand2, Loader2, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PassageGeneratorProps {
  onInsert: (text: string) => void;
}

export const PassageGenerator = ({ onInsert }: PassageGeneratorProps) => {
  const [topic, setTopic] = useState('');
  const [wordCount, setWordCount] = useState('100');
  const [generatedText, setGeneratedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic');
      return;
    }

    const count = parseInt(wordCount, 10);
    if (isNaN(count) || count < 20 || count > 1000) {
      toast.error('Word count must be between 20 and 1000');
      return;
    }

    setIsLoading(true);
    setGeneratedText('');

    try {
      const { data, error } = await supabase.functions.invoke('generate-passage', {
        body: { topic, wordCount: count }
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

      setGeneratedText(data.passage);
    } catch (error) {
      console.error('Error generating passage:', error);
      toast.error('Failed to generate passage. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedText);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInsert = () => {
    onInsert(generatedText);
    toast.success('Passage inserted into editor!');
  };

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Wand2 className="w-5 h-5 text-primary" />
          Generate Passage
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-[1fr,100px]">
          <div className="space-y-1.5">
            <Label htmlFor="topic">Topic</Label>
            <Input
              id="topic"
              placeholder="e.g., Climate change effects"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="wordCount">Words</Label>
            <Input
              id="wordCount"
              type="number"
              min={20}
              max={1000}
              value={wordCount}
              onChange={(e) => setWordCount(e.target.value)}
            />
          </div>
        </div>

        <Button 
          onClick={handleGenerate} 
          disabled={isLoading}
          className="w-full gap-2"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Wand2 className="w-4 h-4" />
          )}
          Generate Passage
        </Button>

        {generatedText && (
          <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
            <Textarea
              value={generatedText}
              readOnly
              className="min-h-[150px] resize-none bg-muted/30"
            />
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1.5">
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </Button>
              <Button size="sm" onClick={handleInsert} className="gap-1.5">
                Insert to Editor
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
