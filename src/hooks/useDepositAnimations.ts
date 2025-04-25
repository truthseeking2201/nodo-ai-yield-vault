
import { useEffect, useState } from 'react';

export const useDepositAnimations = (step: 'details' | 'confirmation' | 'success', amount: string) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [countUpValue, setCountUpValue] = useState(0);
  const [fadeRefresh, setFadeRefresh] = useState(false);

  useEffect(() => {
    if (step === 'success' && amount) {
      const targetValue = parseFloat(amount);
      let startTime: number;
      let requestId: number;

      const easeOutExpo = (t: number): number => {
        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      };

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / 1000, 1);
        const easedProgress = easeOutExpo(progress);
        setCountUpValue(targetValue * easedProgress);
        
        if (progress < 1) {
          requestId = requestAnimationFrame(animate);
        }
      };

      requestId = requestAnimationFrame(animate);
      
      return () => {
        cancelAnimationFrame(requestId);
      };
    }
  }, [step, amount]);

  return {
    showConfetti,
    setShowConfetti,
    countUpValue,
    fadeRefresh,
    setFadeRefresh,
  };
};
