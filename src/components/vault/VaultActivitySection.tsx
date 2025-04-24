
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { VaultActivityTicker } from "./VaultActivityTicker";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

export function VaultActivitySection() {
  return (
    <div className="space-y-2 mb-6">
      <div className="h-11 glass-card-activity rounded-xl backdrop-blur-md bg-nodo-glass">
        <VaultActivityTicker />
      </div>
      <div className="flex justify-end">
        <Button variant="ghost" size="sm" className="text-xs text-text-secondary flex items-center gap-0.5">
          View full activity <ChevronRight className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
