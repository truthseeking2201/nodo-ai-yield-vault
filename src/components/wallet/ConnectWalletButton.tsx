
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, LogOut, Wallet } from "lucide-react";
import { TokenIcon } from "@/components/shared/TokenIcons";
import { useToast } from "@/hooks/use-toast";
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
  const { isConnected, address, balance, disconnect } = useWallet();
  const { toast } = useToast();

  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const handleCopyAddress = async () => {
    await navigator.clipboard.writeText(address);
    toast({
      title: "Address copied",
      duration: 2000,
    });
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      {!isConnected ? (
        <Button 
          onClick={handleOpenModal} 
          className="gradient-bg-nova text-[#0E0F11] hover:shadow-neon-nova transition-all duration-300"
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
          <DropdownMenuContent 
            align="end" 
            className="w-[320px] p-6 rounded-[20px] border border-white/[0.06] bg-white/[0.04] shadow-lg backdrop-blur-xl"
          >
            <div className="flex flex-col space-y-6">
              {/* Header */}
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-[#FF8800]" />
                <span className="text-white font-bold">Wallet</span>
              </div>

              {/* Address */}
              <div className="relative">
                <button 
                  onClick={handleCopyAddress}
                  className="w-full text-left bg-black/40 rounded-xl px-3 py-2 hover:bg-[#1A1B1E] transition-colors group wallet-address"
                >
                  <span className="font-mono text-xs text-gray-200 block truncate pr-8">
                    {address}
                  </span>
                  <Copy className="w-4 h-4 text-gray-400 group-hover:text-gray-300 absolute right-3 top-1/2 -translate-y-1/2" />
                </button>
              </div>

              <DropdownMenuSeparator className="bg-[#262B30] my-0" />

              {/* Balances */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TokenIcon token="USDC" size={16} />
                    <span className="text-gray-400 text-sm">USDC</span>
                  </div>
                  <span className="font-mono text-sm text-emerald">{balance.usdc}</span>
                </div>
              </div>

              <DropdownMenuSeparator className="bg-[#262B30] my-0" />

              {/* Disconnect Button */}
              <button
                onClick={disconnect}
                className="w-full h-11 rounded-xl border border-[#EF4444] text-[#EF4444] flex items-center justify-center gap-2 hover:bg-[rgba(239,68,68,0.12)] hover:text-white transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Disconnect</span>
              </button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <WalletModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
