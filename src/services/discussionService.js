import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";

// Get one discussion post
export async function getDiscussion(postId) {
  const postRef = doc(db, "discussions", postId);
  const postSnap = await getDoc(postRef);
  if (postSnap.exists()) {
    return { id: postSnap.id, ...postSnap.data() };
  }
  return null;
}

// Get all comments for a discussion
export async function getComments(postId) {
  const commentsRef = collection(db, "discussions", postId, "comments");
  const q = query(commentsRef, orderBy("createdAt", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// Add new comment to discussion
export async function addComment(postId, text, authorName) {
  const postRef = doc(db, "discussions", postId);
  const comment = {
    text,
    createdBy: authorName,
    createdAt: serverTimestamp(),
  };
  await addDoc(collection(postRef, "comments"), comment);
}

export async function getAllPosts() {
  const q = query(collection(db, "discussions"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// Delete a discussion post by ID
export async function deletePost(postId) {
  const postRef = doc(db, "discussions", postId);
  await deleteDoc(postRef);
}
