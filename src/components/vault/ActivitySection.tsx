
import React from "react";
import { Card } from "@/components/ui/card";
import { UnifiedActivityFeed } from "./UnifiedActivityFeed";
import { Brain } from "lucide-react";

export function ActivitySection() {
  return (
    <Card className="glass-card-premium rounded-[20px] overflow-hidden">
      <div className="p-4 relative">
        <div className="flex items-center gap-2 mb-4">
          <div className="relative">
            <Brain className="w-4 h-4 text-brand-500" />
            <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald rounded-full animate-pulse"></div>
          </div>
          <h3 className="text-sm font-medium text-white/90">Live Activity</h3>
        </div>
        <UnifiedActivityFeed />
      </div>
    </Card>
  );
}
