
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { VaultActivityTicker } from "./VaultActivityTicker";

export function VaultActivitySection() {
  return (
    <Card className="glass-card rounded-[20px] overflow-hidden border border-white/[0.06] bg-white/[0.04] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]">
      <CardHeader className="px-6 pt-6 pb-4">
        <CardTitle className="text-lg font-medium text-[#E5E7EB]">Vault Activity</CardTitle>
        <CardDescription className="text-sm text-[#9CA3AF]">Recent deposits and withdrawals</CardDescription>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <VaultActivityTicker />
      </CardContent>
    </Card>
  );
}
