import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";
import MainLayout from "../layouts/MainLayout";

export default function AdminResourcesPage() {
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    const q = query(collection(db, "resources"), orderBy("createdAt", "desc"));
    // real-time listener
    const unsub = onSnapshot(q, (snap) => {
      setResources(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;
    await addDoc(collection(db, "resources"), {
      title,
      url,
      createdAt: new Date(),
    });
    setTitle("");
    setUrl("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this resource?")) return;
    await deleteDoc(doc(db, "resources", id));
  };

  return (
    <MainLayout>
      <h2>Admin: Educational Resources</h2>
      <button onClick={() => navigate(-1)}>← Back</button>

      <form onSubmit={handleAdd} style={{ margin: "1rem 0" }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
        />
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://..."
          required
        />
        <button type="submit">Add</button>
      </form>

      <ul>
        {resources.map((r) => (
          <li key={r.id}>
            <a href={r.url} target="_blank" rel="noopener noreferrer">
              {r.title}
            </a>
            <button onClick={() => handleDelete(r.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </MainLayout>
  );
}
