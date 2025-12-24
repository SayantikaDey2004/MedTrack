import { useEffect, useState } from 'react';
import { Bell, BellOff, Check, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import useAuth from '@/context/auth.context';
import {
  requestNotificationPermission,
  onMessageListener,
  areNotificationsSupported,
  getNotificationPermission,
  disablePushNotifications
} from '@/services/pushNotifications';
import { toast } from 'sonner';

export default function NotificationSetup() {
  const { user } = useAuth();
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);

  useEffect(() => {
    // Only check permissions if user is logged in
    if (!user) {
      setShowPrompt(false);
      return;
    }

    // Check if notifications are supported
    const supported = areNotificationsSupported();
    setIsSupported(supported);

    if (supported) {
      const currentPermission = getNotificationPermission();
      setPermission(currentPermission);

      // Hide prompt if already granted or denied
      if (currentPermission !== 'default') {
        setShowPrompt(false);
      } else {
        // Show prompt only for logged-in users with default permission
        setShowPrompt(true);
      }
    }
  }, [user]);

  useEffect(() => {
    if (permission === 'granted' && user?.uid) {
      // Listen for foreground messages
      const unsubscribe = onMessageListener((payload) => {
        console.log('Received foreground message:', payload);
        // Toast is already shown in the service
      });

      return () => unsubscribe();
    }
  }, [permission, user?.uid]);

  const handleEnableNotifications = async () => {
    if (!user?.uid) {
      toast.error('Please log in to enable notifications');
      return;
    }

    setIsLoading(true);
    try {
      const token = await requestNotificationPermission(user.uid);
      
      if (token) {
        setPermission('granted');
        setShowPrompt(false);
        toast.success('Push notifications enabled! You\'ll receive medication reminders.');
      } else {
        setPermission(getNotificationPermission());
      }
    } catch (error) {
      console.error('Error enabling notifications:', error);
      toast.error('Failed to enable notifications');
    } finally {
      setIsLoading(false);
    }
  };

 {/* const handleDisableNotifications = async () => {
    if (!user?.uid) return;

    setIsLoading(true);
    try {
      await disablePushNotifications(user.uid);
      setShowPrompt(false);
    } catch (error) {
      console.error('Error disabling notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }; */}
  const handleDismiss = () => {
    setShowPrompt(false);
    // Store dismissal in localStorage to not show again for a while
    localStorage.setItem('notificationPromptDismissed', new Date().toISOString());
  };

  // Don't show if user is not logged in
  if (!user) {
    return null;
  }

  // Don't show if not supported or already decided
  if (!isSupported || !showPrompt || permission === 'denied') {
    return null;
  }

  // Already granted - show a subtle indicator
  if (permission === 'granted') {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-50 animate-in slide-in-from-bottom-5 duration-300">
      <Card className="border-2 border-blue-500 shadow-2xl">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-full shrink-0">
              <Bell className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm mb-1">Enable Notifications</h3>
              <p className="text-xs text-gray-600 mb-3">
                Get timely reminders for your medications and never miss a dose!
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={handleEnableNotifications}
                  disabled={isLoading}
                  size="sm"
                  className="flex-1"
                >
                  <Check className="w-4 h-4 mr-1" />
                  Enable
                </Button>
                <Button
                  onClick={handleDismiss}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <X className="w-4 h-4 mr-1" />
                  Later
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Settings component for notification management
export function NotificationSettings() {
  const { user } = useAuth();
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(false);

  useEffect(() => {
    const supported = areNotificationsSupported();
    setIsSupported(supported);

    if (supported) {
      setPermission(getNotificationPermission());
      
      // Check if push is enabled in Firestore
      checkPushStatus();
    }
  }, [user]);

  const checkPushStatus = async () => {
    if (!user?.uid) return;
    
    try {
      const { doc, getDoc } = await import('firebase/firestore');
      const { db } = await import('@/config/firebase');
      
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        setPushEnabled(data.pushEnabled === true);
      }
    } catch (error) {
      console.error('Error checking push status:', error);
    }
  };

  const handleToggleNotifications = async () => {
    if (!user?.uid) return;

    setIsLoading(true);
    try {
      if (pushEnabled) {
        await disablePushNotifications(user.uid);
        setPushEnabled(false);
        toast.success('Push notifications disabled');
      } else {
        const token = await requestNotificationPermission(user.uid);
        if (token) {
          setPermission('granted');
          setPushEnabled(true);
          toast.success('Push notifications enabled');
        }
      }
    } catch (error) {
      console.error('Error toggling notifications:', error);
      toast.error('Failed to update notification settings');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isSupported) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2 text-gray-600">
          <BellOff className="w-5 h-5" />
          <p className="text-sm">Push notifications are not supported in this browser</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full ${pushEnabled ? 'bg-green-100' : 'bg-gray-100'}`}>
            {pushEnabled ? (
              <Bell className="w-5 h-5 text-green-600" />
            ) : (
              <BellOff className="w-5 h-5 text-gray-600" />
            )}
          </div>
          <div>
            <p className="font-medium text-sm">Push Notifications</p>
            <p className="text-xs text-gray-500">
              {pushEnabled ? 'Active - Receiving notifications' : permission === 'denied' ? 'Blocked by browser' : 'Inactive - Not receiving notifications'}
            </p>
          </div>
        </div>
        {permission !== 'denied' && (
          <Button
            onClick={handleToggleNotifications}
            disabled={isLoading}
            size="sm"
            variant={pushEnabled ? 'outline' : 'default'}
          >
            {pushEnabled ? 'Disable' : 'Enable'}
          </Button>
        )}
      </div>
      {permission === 'denied' && (
        <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
          Notifications are blocked. Please enable them in your browser settings.
        </p>
      )}
      {!pushEnabled && permission === 'granted' && (
        <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
          Push notifications are disabled. You won't receive any notifications. Browser permission remains granted but is inactive.
        </p>
      )}
    </div>
  );
}
