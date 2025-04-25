
import React from "react";
import { KpiRibbon } from "./KpiRibbon";

export function HeroSection() {
  return (
    <div className="space-y-12 mb-8 relative">
      <div className="max-w-[640px] mx-auto text-center space-y-4">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
          Discover <span className="gradient-text-nova">NODO AI</span> Vaults
        </h1>
        <p className="text-[#9CA3AF] text-base md:text-lg font-light">
          AI-powered vaults maximizing returns with smart risk management
        </p>
      </div>
      
      <KpiRibbon />
    </div>
  );
}
