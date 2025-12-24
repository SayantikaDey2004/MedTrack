import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/config/firebase";

export function listenToUnreadNotifications(userId: string, setCount: (count: number) => void) {
  const q = query(
    collection(db, "notifications"),
    where("userId", "==", userId),
    where("read", "==", false)
  );

  return onSnapshot(q, (snapshot) => {
    setCount(snapshot.size);
  });
}
