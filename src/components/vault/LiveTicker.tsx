
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Brain, ArrowUpRight } from "lucide-react";
import { vaultService } from "@/services/vaultService";

interface LiveTickerProps {
  lines?: string[];
}

export function LiveTicker({ lines: initialLines }: LiveTickerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lines, setLines] = useState(initialLines || [
    "$46.32 fees harvested in Deep-SUI",
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
      
      vaults.forEach(vault => {
        const harvestedAmount = (Math.random() * 100).toFixed(2);
        dynamicLines.push(`$${harvestedAmount} fees harvested in ${vault.name}`);
        
        const performanceIncrease = (Math.random() * 0.8).toFixed(1);
        dynamicLines.push(`${vault.name} vault optimized +${performanceIncrease}%`);
      });
      
      const walletPrefixes = ['0xa4b', '0x9c3', '0xe5f', '0x72d'];
      walletPrefixes.forEach(prefix => {
        const amount = Math.floor(Math.random() * 1900) + 100;
        dynamicLines.push(`${prefix}… added $${amount}`);
      });
      
      return dynamicLines.sort(() => Math.random() - 0.5);
    };
    
    setLines(generateRandomLines());
  }, [vaults]);

  useEffect(() => {
    const hideTimeout = setTimeout(() => {
      setIsVisible(false);
    }, 12000);
    
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
    <div className="fixed bottom-6 right-6 z-40">
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-500/20 via-brand-500/10 to-transparent blur-xl" />
        <div className="relative bg-black/40 backdrop-blur-xl px-4 py-3 rounded-2xl border border-white/10 
          shadow-xl transition-all duration-300 hover:border-white/20">
          <div className="flex items-center gap-2 mb-2">
            <div className="relative">
              <Brain className="h-4 w-4 text-brand-500" />
              <div className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-brand-500 rounded-full animate-pulse" />
            </div>
            <span className="text-[11px] uppercase tracking-wider text-white/50 font-medium">
              Live Activity
            </span>
            <ArrowUpRight className="h-3 w-3 text-white/30" />
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="min-w-[280px]"
            >
              <p className="text-sm font-medium bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                {lines[currentIndex]}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
