import { useState, useRef, useEffect } from 'react'

export default function Player({ onHistoryUpdate }) {
  const audioRef               = useRef(null)
  const [isPlaying, setIsPlaying]   = useState(false)
  const [volume, setVolume]         = useState(0.8)
  const [isMuted, setIsMuted]       = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration]     = useState(0)
  const [trackInfo, setTrackInfo]   = useState({
    title: 'En attente...',
    artist: '—',
  })
  const [isLoading, setIsLoading]   = useState(false)

  // URL du stream backend (à connecter plus tard)
  const STREAM_URL = 'http://localhost:5000/stream'

  /* ── Mise à jour du volume ── */
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  /* ── Play / Pause ── */
  function togglePlay() {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      setIsLoading(true)
      audio.src = STREAM_URL
      audio.play()
        .then(() => {
          setIsPlaying(true)
          setIsLoading(false)
          // Simule une piste pour la démo (sera remplacé par la réponse API)
          const demo = { title: 'Chill Waves', artist: 'Limbik Sessions' }
          setTrackInfo(demo)
          if (onHistoryUpdate) onHistoryUpdate(demo)
        })
        .catch(() => {
          setIsLoading(false)
          setTrackInfo({ title: '', artist: '' })
        })
    }
  }

  /* ── Progression du temps ── */
  function handleTimeUpdate() {
    setCurrentTime(audioRef.current.currentTime)
  }
  function handleLoadedMetadata() {
    setDuration(audioRef.current.duration)
  }
  function handleSeek(e) {
    const newTime = parseFloat(e.target.value)
    audioRef.current.currentTime = newTime
    setCurrentTime(newTime)
  }

  /* ── Formatage du temps mm:ss ── */
  function formatTime(sec) {
    if (!sec || isNaN(sec)) return '0:00'
    const m = Math.floor(sec / 60)
    const s = Math.floor(sec % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  /* ── Barres du visualiseur ── */
  const bars = Array.from({ length: 28 })

  return (
    <div style={styles.wrapper}>

      {/* ── VISUALISEUR ── */}
      <div style={styles.visualizer}>
        {bars.map((_, i) => (
          <div
            key={i}
            style={{
              ...styles.bar,
              height: isPlaying
                ? `${Math.random() * 70 + 20}%`
                : '15%',
              opacity: isPlaying ? 0.85 : 0.3,
              transition: isPlaying
                ? `height ${0.1 + i * 0.02}s ease`
                : 'height 0.5s ease, opacity 0.5s ease',
            }}
          />
        ))}
      </div>

      {/* ── INFOS PISTE ── */}
      <div style={styles.trackInfo}>
        <p style={styles.trackArtist}>{trackInfo.artist}</p>
        <p style={styles.trackTitle}>{trackInfo.title}</p>
      </div>

      {/* ── BARRE DE PROGRESSION ── */}
      <div style={styles.progressBlock}>
        <span style={styles.timeLabel}>{formatTime(currentTime)}</span>
        <input
          type="range"
          min={0}
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          style={styles.progressBar}
        />
        <span style={styles.timeLabel}>{formatTime(duration)}</span>
      </div>

      {/* ── CONTRÔLES PRINCIPAUX ── */}
      <div style={styles.controls}>

        {/* Volume */}
        <div style={styles.volumeBlock}>
          <button style={styles.btnIcon} onClick={() => setIsMuted(!isMuted)}>
            {isMuted ? '🔇' : volume > 0.5 ? '🔊' : '🔉'}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={isMuted ? 0 : volume}
            onChange={e => setVolume(parseFloat(e.target.value))}
            style={styles.volumeBar}
          />
        </div>

        {/* Bouton Play / Pause */}
        <button
          style={{
            ...styles.btnPlay,
            opacity: isLoading ? 0.6 : 1,
          }}
          onClick={togglePlay}
          disabled={isLoading}
        >
          {isLoading ? '...' : isPlaying ? '⏸' : '▶'}
        </button>

        {/* Indicateur LIVE */}
        <div style={styles.liveBlock}>
          <span style={{ ...styles.liveDot, background: isPlaying ? '#ff2d78' : '#555', boxShadow: isPlaying ? '0 0 8px #ff2d78' : 'none' }} />
          <span style={{ ...styles.liveText, color: isPlaying ? '#ff2d78' : '#555' }}>LIVE</span>
        </div>

      </div>

      {/* Élément audio caché */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />

    </div>
  )
}

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.8rem',
    width: '100%',
    maxWidth: '600px',
    margin: '0 auto',
  },

  /* Visualiseur */
  visualizer: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '5px',
    height: '90px',
    width: '100%',
    padding: '0 1rem',
  },
  bar: {
    flex: 1,
    background: 'linear-gradient(to top, var(--neon-purple), var(--neon-cyan))',
    borderRadius: '3px 3px 0 0',
  },

  /* Infos piste */
  trackInfo: {
    textAlign: 'center',
  },
  trackArtist: {
    fontSize: '0.8rem',
    letterSpacing: '3px',
    color: 'var(--neon-cyan)',
    textTransform: 'uppercase',
    marginBottom: '6px',
  },
  trackTitle: {
    fontSize: '1.5rem',
    fontFamily: 'var(--font-title)',
    color: 'var(--text-primary)',
    letterSpacing: '2px',
  },

  /* Progression */
  progressBlock: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    width: '100%',
    padding: '0 1rem',
  },
  progressBar: {
    flex: 1,
    accentColor: 'var(--neon-purple)',
    cursor: 'pointer',
    height: '4px',
  },
  timeLabel: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    minWidth: '36px',
    textAlign: 'center',
  },

  /* Contrôles */
  controls: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: '0 1rem',
  },

  /* Volume */
  volumeBlock: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  btnIcon: {
    fontSize: '1.2rem',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    lineHeight: 1,
  },
  volumeBar: {
    width: '80px',
    accentColor: 'var(--neon-purple)',
    cursor: 'pointer',
  },

  /* Play */
  btnPlay: {
    width: '70px',
    height: '70px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--neon-purple), var(--neon-pink))',
    color: '#fff',
    fontSize: '1.8rem',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 0 28px rgba(123, 47, 255, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.15s ease, opacity 0.2s',
  },

  /* Live */
  liveBlock: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  liveDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    transition: 'all 0.4s ease',
  },
  liveText: {
    fontSize: '0.75rem',
    fontWeight: '700',
    letterSpacing: '2px',
    transition: 'color 0.4s ease',
  },
}
