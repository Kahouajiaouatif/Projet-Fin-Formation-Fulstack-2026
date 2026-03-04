import { useState, useEffect } from "react";
import AuthForm from "./components/AuthForm.jsx";
import Player from "./components/Player.jsx";
import SongHistoryModal from "./components/SongHistoryModal.jsx";
import SongRequestModal from "./components/SongRequestModal.jsx";
import PlaylistModal from "./components/PlaylistModal.jsx";
import { logout } from "./services/api.js";
import "./styles/main.css";
import "./styles/player.css";

export default function App() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("limbik_user");
    return stored ? JSON.parse(stored) : null;
  });

  const [activeModal, setActiveModal] = useState(null); // "history" | "request" | "playlist"
  const [historyKey, setHistoryKey] = useState(0);

  const handleAuth = (userData) => setUser(userData);

  const handleLogout = async () => {
    await logout();
    setUser(null);
  };

  const openModal = (name) => setActiveModal(name);
  const closeModal = () => setActiveModal(null);

  const handleHistoryUpdate = () => setHistoryKey((k) => k + 1);

  if (!user) {
    return <AuthForm onAuth={handleAuth} />;
  }

  return (
    <div className="app">
      {/* En-tête */}
      <header className="app-header">
        <div className="header-brand">
          <span className="brand-icon">◈</span>
          <div>
            <h1 className="brand-name">LIMBIK RADIO</h1>
            <p className="brand-sub">Fréquences de l'inconscient</p>
          </div>
        </div>
        <div className="header-user">
          <span className="user-email">{user.email}</span>
          <button className="logout-btn" onClick={handleLogout}>
            Déconnexion
          </button>
        </div>
      </header>

      {/* Corps principal */}
      <main className="app-main">
        {/* Lecteur central */}
        <section className="player-section">
          <Player onHistoryUpdate={handleHistoryUpdate} />
        </section>

        {/* Boutons d'action */}
        <nav className="action-nav">
          <button
            className="action-btn"
            onClick={() => openModal("history")}
          >
            <span className="action-icon">◷</span>
            <span>Song History</span>
          </button>

          <button
            className="action-btn"
            onClick={() => openModal("request")}
          >
            <span className="action-icon">⌕</span>
            <span>Song Request</span>
          </button>

          <button
            className="action-btn"
            onClick={() => openModal("playlist")}
          >
            <span className="action-icon">⬇</span>
            <span>Playlist</span>
          </button>
        </nav>
      </main>

      {/* Pied de page */}
      <footer className="app-footer">
        <p>Limbik Radio © 2026 — Diffusion musicale en temps réel</p>
      </footer>

      {/* Modals */}
      {activeModal === "history" && (
        <SongHistoryModal key={historyKey} onClose={closeModal} />
      )}
      {activeModal === "request" && (
        <SongRequestModal onClose={closeModal} />
      )}
      {activeModal === "playlist" && (
        <PlaylistModal onClose={closeModal} />
      )}
    </div>
  );
}
