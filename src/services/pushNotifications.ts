import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import type { Messaging } from 'firebase/messaging';
import { app } from '@/config/firebase';
import { doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { toast } from 'sonner';

let messaging: Messaging | null = null;

// Initialize Firebase Messaging
const initializeMessaging = () => {
  try {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      messaging = getMessaging(app);
      return messaging;
    }
    console.warn('Push notifications not supported in this browser');
    return null;
  } catch (error) {
    console.error('Error initializing messaging:', error);
    return null;
  }
};

// Request notification permission and get FCM token
export const requestNotificationPermission = async (userId: string): Promise<string | null> => {
  try {
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      console.log('Notification permission granted');
      
      if (!messaging) {
        messaging = initializeMessaging();
      }
      
      if (!messaging) {
        throw new Error('Messaging not initialized');
      }

      // Register service worker
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      await navigator.serviceWorker.ready;
      
      // Get FCM token
      const token = await getToken(messaging, {
        vapidKey: 'BJxlog9OUaUig-yF1x7deyYcpRNkaiOfEnNEJYDBr-MWb58SAUSU5dXPzkO_FuHVv4_VC6GTj7qtPXmkmoeobB8', // Replace with your VAPID key from Firebase Console
        serviceWorkerRegistration: registration
      });

      if (token) {
        console.log('FCM Token:', token);
        
        // Save token to Firestore
        await saveFCMToken(userId, token);
        
        return token;
      } else {
        console.log('No registration token available');
        return null;
      }
    } else if (permission === 'denied') {
      console.log('Notification permission denied');
      toast.error('Please enable notifications to receive medication reminders');
      return null;
    } else {
      console.log('Notification permission dismissed');
      return null;
    }
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    toast.error('Failed to enable push notifications');
    return null;
  }
};

// Save FCM token to user document
const saveFCMToken = async (userId: string, token: string) => {
  try {
    const userRef = doc(db, 'users', userId);
    
    // Check if user document exists
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      await updateDoc(userRef, {
        fcmTokens: arrayUnion(token),
        pushEnabled: true,
        lastTokenUpdate: new Date()
      });
    } else {
      // Create user document if it doesn't exist
      await updateDoc(userRef, {
        fcmTokens: [token],
        pushEnabled: true,
        lastTokenUpdate: new Date()
      });
    }
    
    console.log('FCM token saved to Firestore');
  } catch (error) {
    console.error('Error saving FCM token:', error);
  }
};

// Listen for foreground messages
export const onMessageListener = (callback: (payload: { notification?: { title?: string; body?: string }; data?: Record<string, string> }) => void) => {
  if (!messaging) {
    messaging = initializeMessaging();
  }
  
  if (!messaging) {
    console.warn('Messaging not available');
    return () => {};
  }

  return onMessage(messaging, (payload) => {
    console.log('Foreground message received:', payload);
    
    // Show toast notification
    if (payload.notification) {
      toast(payload.notification.title || 'Notification', {
        description: payload.notification.body,
        duration: 5000,
      });
    }
    
    callback(payload);
  });
};

// Check if notifications are supported
export const areNotificationsSupported = (): boolean => {
  return 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;
};

// Get current notification permission
export const getNotificationPermission = (): NotificationPermission => {
  if ('Notification' in window) {
    return Notification.permission;
  }
  return 'denied';
};

// Disable push notifications
export const disablePushNotifications = async (userId: string) => {
  try {
    const userRef = doc(db, 'users', userId);
    const { setDoc } = await import('firebase/firestore');
    
    // Unsubscribe from push notifications
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration('/firebase-messaging-sw.js');
      if (registration) {
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
          await subscription.unsubscribe();
          console.log('Push subscription unsubscribed');
        }
      }
    }
    
    // Update Firestore - remove all FCM tokens and disable push
    await setDoc(userRef, {
      pushEnabled: false,
      fcmTokens: []
    }, { merge: true });
    
    console.log('Push notifications disabled');
  } catch (error) {
    console.error('Error disabling push notifications:', error);
    throw error;
  }
};
