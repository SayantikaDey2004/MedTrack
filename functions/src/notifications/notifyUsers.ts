import * as admin from "firebase-admin";

const db = admin.firestore();

/**
 * Notification types matching frontend interface
 */
export type NotificationType = 'reminder' | 'warning' | 'success' | 'info';

/**
 * Creates in-app notification + sends push (if enabled)
 */
export async function notifyUser(
  userId: string,
  title: string,
  message: string,
  type: NotificationType = 'info'
) {
  // 1️⃣ Always create in-app notification
  await db.collection("notifications").add({
    userId,
    title,
    message,
    type,
    read: false,
    createdAt: admin.firestore.Timestamp.now(),
  });

  // 2️⃣ Get user push settings
  const userSnap = await db.doc(`users/${userId}`).get();
  const user = userSnap.data();

  if (!user?.pushEnabled || !user?.fcmTokens?.length) {
    return;
  }

  // 3️⃣ Send push to all user devices
  const messages = user.fcmTokens.map((token: string) => ({
    token,
    notification: {
      title,
      body: message,
    },
    webpush: {
      headers: {
        Urgency: "high",
      },
    },
  }));

  await admin.messaging().sendEach(messages);
}

/**
 * Helper functions for common notification scenarios
 */

export async function notifyMedicationReminder(
  userId: string,
  medicineName: string,
  dosage?: string
) {
  const message = dosage 
    ? `Time to take your ${medicineName} (${dosage})`
    : `Time to take your ${medicineName}`;
  
  await notifyUser(
    userId,
    'Medication Reminder',
    message,
    'reminder'
  );
}

export async function notifyLowStock(
  userId: string,
  medicineName: string,
  remainingDoses: number
) {
  await notifyUser(
    userId,
    'Low Stock Alert',
    `${medicineName} is running low. Only ${remainingDoses} dose${remainingDoses !== 1 ? 's' : ''} left.`,
    'warning'
  );
}

export async function notifyDoseCompleted(
  userId: string,
  medicineName: string,
  timeOfDay?: string
) {
  const message = timeOfDay
    ? `${timeOfDay} dose of ${medicineName} marked as complete`
    : `Dose of ${medicineName} marked as complete`;
  
  await notifyUser(
    userId,
    'Dose Completed',
    message,
    'success'
  );
}

export async function notifyUpcomingDose(
  userId: string,
  medicineName: string,
  minutesUntil: number
) {
  await notifyUser(
    userId,
    'Upcoming Dose',
    `${medicineName} medication due in ${minutesUntil} minutes`,
    'reminder'
  );
}
