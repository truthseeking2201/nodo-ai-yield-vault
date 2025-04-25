
import React from "react";
import { Card } from "@/components/ui/card";
import { NeuralActivityTicker } from "./NeuralActivityTicker";
import { VaultActivityTicker } from "./VaultActivityTicker";

export function ActivitySection() {
  return (
    <Card className="glass-card rounded-[20px] overflow-hidden border border-white/[0.06] bg-white/[0.04] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]">
      <div className="px-8 pt-8 pb-6">
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-[#E5E7EB]">Live Activity</h3>
          <p className="text-sm text-[#9CA3AF] font-light">Real-time vault activity from AI and users</p>
        </div>
      </div>
      <div className="p-8 pt-0 space-y-6">
        <div className="space-y-4">
          <NeuralActivityTicker variant="compact" />
          <VaultActivityTicker />
        </div>
      </div>
    </Card>
  );
}
