
import { useState } from 'react';
import { Shield, Copy, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useToast } from '@/hooks/use-toast';

interface VaultSecurityInfoProps {
  contractAddress: string;
  isAudited: boolean;
  explorerUrl: string;
}

export function VaultSecurityInfo({ 
  contractAddress, 
  isAudited, 
  explorerUrl 
}: VaultSecurityInfoProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const copyAddress = async () => {
    await navigator.clipboard.writeText(contractAddress);
    toast({
      title: "Address copied",
      description: "Contract address has been copied to clipboard",
    });
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="flex w-full justify-between p-0 hover:bg-white/5">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <span className="font-medium">Security & Audit</span>
          </div>
          <span className="text-white/60">
            {isOpen ? 'Show less' : 'Show more'}
          </span>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-4 pt-4">
        <div className="flex items-center justify-between rounded-lg bg-white/5 p-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-white/60">Contract</span>
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
            isAudited ? 'bg-emerald/20 text-emerald' : 'bg-nova/20 text-nova'
          }`}>
            {isAudited ? 'Audited' : 'Audit in Progress'}
          </span>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
