
import React from "react";
import { AppHeader } from "./AppHeader";
import { AppFooter } from "./AppFooter";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-[#0E0F11]">
      <AppHeader />
      <div className="flex-1">
        {children}
      </div>
      <AppFooter />
    </div>
  );
}
