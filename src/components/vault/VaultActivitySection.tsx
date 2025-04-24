
import React from "react";
import { VaultActivityTicker } from "./VaultActivityTicker";
import { Button } from "@/components/ui/button";
import { ChevronRight, Activity } from "lucide-react";

export function VaultActivitySection() {
  return (
    <div className="space-y-2 my-6">
      <div className="flex items-center gap-2 mb-2">
        <Activity className="h-4 w-4 text-brand-orange-500" />
        <h3 className="text-sm font-medium text-text-primary">Live Activity</h3>
      </div>
      <div className="rounded-xl backdrop-blur-md bg-nodo-glass/50 border border-stroke-soft p-2">
        <VaultActivityTicker />
      </div>
      <div className="flex justify-end">
        <Button variant="ghost" size="sm" className="text-xs text-text-secondary flex items-center gap-1">
          View full activity <ChevronRight className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
