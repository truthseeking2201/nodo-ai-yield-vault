
import React from "react";
import { KpiRibbon } from "./KpiRibbon";
import { FeaturedVaultPill } from "./FeaturedVaultPill";
import { PromoRibbon } from "./PromoRibbon";

export function HeroSection() {
  return (
    <div className="text-center space-y-4 mb-16 relative">
      <h1 className="text-3xl md:text-4xl font-bold font-sans tracking-tight mb-4">
        Discover <span className="gradient-text-nova">NODO AI</span> Vaults
      </h1>
      <p className="text-[#C9CDD3] max-w-2xl mx-auto text-base mb-8">
        AI-powered yield-generating vaults designed to maximize your returns while managing risk.
      </p>
      
      <KpiRibbon />
      <FeaturedVaultPill />
      <PromoRibbon />
    </div>
  );
}
