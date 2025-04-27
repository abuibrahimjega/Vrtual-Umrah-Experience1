// src/pages/AuthPage.jsx

import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import "./AuthPage.css";

export default function AuthPage() {
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");

  // helper to detect admin
  async function checkIsAdmin(uid) {
    const adminRef = doc(db, "adminUsers", uid);
    const snap = await getDoc(adminRef);
    return snap.exists();
  }

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError("");
    try {
      let userCred;
      if (isLogin) {
        userCred = await login(email, password);
      } else {
        userCred = await signup(email, password, firstName, lastName);
      }

      const uid = userCred.user.uid;
      const isAdmin = await checkIsAdmin(uid);
      navigate(isAdmin ? "/admin/resources" : "/home");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const uid = result.user.uid;
      const isAdmin = await checkIsAdmin(uid);
      navigate(isAdmin ? "/admin/resources" : "/home");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>{isLogin ? "Login" : "Sign Up"}</h2>

      <form onSubmit={handleEmailAuth}>
        {!isLogin && (
          <>
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">{isLogin ? "Login" : "Sign Up"}</button>
      </form>

      <button onClick={handleGoogleLogin}>Continue with Google</button>

      <p>
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <button onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Sign Up" : "Login"}
        </button>
      </p>

      {error && <p className="error">{error}</p>}
    </div>
  );
}
