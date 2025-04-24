
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ConnectWalletButton } from "@/components/wallet/ConnectWalletButton";
import { Wallet } from "lucide-react";

export function AppHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-nodo-darker/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold gradient-text-nova">NODO AI</span>
            <span className="text-white/60 hidden md:inline">Yield Vaults</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4">
          <Link to="/" className="text-sm text-white/80 hover:text-white">
            Vaults
          </Link>
          <Link to="/dashboard" className="text-sm text-white/80 hover:text-white">
            Dashboard
          </Link>
        </nav>

        {/* Connect Wallet Button */}
        <div className="flex items-center">
          <ConnectWalletButton />

          {/* Mobile Menu Toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden ml-2" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-menu">
              <line x1="4" x2="20" y1="12" y2="12"/>
              <line x1="4" x2="20" y1="6" y2="6"/>
              <line x1="4" x2="20" y1="18" y2="18"/>
            </svg>
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden container bg-nodo-dark border border-white/10 rounded-b-lg">
          <nav className="flex flex-col space-y-4 p-4">
            <Link 
              to="/" 
              className="text-white/80 hover:text-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Vaults
            </Link>
            <Link 
              to="/dashboard" 
              className="text-white/80 hover:text-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
