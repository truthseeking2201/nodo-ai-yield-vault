
import React from "react";

interface VaultDetailLayoutProps {
  children: React.ReactNode;
  leftColumn: React.ReactNode;
  rightColumn: React.ReactNode;
}

export function VaultDetailLayout({ children, leftColumn, rightColumn }: VaultDetailLayoutProps) {
  return (
    <div className="max-w-[1280px] mx-auto">
      {children}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-24">
        <div className="lg:col-span-7 space-y-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
          {leftColumn}
        </div>
        <div className="lg:col-span-5 space-y-6 animate-fade-in" style={{ animationDelay: '200ms' }}>
          {rightColumn}
        </div>
      </div>
    </div>
  );
}
