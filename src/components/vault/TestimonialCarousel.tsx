
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Testimonial {
  quote: string;
  handle: string;
}

interface TestimonialCarouselProps {
  items: Testimonial[];
}

export function TestimonialCarousel({ items = [] }: TestimonialCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const defaultTestimonials = [
    { quote: "Best yields on Sui!", handle: "@CryptoFanSUI" },
    { quote: "Fast deposits & reliable performance.", handle: "@VaultHunter" },
    { quote: "The AI rebalancing strategy really works.", handle: "@SuiWhale42" },
    { quote: "Love the transparent fees and security.", handle: "@DeFiMaster" }
  ];
  
  const testimonials = items.length > 0 ? items : defaultTestimonials;
  
  // Auto-swipe every 6s
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % testimonials.length);
    }, 6000);
    
    return () => clearInterval(interval);
  }, [testimonials.length]);
  
  return (
    <div className="my-12 relative">
      <div className="text-center mb-4">
        <h3 className="text-lg font-medium mb-2">What Our Users Say</h3>
      </div>
      
      <div className="relative overflow-hidden h-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-center px-8"
          >
            <p className="text-base italic mb-2 text-white/90">"{testimonials[activeIndex].quote}"</p>
            <p className="text-sm text-white/70">{testimonials[activeIndex].handle}</p>
          </motion.div>
        </AnimatePresence>
      </div>
      
      <div className="flex justify-center gap-2 mt-4">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === activeIndex ? 'bg-white' : 'bg-white/30'
            }`}
            aria-label={`View testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
