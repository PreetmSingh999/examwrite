import { useState, useEffect, useRef, useCallback } from 'react';

interface WritingStats {
  wordCount: number;
  typingSpeed: number;
  elapsedTime: number;
  isTyping: boolean;
}

export const useWritingStats = (text: string) => {
  const [stats, setStats] = useState<WritingStats>({
    wordCount: 0,
    typingSpeed: 0,
    elapsedTime: 0,
    isTyping: false,
  });

  const startTimeRef = useRef<number | null>(null);
  const lastTypeTimeRef = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const totalActiveTimeRef = useRef<number>(0);
  const sessionStartRef = useRef<number | null>(null);

  const countWords = useCallback((text: string): number => {
    const trimmed = text.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).filter(word => word.length > 0).length;
  }, []);

  // Handle typing detection and timer
  useEffect(() => {
    const currentWordCount = countWords(text);
    
    if (text.length > 0 && startTimeRef.current === null) {
      startTimeRef.current = Date.now();
      sessionStartRef.current = Date.now();
    }

    // Mark as typing
    if (text.length > 0) {
      if (!stats.isTyping && sessionStartRef.current === null) {
        sessionStartRef.current = Date.now();
      }
      
      setStats(prev => ({ ...prev, isTyping: true, wordCount: currentWordCount }));
      lastTypeTimeRef.current = Date.now();

      // Clear existing typing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set timeout to detect when user stops typing (1.5 seconds)
      typingTimeoutRef.current = setTimeout(() => {
        if (sessionStartRef.current !== null) {
          totalActiveTimeRef.current += (Date.now() - sessionStartRef.current) / 1000;
          sessionStartRef.current = null;
        }
        setStats(prev => ({ ...prev, isTyping: false }));
      }, 1500);
    } else {
      setStats(prev => ({ ...prev, wordCount: 0 }));
    }

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [text, countWords]);

  // Timer effect - only counts when typing
  useEffect(() => {
    if (stats.isTyping) {
      timerRef.current = setInterval(() => {
        let activeTime = totalActiveTimeRef.current;
        if (sessionStartRef.current !== null) {
          activeTime += (Date.now() - sessionStartRef.current) / 1000;
        }
        
        const minutes = activeTime / 60;
        const speed = minutes > 0 ? Math.round(stats.wordCount / minutes) : 0;
        
        setStats(prev => ({
          ...prev,
          elapsedTime: Math.floor(activeTime),
          typingSpeed: speed,
        }));
      }, 100);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [stats.isTyping, stats.wordCount]);

  const resetStats = useCallback(() => {
    startTimeRef.current = null;
    lastTypeTimeRef.current = null;
    sessionStartRef.current = null;
    totalActiveTimeRef.current = 0;
    setStats({
      wordCount: 0,
      typingSpeed: 0,
      elapsedTime: 0,
      isTyping: false,
    });
  }, []);

  return { stats, resetStats };
};
