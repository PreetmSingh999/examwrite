import { Moon, Sun } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

export const ThemeToggle = ({ isDark, onToggle }: ThemeToggleProps) => {
  return (
    <div className="flex items-center gap-3">
      <Sun className={`w-4 h-4 transition-colors ${isDark ? 'text-muted-foreground' : 'text-amber-500'}`} />
      <Switch 
        checked={isDark} 
        onCheckedChange={onToggle}
        aria-label="Toggle theme"
      />
      <Moon className={`w-4 h-4 transition-colors ${isDark ? 'text-primary' : 'text-muted-foreground'}`} />
    </div>
  );
};
