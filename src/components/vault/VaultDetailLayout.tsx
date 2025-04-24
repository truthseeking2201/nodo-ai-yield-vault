
import React from "react";

interface VaultDetailLayoutProps {
  children: React.ReactNode;
  leftColumn: React.ReactNode;
  rightColumn: React.ReactNode;
}

export function VaultDetailLayout({ children, leftColumn, rightColumn }: VaultDetailLayoutProps) {
  return (
    <>
      {children}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6 mb-24">
          {leftColumn}
        </div>
        <div className="lg:col-span-4 space-y-6 mb-24">
          {rightColumn}
        </div>
      </div>
    </>
  );
}
