// db.ts — Firebase Firestore Session Manager for CONTROLSAI
// Replaces local IndexedDB with secure cloud storage.

import { collection, doc, setDoc, getDoc, getDocs, deleteDoc, query, orderBy, writeBatch } from 'firebase/firestore';
import { dbFirestore } from './firebase';
import type { Session } from './types';

export async function checkUserAccess(uid: string, email: string): Promise<{ approved: boolean }> {
  try {
    const docRef = doc(dbFirestore, `users/${uid}`);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      if (data.status === 'approved') return { approved: true };
      return { approved: false };
    } else {
      await setDoc(docRef, {
        email,
        status: 'pending',
        createdAt: Date.now()
      });
      return { approved: false };
    }
  } catch (error) {
    console.error("Access check failed", error);
    return { approved: false };
  }
}

export async function fetchUserSessions(userId: string): Promise<Session[]> {
  try {
    const q = query(
      collection(dbFirestore, `users/${userId}/sessions`),
      orderBy('updatedAt', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => d.data() as Session);
  } catch (err) {
    console.error("Firestore Error (fetchUserSessions):", err);
    return [];
  }
}

export async function syncUserSession(userId: string, session: Session): Promise<void> {
  if (!userId) return;
  try {
    const sessionRef = doc(dbFirestore, `users/${userId}/sessions/${session.id}`);
    await setDoc(sessionRef, {
      ...session,
      updatedAt: Date.now()
    });
  } catch (err) {
    console.error("Firestore Error (syncUserSession):", err);
  }
}

export async function removeUserSession(userId: string, sessionId: string): Promise<void> {
  if (!userId) return;
  try {
    const sessionRef = doc(dbFirestore, `users/${userId}/sessions/${sessionId}`);
    await deleteDoc(sessionRef);
  } catch (err) {
    console.error("Firestore Error (removeUserSession):", err);
  }
}

export async function clearAllUserSessions(userId: string, sessions: Session[]): Promise<void> {
  if (!userId) return;
  try {
    const batch = writeBatch(dbFirestore);
    sessions.forEach(s => {
      const ref = doc(dbFirestore, `users/${userId}/sessions/${s.id}`);
      batch.delete(ref);
    });
    await batch.commit();
  } catch (err) {
    console.error("Firestore Error (clearAllUserSessions):", err);
  }
}
