# Push Notifications Setup Guide

This guide will help you set up push notifications for MedTrack.

## Prerequisites

1. Firebase project with Cloud Messaging enabled
2. VAPID key from Firebase Console

## Setup Steps

### 1. Get Your VAPID Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (medtrack-v1)
3. Go to Project Settings > Cloud Messaging
4. Under "Web Push certificates", generate a new key pair if you don't have one
5. Copy the "Key pair" value (this is your VAPID key)

### 2. Update the Code

Open `src/services/pushNotifications.ts` and replace `YOUR_VAPID_KEY_HERE` with your actual VAPID key:

```typescript
const token = await getToken(messaging, {
  vapidKey: 'YOUR_ACTUAL_VAPID_KEY_HERE',
  serviceWorkerRegistration: registration
});
```

### 3. Update Service Worker

The service worker is located at `public/firebase-messaging-sw.js`. Make sure the Firebase configuration matches your project.

### 4. Test Push Notifications

1. Run your app: `npm run dev`
2. Open the app in a browser
3. Log in to your account
4. You should see a notification permission prompt
5. Click "Enable" to allow notifications

## How It Works

### In-App Notifications

- All notifications are stored in the Firestore `notifications` collection
- The notification bell component listens to real-time updates
- Users can mark notifications as read or mark all as read

### Push Notifications

- When a user enables push notifications, an FCM token is saved to their user document
- The backend sends push notifications using Firebase Admin SDK
- Notifications appear even when the app is closed or in the background
- Users can click notifications to open the app

## Backend Integration

The backend functions in `functions/src/notifications/notifyUsers.ts` handle:

- Creating in-app notifications
- Sending push notifications to user devices
- Helper functions for common notification types:
  - `notifyMedicationReminder()`
  - `notifyLowStock()`
  - `notifyDoseCompleted()`
  - `notifyUpcomingDose()`

## Scheduled Reminders

The `functions/src/scheduled/reminders.ts` function runs every minute to:

- Check for scheduled medication times
- Send notifications at the exact time
- Send 30-minute advance warnings
- Check for low stock and alert users

## User Settings

Users can manage notifications in the profile page:

```tsx
import { NotificationSettings } from '@/components/notification-setup';

// In your profile page component
<NotificationSettings />
```

## Troubleshooting

### Notifications not working?

1. **Check browser support**: Notifications require HTTPS (or localhost)
2. **Check permissions**: Make sure browser notifications are not blocked
3. **Check Firebase config**: Verify your Firebase configuration is correct
4. **Check VAPID key**: Make sure you've added your actual VAPID key
5. **Check service worker**: Open DevTools > Application > Service Workers to see if it's registered

### Testing in Development

- Notifications work on `localhost` without HTTPS
- Use Chrome DevTools to simulate different notification states
- Check the Console for any error messages

### Common Issues

**"Notifications not supported"**
- Make sure you're using HTTPS or localhost
- Check if the browser supports notifications

**"Permission denied"**
- User has blocked notifications
- They need to enable them in browser settings

**"No FCM token"**
- Check if service worker is registered
- Verify VAPID key is correct
- Check Firebase Cloud Messaging is enabled in Firebase Console

## Firebase Functions Deployment

Deploy your notification functions:

```bash
cd functions
npm run build
firebase deploy --only functions
```

## Testing Push Notifications

You can test push notifications using the Firebase Console:

1. Go to Cloud Messaging in Firebase Console
2. Click "Send your first message"
3. Add a notification title and text
4. Select your app
5. Send test message

## Production Checklist

- [ ] VAPID key is configured
- [ ] Service worker is registered correctly
- [ ] Firebase Cloud Messaging is enabled
- [ ] Functions are deployed
- [ ] HTTPS is enabled in production
- [ ] User permissions are properly requested
- [ ] Error handling is in place
- [ ] Analytics for notification engagement (optional)

## Next Steps

- Add notification preferences (e.g., sound, vibration)
- Add notification categories
- Implement notification history
- Add action buttons to notifications
- Track notification engagement
