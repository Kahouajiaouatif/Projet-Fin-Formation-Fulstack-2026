import { useEffect, useState } from 'react'

export default function SongHistoryModal({ onClose }) {
  const [tracks, setTracks] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // TODO: remplacer par fetch('/api/history')
  }, [])

  // Formate l'heure HH:MM
  function formatTime(isoString) {
    const date = new Date(isoString)
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>

        {/* Header modal */}
        <div style={styles.modalHeader}>
          <div style={styles.titleBlock}>
            <span style={styles.icon}>🎵</span>
            <h2 style={styles.title}>Song History</h2>
          </div>
          <button style={styles.btnClose} onClick={onClose}>✕</button>
        </div>

        <p style={styles.subtitle}>Les 10 derniers titres diffusés</p>

        {/* Liste */}
        <div style={styles.list}>
          {loading ? (
            <div style={styles.loadingBlock}>
              <span style={styles.loadingDot} />
              <span style={styles.loadingDot} />
              <span style={styles.loadingDot} />
            </div>
          ) : tracks.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem', fontSize: '0.85rem' }}>
              Aucun titre joué pour le moment.
            </p>
          ) : (
            tracks.map((track, index) => (
              <div key={track.id} style={styles.trackRow}>

                {/* Numéro */}
                <span style={styles.trackNumber}>
                  {String(index + 1).padStart(2, '0')}
                </span>

                {/* Infos */}
                <div style={styles.trackInfo}>
                  <p style={styles.trackTitle}>{track.title}</p>
                  <p style={styles.trackArtist}>{track.artist}</p>
                </div>

                {/* Heure */}
                <span style={styles.trackTime}>{formatTime(track.played_at)}</span>

              </div>
            ))
          )}
        </div>


      </div>
    </div>
  )
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    padding: '1rem',
  },
  modal: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '16px',
    padding: '1.8rem',
    width: '100%',
    maxWidth: '480px',
    maxHeight: '85vh',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    boxShadow: '0 0 50px rgba(123, 47, 255, 0.2)',
  },

  /* Header */
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleBlock: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  icon: {
    fontSize: '1.2rem',
  },
  title: {
    fontFamily: 'var(--font-title)',
    fontSize: '1rem',
    letterSpacing: '3px',
    color: 'var(--neon-purple)',
  },
  btnClose: {
    color: 'var(--text-muted)',
    fontSize: '1.1rem',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    transition: 'color 0.2s',
  },
  subtitle: {
    fontSize: '0.78rem',
    color: 'var(--text-secondary)',
    letterSpacing: '1px',
  },

  /* Liste */
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    overflowY: 'auto',
    maxHeight: '420px',
  },
  trackRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '10px 12px',
    borderRadius: '8px',
    background: 'var(--bg-panel)',
    border: '1px solid transparent',
    transition: 'border-color 0.2s',
    cursor: 'default',
  },
  trackNumber: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    fontFamily: 'var(--font-title)',
    minWidth: '24px',
  },
  trackInfo: {
    flex: 1,
  },
  trackTitle: {
    fontSize: '0.92rem',
    color: 'var(--text-primary)',
    fontWeight: '600',
    marginBottom: '2px',
  },
  trackArtist: {
    fontSize: '0.78rem',
    color: 'var(--neon-cyan)',
    letterSpacing: '1px',
  },
  trackTime: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
  },

  /* Loading */
  loadingBlock: {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
    padding: '2rem',
  },
  loadingDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: 'var(--neon-purple)',
    animation: 'pulse 1s infinite',
  },
}
