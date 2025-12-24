import { Bell, X, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useEffect, useState, useRef } from 'react';
import { listenToUnreadNotifications } from '@/services/notifications';
import { listenToNotifications, markAsRead, markAllAsRead, type Notification } from '@/api/notification';
import useAuth from '@/context/auth.context';

interface NotificationBellProps {
  onClick?: () => void;
}

export default function NotificationBell({ onClick }: NotificationBellProps) {
  const [hasUnread, setHasUnread] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();
  const userId = user?.uid;
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!userId) return;

    const unsubscribe = listenToUnreadNotifications(userId, (count: number) => {
      setHasUnread(count > 0);
    });

    return () => unsubscribe();
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    const unsubscribe = listenToNotifications(userId, (notificationsList) => {
      setNotifications(notificationsList);
    });

    return () => unsubscribe();
  }, [userId]);

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleBellClick = () => {
    setIsOpen(!isOpen);
    onClick?.();
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read) {
      await markAsRead(notification.id);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (userId) {
      await markAllAsRead(userId);
    }
  };

  const getTimeAgo = (timestamp: any) => {
    if (!timestamp) return 'just now';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hour${Math.floor(diffInSeconds / 3600) > 1 ? 's' : ''} ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} day${Math.floor(diffInSeconds / 86400) > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  const getNotificationIcon = (type: string, read: boolean) => {
    const iconClass = "w-4 h-4";
    if (type === 'warning') {
      return <AlertCircle className={`${iconClass} text-orange-600`} />;
    } else if (type === 'success') {
      return <CheckCircle2 className={`${iconClass} text-green-600`} />;
    } else if (type === 'reminder') {
      return <Clock className={`${iconClass} ${read ? 'text-gray-600' : 'text-blue-600'}`} />;
    }
    return <Bell className={`${iconClass} ${read ? 'text-gray-600' : 'text-blue-600'}`} />;
  };

  const getNotificationBg = (type: string, read: boolean) => {
    if (read) return 'bg-gray-100';
    if (type === 'warning') return 'bg-orange-100';
    if (type === 'success') return 'bg-green-100';
    return 'bg-blue-100';
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative" ref={panelRef}>
      <button 
        onClick={handleBellClick}
        className="p-2 hover:bg-white/10 rounded-full transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
      {hasUnread && (
        <Badge className="absolute top-1.5 right-1.5 w-2 h-2 p-0 bg-red-500 border-2 border-white" />
      )}
      
      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <Card className="shadow-2xl border-2">
            <CardHeader className="flex flex-row items-center justify-between p-4 pb-3 border-b bg-linear-to-r from-indigo-50 to-purple-50">
              <div>
                <h3 className="font-bold text-lg text-gray-900">Notifications</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {unreadCount} unread
                </p>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white rounded-full transition-colors"
                aria-label="Close notifications"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </CardHeader>
            <CardContent className="p-0 max-h-128 overflow-y-auto">
              {notifications.length > 0 ? (
                <div className="divide-y">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                        !notification.read ? 'bg-blue-50/30 border-l-4 border-l-blue-500' : 'border-l-4 border-l-transparent'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-full ${getNotificationBg(notification.type, notification.read)}`}>
                          {getNotificationIcon(notification.type, notification.read)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className={`font-semibold text-sm ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                              {notification.title}
                            </p>
                            {!notification.read && (
                              <Badge className="w-2 h-2 p-0 bg-blue-500 shrink-0 mt-1" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {getTimeAgo(notification.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Bell className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-900 mb-1">No notifications yet</p>
                  <p className="text-xs text-gray-500">We'll notify you when something important happens</p>
                </div>
              )}
            </CardContent>
            {notifications.length > 0 && unreadCount > 0 && (
              <div className="p-3 border-t bg-gray-50">
                <button 
                  onClick={handleMarkAllAsRead}
                  className="w-full text-center text-sm text-indigo-600 hover:text-indigo-700 font-semibold py-2 hover:bg-indigo-50 rounded-lg transition-colors"
                >
                  Mark all as read
                </button>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
