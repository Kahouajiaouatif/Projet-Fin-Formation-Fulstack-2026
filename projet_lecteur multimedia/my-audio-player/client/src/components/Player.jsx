import { useState, useRef, useEffect } from "react";
import { getStreamUrl } from "../services/api.js";

export default function Player({ onHistoryUpdate }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [nowPlaying, setNowPlaying] = useState(null);
  const [visualizerBars] = useState(() => Array.from({ length: 20 }, () => Math.random()));

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      setLoading(true);
      audioRef.current.src = getStreamUrl() + `?t=${Date.now()}`;
      audioRef.current.play()
        .then(() => {
          setPlaying(true);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  };

  const handleSkip = () => {
    if (!playing) return;
    setLoading(true);
    audioRef.current.src = getStreamUrl() + `?t=${Date.now()}`;
    audioRef.current.play()
      .then(() => {
        setLoading(false);
        onHistoryUpdate?.();
      })
      .catch(() => setLoading(false));
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) audioRef.current.volume = val;
    setMuted(val === 0);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    const newMuted = !muted;
    setMuted(newMuted);
    audioRef.current.muted = newMuted;
  };

  const handleEnded = () => {
    // Lancer automatiquement la prochaine piste
    if (playing) handleSkip();
  };

  return (
    <div className="player">
      <audio
        ref={audioRef}
        onEnded={handleEnded}
        onLoadStart={() => setLoading(true)}
        onCanPlay={() => setLoading(false)}
      />

      {/* Visualiseur */}
      <div className={`visualizer ${playing ? "active" : ""}`}>
        {visualizerBars.map((h, i) => (
          <div
            key={i}
            className="bar"
            style={{ "--bar-height": `${20 + h * 60}%`, "--bar-delay": `${i * 0.05}s` }}
          />
        ))}
      </div>

      {/* Info piste en cours */}
      <div className="now-playing">
        <span className="now-playing-label">EN COURS</span>
        <div className="now-playing-info">
          {playing ? (
            loading ? (
              <span className="track-loading">Chargement...</span>
            ) : (
              <span className="track-name">Diffusion aléatoire</span>
            )
          ) : (
            <span className="track-idle">Appuyer sur Play pour commencer</span>
          )}
        </div>
        <div className="live-badge">
          <span className={`live-dot ${playing ? "pulsing" : ""}`}></span>
          LIVE
        </div>
      </div>

      {/* Contrôles */}
      <div className="player-controls">
        <button
          className="ctrl-btn ctrl-skip"
          onClick={handleSkip}
          disabled={!playing || loading}
          title="Piste suivante"
        >
          ⏭
        </button>

        <button
          className={`ctrl-btn ctrl-play ${playing ? "playing" : ""} ${loading ? "loading" : ""}`}
          onClick={togglePlay}
          title={playing ? "Pause" : "Play"}
        >
          {loading ? "⟳" : playing ? "⏸" : "▶"}
        </button>

        <button
          className="ctrl-btn ctrl-mute"
          onClick={toggleMute}
          title={muted ? "Activer le son" : "Couper le son"}
        >
          {muted || volume === 0 ? "🔇" : volume < 0.5 ? "🔉" : "🔊"}
        </button>
      </div>

      {/* Volume */}
      <div className="volume-control">
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={muted ? 0 : volume}
          onChange={handleVolumeChange}
          className="volume-slider"
          title="Volume"
        />
      </div>
    </div>
  );
}
