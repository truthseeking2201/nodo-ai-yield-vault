
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UnifiedActivityFeed } from "./UnifiedActivityFeed";
import { Brain } from "lucide-react";

export function VaultActivitySection() {
  return (
    <Card className="glass-card rounded-[20px] overflow-hidden border border-white/[0.06] bg-white/[0.04] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]">
      <CardHeader className="px-6 pt-6 pb-4">
        <CardTitle className="text-lg font-medium text-[#E5E7EB] flex items-center gap-2">
          <div className="relative">
            <Brain className="h-5 w-5 text-brand-500" />
            <div className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-emerald rounded-full animate-pulse"></div>
          </div>
          Live Activity
        </CardTitle>
        <CardDescription className="text-sm text-[#9CA3AF]">
          Real-time vault activity from AI and users
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <UnifiedActivityFeed />
      </CardContent>
    </Card>
  );
}
