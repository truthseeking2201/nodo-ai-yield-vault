
import { useState } from 'react';
import { Shield, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from '@/components/ui/button';

export interface VaultSecurityInfoProps {
  contractAddress: string;
  isAudited: boolean;
  explorerUrl: string;
  defaultOpen?: boolean;
}

export function VaultSecurityInfo({ 
  contractAddress,
  isAudited,
  explorerUrl,
  defaultOpen = false
}: VaultSecurityInfoProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  // Format contract address for display
  const formatAddress = (address: string) => {
    if (address.length <= 14) return address;
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const handleClick = () => {
    setIsOpen(!isOpen);
    // Store preference in localStorage
    localStorage.setItem("securityCollapsed", String(!isOpen));
  };

  return (
    <div className="border border-white/10 rounded-lg overflow-hidden">
      <div 
        className="flex items-center justify-between p-3 bg-white/5 cursor-pointer"
        onClick={handleClick}
      >
        <div className="flex items-center gap-2">
          <Shield className={isAudited ? 'text-green-500' : 'text-yellow-500'} size={18} />
          <span className="font-medium">Security & Verification</span>
        </div>
        <Button variant="ghost" size="sm" className="p-1 h-auto">
          {isOpen ? (
            <ChevronUp size={18} className="text-white/60" />
          ) : (
            <ChevronDown size={18} className="text-white/60" />
          )}
        </Button>
      </div>
      
      {isOpen && (
        <div className="p-3 space-y-3 bg-black/20">
          <div>
            <div className="text-sm font-medium mb-1">Smart Contract Address</div>
            <div className="flex items-center justify-between">
              <code className="text-xs bg-black/30 p-1 rounded font-mono">
                {formatAddress(contractAddress)}
              </code>
              <a 
                href={explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center"
              >
                View <ExternalLink size={12} className="ml-1" />
              </a>
            </div>
          </div>
          
          <div>
            <div className="text-sm font-medium mb-1">Audit Status</div>
            <div className="flex items-center">
              {isAudited ? (
                <>
                  <span className="bg-green-500/20 text-green-500 text-xs px-2 py-1 rounded-full">
                    Audited
                  </span>
                  <span className="text-xs text-white/60 ml-2">
                    by WatchPUG, Feb 2025
                  </span>
                </>
              ) : (
                <span className="bg-yellow-500/20 text-yellow-500 text-xs px-2 py-1 rounded-full">
                  Pending Audit
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
