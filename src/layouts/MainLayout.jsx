import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import "./MainLayout.css";

export default function MainLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) setProfile(snap.data());
      }
    };
    fetchProfile();
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="main-wrapper">
      <header className="topbar">
        <div className="user-info">
          <div
            className="user-box"
            onClick={() => setShowMenu((prev) => !prev)}
          >
            <img
              src={
                user?.photoURL ||
                `https://ui-avatars.com/api/?name=${
                  profile?.firstName || "User"
                }`
              }
              alt="User Avatar"
              className="avatar"
            />
            <span>
              {profile?.firstName} {profile?.lastName}
            </span>
          </div>
          {showMenu && (
            <div className="dropdown-menu">
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
