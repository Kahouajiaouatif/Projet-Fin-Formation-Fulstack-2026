import { useState } from "react";
import { downloadPlaylist } from "../services/api.js";

export default function PlaylistModal({ onClose }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    setError("");
    try {
      await downloadPlaylist();
      setDone(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal modal-sm" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>◈ Playlist</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body playlist-body">
          <div className="playlist-icon">♫</div>
          <p className="playlist-info">
            Télécharge ta playlist des titres écoutés au format <strong>.pls</strong> pour l'ouvrir avec VLC ou tout autre lecteur compatible.
          </p>

          {error && <p className="modal-error">{error}</p>}
          {done && <p className="playlist-success">✓ Playlist téléchargée !</p>}

          <button
            className="playlist-download-btn"
            onClick={handleDownload}
            disabled={loading}
          >
            {loading ? "Génération..." : "Télécharger ma playlist (.pls)"}
          </button>

          <p className="playlist-tip">
            💡 Tu n'as pas VLC ?{" "}
            <a href="https://www.videolan.org/vlc/" target="_blank" rel="noreferrer">
              Télécharger VLC
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
