
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WalletModal } from "./WalletModal";
import { useWallet } from "@/hooks/useWallet";

export function ConnectWalletButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isConnected, address, balance, disconnectWallet } = useWallet();

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Add data attribute to help identify wallet connect buttons
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      {!isConnected ? (
        <Button 
          onClick={handleOpenModal} 
          className="gradient-bg-nova text-white hover:shadow-neon-nova transition-all duration-300"
          data-wallet-connect="true"
        >
          <Wallet className="mr-2 h-4 w-4" /> Connect Wallet
        </Button>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="border-white/20 bg-white/5">
              <span className="font-mono mr-2">{formatAddress(address)}</span>
              <span className="hidden sm:inline font-mono text-emerald">
                {balance.usdc !== undefined ? `${balance.usdc} USDC` : ''}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="glass-card">
            <DropdownMenuLabel>Wallet</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem className="font-mono">
              {address}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span className="mr-2">USDC:</span>
              <span className="font-mono text-emerald">{balance.usdc}</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span className="mr-2">NODOAIx:</span>
              <span className="font-mono text-nova">{balance.nodoaix}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem onClick={disconnectWallet} className="text-red-500 focus:bg-red-500/10">
              Disconnect
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <WalletModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
