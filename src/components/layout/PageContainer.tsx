
import React from "react";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function PageContainer({ children, className = "" }: PageContainerProps) {
  return (
    <main className={`flex-1 container px-4 py-8 md:py-12 ${className}`}>
      {children}
    </main>
  );
}
