
import { useState, useEffect } from 'react';
import { Shield, Copy, ExternalLink, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useToast } from '@/hooks/use-toast';

interface VaultSecurityInfoProps {
  contractAddress: string;
  isAudited: boolean;
  explorerUrl: string;
  defaultOpen?: boolean; // Make it optional
}

export function VaultSecurityInfo({ 
  contractAddress, 
  isAudited, 
  explorerUrl,
  defaultOpen = false // Default to false if not provided
}: VaultSecurityInfoProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const { toast } = useToast();

  useEffect(() => {
    // Check localStorage for user preference, default to open for first-time visitors
    const securityCollapsed = localStorage.getItem("securityCollapsed");
    if (securityCollapsed === null) {
      setIsOpen(defaultOpen);
    } else {
      setIsOpen(securityCollapsed !== "true");
    }
  }, [defaultOpen]);

  const toggleOpen = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    localStorage.setItem("securityCollapsed", newState ? "false" : "true");
  };

  const copyAddress = async () => {
    await navigator.clipboard.writeText(contractAddress);
    toast({
      title: "Address copied",
      description: "Contract address has been copied to clipboard",
    });
  };

  return (
    <Collapsible open={isOpen} onOpenChange={toggleOpen}>
      <CollapsibleTrigger asChild>
        <Button 
          variant="ghost" 
          className="flex w-full h-11 justify-between p-0 hover:bg-white/5 transition-all duration-200"
        >
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="font-medium">Security & Audit</span>
          </div>
          <div className="flex items-center text-[#9CA3AF]">
            <span className="mr-2">
              {isOpen ? 'Show less' : 'Show more'}
            </span>
            <ChevronDown className="h-4 w-4 transition-transform duration-200" 
              style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
          </div>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent 
        className="space-y-4 pt-4"
        style={{ animation: 'cubic-bezier(.22,1,.36,1)' }}
      >
        <div className="flex items-center justify-between rounded-lg bg-white/5 p-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#9CA3AF]">Contract</span>
            <span className="text-sm font-mono">{contractAddress.slice(0, 6)}...{contractAddress.slice(-4)}</span>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={copyAddress}>
              <Copy className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
              <a href={explorerUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
            isAudited ? 'bg-emerald/20 text-[#10B981]' : 'bg-nova/20 text-nova'
          }`}>
            {isAudited ? 'Audited' : 'Audit in Progress'}
          </span>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
