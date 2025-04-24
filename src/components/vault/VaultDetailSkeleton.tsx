
import React from "react";
import { PageContainer } from "@/components/layout/PageContainer";

export function VaultDetailSkeleton() {
  return (
    <PageContainer>
      <div className="space-y-8">
        <div className="h-16 bg-white/10 rounded-lg animate-shimmer w-1/4"></div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <div className="h-[260px] bg-white/10 rounded-[20px] animate-shimmer"></div>
            <div className="h-64 bg-white/10 rounded-[20px] animate-shimmer"></div>
          </div>
          <div className="lg:col-span-4 space-y-6">
            <div className="h-64 bg-white/10 rounded-[20px] animate-shimmer"></div>
            <div className="h-[420px] bg-white/10 rounded-[20px] animate-shimmer"></div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
