import { useState } from "react";
import { searchTracks } from "../services/api.js";

export default function SongRequestModal({ onClose }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (query.trim().length < 2) return;

    setLoading(true);
    setError("");
    setSearched(true);

    try {
      const data = await searchTracks(query);
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>◈ Recherche</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <form className="search-form" onSubmit={handleSearch}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Artiste ou titre..."
              className="search-input"
              autoFocus
            />
            <button type="submit" className="search-btn" disabled={loading}>
              {loading ? "..." : "Chercher"}
            </button>
          </form>

          {error && <p className="modal-error">{error}</p>}

          {!loading && searched && results.length === 0 && (
            <p className="modal-empty">Aucun résultat pour « {query} »</p>
          )}

          <div className="search-results">
            {results.map((track, i) => (
              <div key={i} className="result-item">
                <span className="result-icon">♪</span>
                <div className="result-info">
                  <span className="result-title">{track.title}</span>
                  <span className="result-artist">{track.artist}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
