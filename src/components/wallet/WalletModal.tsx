
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";

interface WalletModalProps {
  open: boolean;
  onClose: () => void;
}

export function WalletModal({ open, onClose }: WalletModalProps) {
  const { connect, isConnecting } = useWallet();

  const handleConnect = async () => {
    try {
      await connect();
      onClose();
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="glass-card border-white/20 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">Connect Your Wallet</DialogTitle>
          <DialogDescription className="text-center text-white/60">
            Connect your wallet to access NODO AI Vaults
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <Button 
            onClick={handleConnect} 
            disabled={isConnecting}
            className="gradient-bg-nova hover:shadow-neon-nova w-full h-14 text-lg transition-all duration-300"
          >
            <Wallet className="mr-2 h-5 w-5" />
            {isConnecting ? "Connecting..." : "Sui Wallet"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
