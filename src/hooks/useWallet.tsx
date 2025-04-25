
import { create } from 'zustand'
import { useCallback, useEffect } from 'react'

interface WalletState {
  address: string | null
  isConnected: boolean
  isConnecting: boolean
  isModalOpen: boolean
  balance: {
    usdc: number
  }
  connect: () => Promise<void>
  disconnect: () => void
  openModal: () => void
  closeModal: () => void
}

const useWalletStore = create<WalletState>((set) => ({
  address: null,
  isConnected: false,
  isConnecting: false,
  isModalOpen: false,
  balance: {
    usdc: 0
  }, // Initialize with default values
  connect: async () => {
    set({ isConnecting: true })
    // Simulate connecting
    await new Promise(resolve => setTimeout(resolve, 1000))
    set({ 
      address: '0x7d783c975da6e3b5ff8259436d4f7da675da6',
      isConnected: true,
      isConnecting: false,
      isModalOpen: false,
      balance: {
        usdc: 1250.45
      }
    })
  },
  disconnect: () => {
    set({ 
      address: null, 
      isConnected: false,
      isModalOpen: false,
      balance: {
        usdc: 0
      }
    })
  },
  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false })
}))

export const useWallet = () => {
  const { 
    address, 
    isConnected, 
    isConnecting,
    isModalOpen,
    balance,
    connect, 
    disconnect,
    openModal,
    closeModal
  } = useWalletStore()

  // Automatically reconnect if previously connected
  useEffect(() => {
    const hasConnectedBefore = localStorage.getItem('wallet-connected') === 'true'
    if (hasConnectedBefore && !isConnected && !isConnecting) {
      connect()
    }
  }, [connect, isConnected, isConnecting])

  // Save connection state to localStorage
  useEffect(() => {
    if (isConnected) {
      localStorage.setItem('wallet-connected', 'true')
    } else {
      localStorage.removeItem('wallet-connected')
    }
  }, [isConnected])

  // Function to open wallet modal specifically for connection
  const openWalletModal = useCallback(() => {
    openModal();
    
    // Add a data attribute to the document body to trigger the modal
    document.querySelector('[data-wallet-connect]')?.dispatchEvent(
      new MouseEvent('click', { bubbles: true })
    );
  }, [openModal]);

  return { 
    address, 
    isConnected, 
    isConnecting,
    isModalOpen,
    balance,
    connect, 
    disconnect,
    openModal,
    closeModal,
    openWalletModal
  }
}
