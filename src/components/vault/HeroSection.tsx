
import React from "react";
import { KpiRibbon } from "./KpiRibbon";

export function HeroSection() {
  return (
    <div className="space-y-8 relative">
      <div className="max-w-[640px] mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
          Discover <span className="gradient-text-nova">NODO AI</span> Vaults
        </h1>
        <p className="text-[#9CA3AF] text-lg font-light">
          AI-powered vaults maximizing returns with smart risk management
        </p>
      </div>
      
      <KpiRibbon />
    </div>
  );
}
