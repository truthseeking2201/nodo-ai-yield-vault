
import React, { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Check, ExternalLink, ShieldAlert } from "lucide-react";
import { useEffect } from "react";

interface VaultSecurityInfoProps {
  contractAddress: string;
  isAudited: boolean;
  explorerUrl: string;
  defaultOpen?: boolean;
}

export function VaultSecurityInfo({ 
  contractAddress, 
  isAudited, 
  explorerUrl,
  defaultOpen = true
}: VaultSecurityInfoProps) {
  const [isOpen, setIsOpen] = useState<string | undefined>(defaultOpen ? "item-1" : undefined);
  
  useEffect(() => {
    // Save collapsed state to localStorage when changed
    if (isOpen === undefined) {
      localStorage.setItem("securityCollapsed", "true");
    } else {
      localStorage.setItem("securityCollapsed", "false");
    }
  }, [isOpen]);
  
  const shortenedAddress = `${contractAddress.slice(0, 6)}...${contractAddress.slice(-6)}`;
  
  return (
    <Accordion
      type="single"
      collapsible
      value={isOpen}
      onValueChange={setIsOpen}
      className="w-full border border-white/10 rounded-lg overflow-hidden"
    >
      <AccordionItem value="item-1" className="border-0">
        <AccordionTrigger className="px-4 py-3 hover:bg-white/5 transition-colors duration-200 text-sm text-[#E5E7EB]">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-[#F59E0B]" />
            <span>Security Information</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="text-sm bg-white/5 px-4 pb-3 pt-1 text-[#C9CDD3]">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Contract Address</span>
              <a href={explorerUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[#F59E0B] hover:underline">
                {shortenedAddress}
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <div className="flex justify-between">
              <span>Security Audit</span>
              <div className={`flex items-center gap-1 ${isAudited ? 'text-emerald' : 'text-red-500'}`}>
                {isAudited ? (
                  <>
                    <Check className="h-3 w-3" />
                    <a href="/audit.pdf" target="_blank" rel="noopener noreferrer" className="text-[#F59E0B] hover:underline">
                      View Audit
                    </a>
                  </>
                ) : (
                  "Pending"
                )}
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
