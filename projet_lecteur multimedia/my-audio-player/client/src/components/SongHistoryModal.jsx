import { useState, useEffect } from "react";
import { getHistory } from "../services/api.js";

export default function SongHistoryModal({ onClose }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getHistory()
      .then(setHistory)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>◈ Historique</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {loading && <p className="modal-loading">Chargement...</p>}
          {error && <p className="modal-error">{error}</p>}
          {!loading && !error && history.length === 0 && (
            <p className="modal-empty">Aucune piste écoutée pour l'instant.</p>
          )}
          {!loading && history.map((track, i) => (
            <div key={i} className="history-item">
              <span className="history-index">{String(i + 1).padStart(2, "0")}</span>
              <div className="history-info">
                <span className="history-title">{track.title}</span>
                <span className="history-artist">{track.artist}</span>
              </div>
              {track.played_at && (
                <span className="history-time">{formatTime(track.played_at)}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
