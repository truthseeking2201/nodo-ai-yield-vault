
import React from "react";
import { Button } from "@/components/ui/button";
import { VaultActivityTicker } from "./VaultActivityTicker";

export function VaultActivitySection() {
  return (
    <div className="mt-8 glass-card p-4 bg-white/[0.03] border border-white/[0.06] rounded-xl">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-base font-medium">Live Activity</h3>
        <Button variant="ghost" size="sm" className="text-xs h-6">
          Show more
        </Button>
      </div>
      <VaultActivityTicker maxRows={3} rowHeight="h-6" />
    </div>
  );
}
