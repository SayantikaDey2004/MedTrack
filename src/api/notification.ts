import { collection, query, where, orderBy, limit, onSnapshot, getDocs, updateDoc, doc, Timestamp } from "firebase/firestore";
import { db } from "@/config/firebase";

export interface Notification {
  id: string;
  userId: string;
  type: 'reminder' | 'warning' | 'success' | 'info';
  title: string;
  message: string;
  read: boolean;
  createdAt: Timestamp;
}

export const getNotifications = async (userId: string, limitCount = 20): Promise<Notification[]> => {
  const q = query(
    collection(db, "notifications"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
    limit(limitCount)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Notification));
};

export const listenToNotifications = (userId: string, callback: (notifications: Notification[]) => void) => {
  const q = query(
    collection(db, "notifications"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
    limit(20)
  );

  return onSnapshot(q, (snapshot) => {
    const notifications = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Notification));
    callback(notifications);
  });
};

export const markAsRead = async (notificationId: string) => {
  const notificationRef = doc(db, "notifications", notificationId);
  await updateDoc(notificationRef, {
    read: true
  });
};

export const markAllAsRead = async (userId: string) => {
  const q = query(
    collection(db, "notifications"),
    where("userId", "==", userId),
    where("read", "==", false)
  );

  const snapshot = await getDocs(q);
  const updatePromises = snapshot.docs.map(doc => 
    updateDoc(doc.ref, { read: true })
  );
  
  await Promise.all(updatePromises);
};