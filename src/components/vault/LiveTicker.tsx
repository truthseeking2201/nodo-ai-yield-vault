
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { vaultService } from "@/services/vaultService";

interface LiveTickerProps {
  lines?: string[];
}

export function LiveTicker({ lines: initialLines }: LiveTickerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lines, setLines] = useState(initialLines || [
    "$46.32 fees just harvested in Deep-SUI",
    "SUI-USDC vault up 0.4% today",
    "0x9a4… deposited $1,500"
  ]);

  const { data: vaults } = useQuery({
    queryKey: ['vaults'],
    queryFn: vaultService.getAllVaults,
  });

  // Generate dynamic lines based on vaults data
  useEffect(() => {
    if (!vaults) return;

    const generateRandomLines = () => {
      const dynamicLines = [];
      
      // Generate lines based on real vault data
      vaults.forEach(vault => {
        // Random amount harvested
        const harvestedAmount = (Math.random() * 100).toFixed(2);
        dynamicLines.push(`$${harvestedAmount} fees just harvested in ${vault.name}`);
        
        // Random performance increase
        const performanceIncrease = (Math.random() * 0.8).toFixed(1);
        dynamicLines.push(`${vault.name} vault up ${performanceIncrease}% today`);
      });
      
      // Random wallet deposits
      const walletPrefixes = ['0xa4b', '0x9c3', '0xe5f', '0x72d'];
      walletPrefixes.forEach(prefix => {
        const amount = Math.floor(Math.random() * 1900) + 100;
        dynamicLines.push(`${prefix}… deposited $${amount}`);
      });
      
      // Shuffle array
      return dynamicLines.sort(() => Math.random() - 0.5);
    };
    
    setLines(generateRandomLines());
  }, [vaults]);

  useEffect(() => {
    // Auto-hide after 12s
    const hideTimeout = setTimeout(() => {
      setIsVisible(false);
    }, 12000);
    
    // Rotate through lines every 3s
    const rotationInterval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % lines.length);
    }, 3000);
    
    return () => {
      clearTimeout(hideTimeout);
      clearInterval(rotationInterval);
    };
  }, [lines.length]);

  if (!isVisible || lines.length === 0) return null;

  return (
    <div 
      className="fixed bottom-4 right-4 z-40 bg-white/10 backdrop-blur-lg px-4 py-2 rounded-xl border border-white/20 animate-fade-in shadow-lg"
      aria-live="polite"
    >
      <AnimatePresence mode="wait">
        <motion.p 
          key={currentIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="text-sm font-medium"
        >
          {lines[currentIndex]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
