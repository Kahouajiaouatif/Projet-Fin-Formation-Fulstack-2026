import { useState } from 'react'
import './App.css'
import './index.css'
import LoginPage from './pages/LoginPage'
import Player from './components/Player'
import SongHistoryModal from './components/SongHistoryModal'
import AccountManager from './components/AccountManager'

export default function App() {
  const [user, setUser]                 = useState(null)
  const [showHistory, setShowHistory]   = useState(false)
  const [showRequest, setShowRequest]   = useState(false)
  const [showPlaylist, setShowPlaylist] = useState(false)
  const [showAccount, setShowAccount]   = useState(false)

  // Si pas connecté → page Login
  if (!user) {
    return <LoginPage onLogin={(userData) => setUser(userData)} />
  }

  return (
    <div style={styles.app}>

      {/* ── HEADER ── */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <span style={styles.dot} />
          <span style={styles.liveLabel}>LIVE</span>
        </div>

        <h1 style={styles.title}>MYAUDIOPLAYER</h1>

        <div style={styles.headerRight}>
          <span style={styles.subtitle}>Bonjour, {user.username}</span>
          <button
            style={{ ...styles.subtitle, cursor: 'pointer', marginLeft: '1rem', color: 'var(--neon-cyan)' }}
            onClick={() => setShowAccount(true)}
          >
            Mon compte
          </button>
          <button
            style={{ ...styles.subtitle, cursor: 'pointer', marginLeft: '1rem', color: 'var(--neon-pink)' }}
            onClick={() => setUser(null)}
          >
            Déconnexion
          </button>
        </div>
      </header>

      {/* ── ZONE PRINCIPALE ── */}
      <main style={styles.main}>

        {/* Lecteur audio */}
        <Player onHistoryUpdate={(track) => console.log('Nouveau titre :', track)} />

        {/* Boutons modals */}
        <div style={styles.controls}>
          <button style={styles.btnSecondary} onClick={() => setShowHistory(true)}>
            Song History
          </button>
          <button style={styles.btnSecondary} onClick={() => setShowRequest(true)}>
            Song Request
          </button>
          <button style={styles.btnPlaylist} onClick={() => setShowPlaylist(true)}>
            Playlist .pls
          </button>
        </div>

      </main>

      {/* ── FOOTER ── */}
      <footer style={styles.footer}>
        <span>MyAudioPlayer © 2026</span>
        <span style={{ color: 'var(--text-muted)' }}>•</span>
        <span>Electronic / Ambient / Techno</span>
      </footer>

      {/* ── MODALS (placeholders) ── */}
      {showHistory && (
        <SongHistoryModal onClose={() => setShowHistory(false)} />
      )}

      {showAccount && (
        <AccountManager
          user={user}
          onClose={() => setShowAccount(false)}
          onUpdateUser={(updated) => {
            if (updated === null) { setUser(null) }
            else { setUser(updated); setShowAccount(false) }
          }}
        />
      )}

      {showRequest && (
        <div style={styles.modalOverlay} onClick={() => setShowRequest(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>Song Request</h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              (composant à venir...)
            </p>
            <button style={styles.btnClose} onClick={() => setShowRequest(false)}>✕</button>
          </div>
        </div>
      )}

      {showPlaylist && (
        <div style={styles.modalOverlay} onClick={() => setShowPlaylist(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>Playlist</h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              (composant à venir...)
            </p>
            <button style={styles.btnClose} onClick={() => setShowPlaylist(false)}>✕</button>
          </div>
        </div>
      )}

    </div>
  )
}

/* ── STYLES INLINE (temporaires, seront migrés en CSS) ── */
const styles = {
  app: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: 'var(--bg-dark)',
    color: 'var(--text-primary)',
  },

  /* Header */
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1.2rem 2rem',
    borderBottom: '1px solid var(--border)',
    background: 'var(--bg-panel)',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  dot: {
    display: 'inline-block',
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: '#ff2d78',
    boxShadow: '0 0 8px #ff2d78',
  },
  liveLabel: {
    fontSize: '0.75rem',
    fontWeight: '700',
    letterSpacing: '2px',
    color: '#ff2d78',
  },
  title: {
    fontFamily: 'var(--font-title)',
    fontSize: '1.6rem',
    letterSpacing: '4px',
    color: 'var(--text-primary)',
    textShadow: '0 0 20px rgba(123, 47, 255, 0.6)',
  },
  headerRight: {},
  subtitle: {
    fontSize: '0.75rem',
    letterSpacing: '2px',
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
  },

  /* Main */
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2rem',
    padding: '3rem 2rem',
  },

  /* Visualiseur */
  visualizer: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '4px',
    height: '100px',
    padding: '0 1rem',
  },
  bar: {
    width: '6px',
    background: 'linear-gradient(to top, var(--neon-purple), var(--neon-cyan))',
    borderRadius: '3px 3px 0 0',
    opacity: 0.7,
  },

  /* Track info */
  trackInfo: {
    textAlign: 'center',
  },
  trackArtist: {
    fontSize: '0.85rem',
    color: 'var(--neon-cyan)',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    marginBottom: '6px',
  },
  trackTitle: {
    fontSize: '1.4rem',
    fontFamily: 'var(--font-title)',
    color: 'var(--text-primary)',
  },

  /* Contrôles */
  controls: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
  },
  btnPlay: {
    background: 'linear-gradient(135deg, var(--neon-purple), var(--neon-pink))',
    color: '#fff',
    fontFamily: 'var(--font-title)',
    fontSize: '1rem',
    letterSpacing: '3px',
    padding: '14px 40px',
    borderRadius: '50px',
    boxShadow: '0 0 24px rgba(123, 47, 255, 0.5)',
    transition: 'var(--transition)',
  },
  btnSecondary: {
    background: 'var(--bg-card)',
    color: 'var(--text-secondary)',
    border: '1px solid var(--border)',
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '0.85rem',
    letterSpacing: '1px',
    transition: 'var(--transition)',
  },
  btnPlaylist: {
    background: 'transparent',
    color: 'var(--neon-cyan)',
    border: '1px solid var(--neon-cyan)',
    padding: '8px 20px',
    borderRadius: '6px',
    fontSize: '0.8rem',
    letterSpacing: '1px',
    transition: 'var(--transition)',
  },

  /* Footer */
  footer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    padding: '1rem',
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    borderTop: '1px solid var(--border)',
    background: 'var(--bg-panel)',
  },

  /* Modals */
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.75)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  modal: {
    position: 'relative',
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    padding: '2rem',
    minWidth: '360px',
    boxShadow: '0 0 40px rgba(123, 47, 255, 0.2)',
  },
  modalTitle: {
    fontFamily: 'var(--font-title)',
    fontSize: '1rem',
    letterSpacing: '3px',
    marginBottom: '1rem',
    color: 'var(--neon-purple)',
  },
  btnClose: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    color: 'var(--text-muted)',
    fontSize: '1rem',
  },
}
