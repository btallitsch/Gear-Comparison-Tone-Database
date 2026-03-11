import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  Timestamp,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { GearSetup } from '../types';

const COLLECTION = 'gearSetups';

const fromFirestore = (id: string, data: Record<string, unknown>): GearSetup => ({
  id,
  userId: data.userId as string,
  name: data.name as string,
  guitar: data.guitar as string,
  amp: data.amp as string,
  pedals: (data.pedals as GearSetup['pedals']) ?? [],
  signalChain: data.signalChain as string,
  toneDescription: data.toneDescription as string,
  genre: data.genre as string,
  tags: (data.tags as string[]) ?? [],
  createdAt: (data.createdAt as Timestamp)?.toDate() ?? new Date(),
  updatedAt: (data.updatedAt as Timestamp)?.toDate() ?? new Date(),
});

export const getGearSetups = async (userId: string): Promise<GearSetup[]> => {
  const q = query(
    collection(db, COLLECTION),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => fromFirestore(d.id, d.data() as Record<string, unknown>));
};

export const getGearSetup = async (id: string): Promise<GearSetup | null> => {
  const ref = doc(db, COLLECTION, id);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) return null;
  return fromFirestore(snapshot.id, snapshot.data() as Record<string, unknown>);
};

export const createGearSetup = async (
  userId: string,
  data: Omit<GearSetup, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
  const ref = await addDoc(collection(db, COLLECTION), {
    ...data,
    userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
};

export const updateGearSetup = async (
  id: string,
  data: Partial<Omit<GearSetup, 'id' | 'userId' | 'createdAt'>>
): Promise<void> => {
  const ref = doc(db, COLLECTION, id);
  await updateDoc(ref, {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

export const deleteGearSetup = async (id: string): Promise<void> => {
  const ref = doc(db, COLLECTION, id);
  await deleteDoc(ref);
};

export const getAllPublicSetups = async (): Promise<GearSetup[]> => {
  const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => fromFirestore(d.id, d.data() as Record<string, unknown>));
};
