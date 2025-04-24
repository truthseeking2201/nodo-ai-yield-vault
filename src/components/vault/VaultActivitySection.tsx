
import React from "react";
import { Button } from "@/components/ui/button";
import { VaultActivityTicker } from "./VaultActivityTicker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function VaultActivitySection() {
  return (
    <Card className="glass-card overflow-hidden rounded-[20px] border border-white/[0.06] bg-white/[0.04] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]">
      <CardHeader className="px-6 py-4 flex flex-row justify-between items-center border-b border-white/[0.06]">
        <CardTitle className="text-base font-medium text-[#E5E7EB]">Live Activity</CardTitle>
        <Button variant="ghost" size="sm" className="text-xs h-6 text-[#9CA3AF] hover:text-white">
          View all
        </Button>
      </CardHeader>
      <CardContent className="p-6">
        <VaultActivityTicker maxRows={5} rowHeight="h-6" />
      </CardContent>
    </Card>
  );
}
