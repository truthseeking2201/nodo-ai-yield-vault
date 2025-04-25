
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ConnectWalletButton } from "@/components/wallet/ConnectWalletButton";
import { Bell } from "lucide-react";
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose
} from "@/components/ui/sheet";
import { X } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'success' | 'warning' | 'info' | 'error';
  read: boolean;
}

export function AppHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const location = useLocation();

  // Mock notifications for demo
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Deposit Successful',
      message: 'Your deposit of $500 to DEEP-SUI vault was successful.',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      type: 'success',
      read: false
    },
    {
      id: '2',
      title: 'Unlock Soon',
      message: 'Your CETUS-SUI position will unlock in 2 days.',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      type: 'info',
      read: false
    },
    {
      id: '3',
      title: 'Performance Alert',
      message: 'SUI-USDC vault has gained 3.2% in the last 24 hours.',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      type: 'info',
      read: true
    }
  ]);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const getIconForType = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return (
          <div className="w-8 h-8 rounded-full bg-emerald/20 flex items-center justify-center text-emerald">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        );
      case 'warning':
        return (
          <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 9V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M12 16V16.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M12 2L21 19H3L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        );
      case 'error':
        return (
          <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M18 18L6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-orion/20 flex items-center justify-center text-orion">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 16V16.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M12 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
        );
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return `${diffDays}d ago`;
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-nodo-darker/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center space-x-2 group">
            <img 
              src="/lovable-uploads/5e426b4d-ccda-486b-8980-761ff3c70294.png" 
              alt="NODO AI Logo" 
              className="h-8 w-auto transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              Vaults
            </Link>
            <Link 
              to="/dashboard" 
              className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
            >
              Dashboard
            </Link>
          </nav>
        </div>

        {/* Connect Wallet and Notifications */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setIsNotificationsOpen(true)}
            className="relative"
          >
            <Bell className="h-5 w-5" />
            {notifications.some(n => !n.read) && (
              <span className="absolute top-1 right-1 h-2 w-2 bg-orange-500 rounded-full"></span>
            )}
          </Button>

          <ConnectWalletButton />

          {/* Mobile Menu Toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" x2="20" y1="12" y2="12"/>
              <line x1="4" x2="20" y1="6" y2="6"/>
              <line x1="4" x2="20" y1="18" y2="18"/>
            </svg>
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden container bg-nodo-dark/90 backdrop-blur-lg border border-white/10 rounded-b-lg">
          <nav className="flex flex-col space-y-4 p-4">
            <Link 
              to="/" 
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Vaults
            </Link>
            <Link 
              to="/dashboard" 
              className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
          </nav>
        </div>
      )}

      {/* Notifications Drawer */}
      <Sheet open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader className="flex flex-row items-center justify-between border-b border-white/10 pb-4">
            <SheetTitle>Notifications</SheetTitle>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                Mark all as read
              </Button>
              <SheetClose asChild>
                <Button variant="ghost" size="icon">
                  <X className="h-4 w-4" />
                </Button>
              </SheetClose>
            </div>
          </SheetHeader>

          <div className="py-4">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-white/60">
                <p>No notifications yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id}
                    className={`flex items-start p-3 rounded-lg transition-all ${notification.read ? 'bg-transparent' : 'bg-white/5'}`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="mr-3">
                      {getIconForType(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between">
                        <h4 className={`font-medium text-sm ${notification.read ? 'text-white/70' : 'text-white'}`}>
                          {notification.title}
                        </h4>
                        <span className="text-xs text-white/40">{formatTimestamp(notification.timestamp)}</span>
                      </div>
                      <p className={`text-xs mt-1 ${notification.read ? 'text-white/60' : 'text-white/80'}`}>
                        {notification.message}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 rounded-full bg-nova ml-2 mt-1"></div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
