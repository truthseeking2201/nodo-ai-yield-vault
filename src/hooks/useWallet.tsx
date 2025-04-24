
import { create } from 'zustand';
import { toast } from '@/components/ui/use-toast';

interface WalletState {
  isConnected: boolean;
  isConnecting: boolean;
  address: string;
  balance: {
    usdc: number;
    nodoaix: number;
  };
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

// Mock wallet data for the prototype
const MOCK_ADDRESS = '0x7d783c53c48ebaec29bdafc7a950138c6a173ac75da6';
const MOCK_BALANCE = {
  usdc: 1250.45,
  nodoaix: 522.75,
};

export const useWallet = create<WalletState>((set) => ({
  isConnected: false,
  isConnecting: false,
  address: '',
  balance: {
    usdc: 0,
    nodoaix: 0,
  },
  connectWallet: async () => {
    try {
      set({ isConnecting: true });
      
      // Simulate wallet connection delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      set({ 
        isConnected: true, 
        isConnecting: false,
        address: MOCK_ADDRESS,
        balance: MOCK_BALANCE
      });
      
      toast({
        title: "Wallet Connected",
        description: "Your Sui wallet has been connected successfully.",
      });
    } catch (error) {
      set({ isConnecting: false });
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  },
  disconnectWallet: () => {
    set({ 
      isConnected: false,
      address: '',
      balance: { usdc: 0, nodoaix: 0 }
    });
    
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    });
  },
}));
