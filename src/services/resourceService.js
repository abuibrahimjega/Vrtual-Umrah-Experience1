import { db } from "../firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

const resourcesCol = collection(db, "resources");

/**
 * Fetch all resources once, ordered by createdAt desc.
 */
export async function getResources() {
  const q = query(resourcesCol, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/**
 * Subscribe to real-time updates of resources.
 * @param {(resources: Array)} callback
 * @returns {() => void} unsubscribe function
 */
export function subscribeResources(callback) {
  const q = query(resourcesCol, orderBy("createdAt", "desc"));
  const unsub = onSnapshot(q, (snap) => {
    const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(list);
  });
  return unsub;
}

/**
 * Add a new resource.
 */
export async function addResource({ title, url }) {
  return addDoc(resourcesCol, {
    title,
    url,
    createdAt: serverTimestamp(),
  });
}

/**
 * Delete a resource by ID.
 */
export async function deleteResource(id) {
  const ref = doc(db, "resources", id);
  return deleteDoc(ref);
}
