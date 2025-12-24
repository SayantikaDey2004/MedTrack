import { onSchedule } from "firebase-functions/v2/scheduler";
import * as admin from "firebase-admin";
import { notifyMedicationReminder, notifyLowStock, notifyUpcomingDose } from "../notifications/notifyUsers";

const db = admin.firestore();

/**
 * Runs every minute to check for medication reminders
 * Sends notifications 30 minutes before and at the scheduled time
 */
export const medicineReminders = onSchedule("every 1 minutes", async (event) => {
  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5); // HH:mm format
  
  // Calculate time 30 minutes from now for upcoming dose reminders
  const futureTime = new Date(now.getTime() + 30 * 60000);
  const upcomingTime = futureTime.toTimeString().slice(0, 5);

  try {
    // Get all active medicines with reminders
    const medicinesSnapshot = await db
      .collection("medicines")
      .where("isActive", "==", true)
      .get();

    for (const medicineDoc of medicinesSnapshot.docs) {
      const medicine = medicineDoc.data();
      const { userId, name, dosage, reminderTimes, currentStock, dosesPerDay } = medicine;

      // Skip if no reminder times set
      if (!reminderTimes || !Array.isArray(reminderTimes)) continue;

      // Check for current time matches (send reminder now)
      if (reminderTimes.includes(currentTime)) {
        await notifyMedicationReminder(userId, name, dosage);
      }

      // Check for upcoming time matches (send 30-min warning)
      if (reminderTimes.includes(upcomingTime)) {
        await notifyUpcomingDose(userId, name, 30);
      }

      // Check for low stock (less than 3 days worth)
      if (currentStock && dosesPerDay) {
        const daysRemaining = currentStock / dosesPerDay;
        if (daysRemaining <= 3 && daysRemaining > 0) {
          // Only send low stock notification once per day (check if already sent today)
          const today = now.toISOString().split('T')[0];
          const lastNotifiedDoc = await db
            .collection("notifications")
            .where("userId", "==", userId)
            .where("type", "==", "warning")
            .where("message", ">=", `${name} is running low`)
            .where("message", "<=", `${name} is running low\uf8ff`)
            .orderBy("message")
            .orderBy("createdAt", "desc")
            .limit(1)
            .get();

          const shouldNotify = lastNotifiedDoc.empty || 
            lastNotifiedDoc.docs[0].data().createdAt.toDate().toISOString().split('T')[0] !== today;

          if (shouldNotify) {
            await notifyLowStock(userId, name, Math.floor(currentStock));
          }
        }
      }
    }

    console.log(`Medication reminders checked at ${currentTime}`);
  } catch (error) {
    console.error("Error processing medication reminders:", error);
  }
});
