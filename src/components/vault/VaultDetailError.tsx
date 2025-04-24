
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/layout/PageContainer";

export function VaultDetailError() {
  const navigate = useNavigate();
  
  return (
    <PageContainer>
      <Card className="glass-card p-8 text-center rounded-[20px]">
        <h2 className="text-xl font-bold text-red-500 mb-4">Error Loading Vault</h2>
        <p className="text-[#9CA3AF] mb-6">
          We couldn't load the vault information. Please try again later.
        </p>
        <Button onClick={() => navigate('/')}>Return to Vault Catalog</Button>
      </Card>
    </PageContainer>
  );
}
