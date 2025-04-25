
import React from "react";
import { Card } from "@/components/ui/card";
import { Brain, Users } from "lucide-react";
import { NeuralActivityTicker } from "./NeuralActivityTicker";
import { VaultActivityTicker } from "./VaultActivityTicker";

export function ActivitySection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="glass-card rounded-[20px] overflow-hidden border border-white/[0.06] bg-white/[0.04] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]">
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-medium text-[#E5E7EB]">AI Activity</h3>
          </div>
          <p className="text-sm text-[#9CA3AF]">Real-time AI optimization actions</p>
        </div>
        <div className="p-6 pt-0">
          <NeuralActivityTicker variant="compact" />
        </div>
      </Card>

      <Card className="glass-card rounded-[20px] overflow-hidden border border-white/[0.06] bg-white/[0.04] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]">
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-medium text-[#E5E7EB]">User Activity</h3>
          </div>
          <p className="text-sm text-[#9CA3AF]">Recent deposits and withdrawals</p>
        </div>
        <div className="p-6 pt-0">
          <VaultActivityTicker />
        </div>
      </Card>
    </div>
  );
}
