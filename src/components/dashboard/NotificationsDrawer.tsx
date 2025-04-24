
import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose
} from '@/components/ui/sheet';

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'success' | 'warning' | 'info' | 'error';
  read: boolean;
}

interface NotificationsDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function NotificationsDrawer({ open, onClose }: NotificationsDrawerProps) {
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

  return (
    <Sheet open={open} onOpenChange={onClose}>
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
  );
}
