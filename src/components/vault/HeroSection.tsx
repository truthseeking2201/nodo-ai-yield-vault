
import React from "react";
import { KpiRibbon } from "./KpiRibbon";
import { FeaturedVaultPill } from "./FeaturedVaultPill";

export function HeroSection() {
  return (
    <div className="space-y-6 mb-8 relative">
      <div className="max-w-[640px] mx-auto text-center">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-3">
          Discover <span className="gradient-text-nova">NODO AI</span> Vaults
        </h1>
        <p className="text-[#9CA3AF] text-sm md:text-base">
          AI-powered vaults maximizing returns with smart risk management
        </p>
      </div>
      
      <KpiRibbon />
      <FeaturedVaultPill />
    </div>
  );
}
