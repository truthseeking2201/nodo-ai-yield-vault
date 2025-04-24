
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
          y: 30 + Math.random() * 70, // Random position across the height, avoiding the top
          size: 2 + Math.random(), // Random size between 2-3px
          delay: Math.random() * 20, // Random delay to stagger animation
          color: i % 2 === 0 ? "orange" : "cyan" // Alternate colors
        });
      }
      
      setParticles(newParticles);
    };
    
    generateParticles();
  }, []);
  
  return (
    <>
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
    </>
  );
};
