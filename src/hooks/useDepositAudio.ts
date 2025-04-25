
import { useEffect, useRef } from 'react';

export const useDepositAudio = (step: 'details' | 'confirmation' | 'success', amount: string) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (!prefersReducedMotion) {
      audioRef.current = new Audio("/chime.mp3");
      audioRef.current.volume = 0.7;
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (step === 'success' && amount && !prefersReducedMotion && audioRef.current) {
      audioRef.current.play().catch(err => console.warn("Audio playback failed:", err));
    }
  }, [step, amount, prefersReducedMotion]);
};
