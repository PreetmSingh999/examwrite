import { Textarea } from '@/components/ui/textarea';

interface WritingEditorProps {
  text: string;
  onChange: (text: string) => void;
  placeholder?: string;
}

export const WritingEditor = ({ text, onChange, placeholder }: WritingEditorProps) => {
  return (
    <div className="relative flex-1 w-full">
      <Textarea
        value={text}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Start writing your thoughts here..."}
        className="w-full h-full min-h-[300px] md:min-h-[400px] resize-none text-base md:text-lg leading-relaxed p-6 bg-card border-border/50 focus:border-primary/50 rounded-xl shadow-sm transition-all duration-200 focus:shadow-md placeholder:text-muted-foreground/60"
        style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
      />
    </div>
  );
};
