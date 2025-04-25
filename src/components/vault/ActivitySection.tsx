
import React from "react";
import { Card } from "@/components/ui/card";
import { UnifiedActivityFeed } from "./UnifiedActivityFeed";

export function ActivitySection() {
  return (
    <Card className="glass-card-premium rounded-[24px] overflow-hidden">
      <div className="px-8 pt-8 pb-6 relative">
        <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-2/3 h-2/3 bg-gradient-radial from-brand-500/20 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-radial from-violet/20 to-transparent"></div>
        </div>
        <div className="space-y-2 relative">
          <h3 className="text-lg font-medium text-white/95">
            <span className="brand-text-glow">Live Activity</span>
          </h3>
          <p className="text-sm text-white/60 font-light">Real-time vault updates from AI and users</p>
        </div>
      </div>
      <div className="p-8 pt-0 relative">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        </div>
        <UnifiedActivityFeed />
      </div>
    </Card>
  );
}
