
import React, { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  color: "orange" | "cyan";
}

export const AICanvas: React.FC = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  
  useEffect(() => {
    // Generate particles only once on mount
    const generateParticles = () => {
      const newParticles: Particle[] = [];
      const count = 18; // Total number of particles
      
      for (let i = 0; i < count; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100, // Random position across the width (in percentage)
          y: Math.random() * 60 + 20, // Random position across the height, ensuring some are visible
          size: 2 + Math.random() * 2, // Random size between 2-4px for better visibility
          delay: Math.random() * 10, // Shorter delay for quicker animation start
          color: i % 2 === 0 ? "orange" : "cyan" // Alternate colors
        });
      }
      
      setParticles(newParticles);
    };
    
    generateParticles();
  }, []);
  
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none" aria-hidden="true">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`ai-particle ai-particle-${particle.color}`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDelay: `${particle.delay}s`,
          }}
          aria-hidden="true"
        />
      ))}
    </div>
  );
};
