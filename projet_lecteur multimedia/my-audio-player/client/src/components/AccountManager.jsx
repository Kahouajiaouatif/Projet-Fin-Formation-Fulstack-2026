import { useState } from 'react'

const TABS = ['Profil', 'Mot de passe', 'Danger']

export default function AccountManager({ user, onClose, onUpdateUser }) {
  const [activeTab, setActiveTab]     = useState('Profil')
  const [username, setUsername]       = useState(user.username || '')
  const [email, setEmail]             = useState(user.email || '')
  const [currentPwd, setCurrentPwd]   = useState('')
  const [newPwd, setNewPwd]           = useState('')
  const [confirmPwd, setConfirmPwd]   = useState('')
  const [errors, setErrors]           = useState({})
  const [successMsg, setSuccessMsg]   = useState('')
  const [loading, setLoading]         = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  function clearFeedback() {
    setErrors({})
    setSuccessMsg('')
  }

  /* ── Validation profil ── */
  function validateProfil() {
    const e = {}
    if (!username.trim()) e.username = "Le nom d'utilisateur est obligatoire."
    else if (username.trim().length < 3) e.username = 'Minimum 3 caractères.'
    else if (!/^[a-zA-Z0-9_]+$/.test(username)) e.username = 'Lettres, chiffres et _ uniquement.'
    if (!email.trim()) e.email = "L'email est obligatoire."
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Format email invalide.'
    return e
  }

  /* ── Validation mot de passe ── */
  function validatePassword() {
    const e = {}
    if (!currentPwd) e.currentPwd = 'Mot de passe actuel requis.'
    if (!newPwd) e.newPwd = 'Nouveau mot de passe requis.'
    else if (newPwd.length < 6) e.newPwd = 'Minimum 6 caractères.'
    if (newPwd !== confirmPwd) e.confirmPwd = 'Les mots de passe ne correspondent pas.'
    return e
  }

  /* ── Sauvegarde profil ── */
  async function handleSaveProfil(e) {
    e.preventDefault()
    clearFeedback()
    const errs = validateProfil()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    try {
      // TODO: remplacer par un vrai appel API
      // await fetch('/api/users/me', { method: 'PATCH', body: JSON.stringify({ username, email }) })
      await new Promise(r => setTimeout(r, 600)) // simulation
      onUpdateUser({ ...user, username, email })
      setSuccessMsg('Profil mis à jour avec succès.')
    } catch {
      setErrors({ global: 'Erreur serveur. Réessayez.' })
    } finally {
      setLoading(false)
    }
  }

  /* ── Changement de mot de passe ── */
  async function handleChangePassword(e) {
    e.preventDefault()
    clearFeedback()
    const errs = validatePassword()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    try {
      // TODO: remplacer par un vrai appel API
      // await fetch('/api/users/me/password', { method: 'PATCH', body: JSON.stringify({ currentPwd, newPwd }) })
      await new Promise(r => setTimeout(r, 600)) // simulation
      setCurrentPwd('')
      setNewPwd('')
      setConfirmPwd('')
      setSuccessMsg('Mot de passe modifié avec succès.')
    } catch {
      setErrors({ global: 'Erreur serveur. Réessayez.' })
    } finally {
      setLoading(false)
    }
  }

  /* ── Suppression de compte ── */
  async function handleDeleteAccount() {
    setLoading(true)
    try {
      // TODO: remplacer par un vrai appel API
      // await fetch('/api/users/me', { method: 'DELETE' })
      await new Promise(r => setTimeout(r, 800)) // simulation
      onUpdateUser(null) // déconnecte l'utilisateur
      onClose()
    } catch {
      setErrors({ global: 'Erreur lors de la suppression.' })
      setLoading(false)
    }
  }

  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.modal} onClick={e => e.stopPropagation()}>

        {/* En-tête */}
        <div style={s.header}>
          <h2 style={s.title}>MON COMPTE</h2>
          <button style={s.btnClose} onClick={onClose}>✕</button>
        </div>

        {/* Avatar + nom */}
        <div style={s.avatarBlock}>
          <div style={s.avatar}>
            {(user.username || 'U')[0].toUpperCase()}
          </div>
          <div>
            <p style={s.avatarName}>{user.username}</p>
            <p style={s.avatarEmail}>{user.email}</p>
          </div>
        </div>

        {/* Onglets */}
        <div style={s.tabs}>
          {TABS.map(tab => (
            <button
              key={tab}
              style={{ ...s.tab, ...(activeTab === tab ? s.tabActive : {}) }}
              onClick={() => { setActiveTab(tab); clearFeedback() }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Contenu onglet */}
        <div style={s.body}>

          {/* ── ONGLET PROFIL ── */}
          {activeTab === 'Profil' && (
            <form onSubmit={handleSaveProfil} style={s.form} noValidate>

              <Field label="Nom d'utilisateur" error={errors.username}>
                <input
                  style={{ ...s.input, borderColor: errors.username ? 'var(--neon-pink)' : 'var(--border)' }}
                  value={username}
                  onChange={e => { setUsername(e.target.value); setErrors(p => ({ ...p, username: '' })) }}
                  placeholder="DJ Limbik"
                />
              </Field>

              <Field label="Email" error={errors.email}>
                <input
                  style={{ ...s.input, borderColor: errors.email ? 'var(--neon-pink)' : 'var(--border)' }}
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })) }}
                  placeholder="ton@email.com"
                />
              </Field>

              {errors.global && <p style={s.errorGlobal}>{errors.global}</p>}
              {successMsg   && <p style={s.success}>{successMsg}</p>}

              <button type="submit" style={s.btnSave} disabled={loading}>
                {loading ? 'Sauvegarde...' : 'Sauvegarder'}
              </button>
            </form>
          )}

          {/* ── ONGLET MOT DE PASSE ── */}
          {activeTab === 'Mot de passe' && (
            <form onSubmit={handleChangePassword} style={s.form} noValidate>

              <Field label="Mot de passe actuel" error={errors.currentPwd}>
                <input
                  style={{ ...s.input, borderColor: errors.currentPwd ? 'var(--neon-pink)' : 'var(--border)' }}
                  type="password"
                  value={currentPwd}
                  onChange={e => { setCurrentPwd(e.target.value); setErrors(p => ({ ...p, currentPwd: '' })) }}
                  placeholder="••••••••"
                />
              </Field>

              <Field label="Nouveau mot de passe" error={errors.newPwd}>
                <input
                  style={{ ...s.input, borderColor: errors.newPwd ? 'var(--neon-pink)' : 'var(--border)' }}
                  type="password"
                  value={newPwd}
                  onChange={e => { setNewPwd(e.target.value); setErrors(p => ({ ...p, newPwd: '' })) }}
                  placeholder="••••••••"
                />
              </Field>

              <Field label="Confirmer le mot de passe" error={errors.confirmPwd}>
                <input
                  style={{ ...s.input, borderColor: errors.confirmPwd ? 'var(--neon-pink)' : 'var(--border)' }}
                  type="password"
                  value={confirmPwd}
                  onChange={e => { setConfirmPwd(e.target.value); setErrors(p => ({ ...p, confirmPwd: '' })) }}
                  placeholder="••••••••"
                />
              </Field>

              {errors.global && <p style={s.errorGlobal}>{errors.global}</p>}
              {successMsg   && <p style={s.success}>{successMsg}</p>}

              <button type="submit" style={s.btnSave} disabled={loading}>
                {loading ? 'Modification...' : 'Modifier le mot de passe'}
              </button>
            </form>
          )}

          {/* ── ONGLET DANGER ── */}
          {activeTab === 'Danger' && (
            <div style={s.dangerZone}>
              <p style={s.dangerText}>
                La suppression de votre compte est <strong>irréversible</strong>.
                Toutes vos données seront définitivement effacées.
              </p>

              {!showDeleteConfirm ? (
                <button style={s.btnDanger} onClick={() => setShowDeleteConfirm(true)}>
                  Supprimer mon compte
                </button>
              ) : (
                <div style={s.confirmBlock}>
                  <p style={s.confirmText}>Êtes-vous sûr ? Cette action est définitive.</p>
                  <div style={s.confirmBtns}>
                    <button
                      style={s.btnDanger}
                      onClick={handleDeleteAccount}
                      disabled={loading}
                    >
                      {loading ? 'Suppression...' : 'Oui, supprimer'}
                    </button>
                    <button
                      style={s.btnCancel}
                      onClick={() => setShowDeleteConfirm(false)}
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              )}

              {errors.global && <p style={s.errorGlobal}>{errors.global}</p>}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

/* ── Sous-composant champ ── */
function Field({ label, error, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={s.label}>{label}</label>
      {children}
      {error && <span style={s.fieldError}>{error}</span>}
    </div>
  )
}

/* ── Styles ── */
const s = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 200,
  },
  modal: {
    position: 'relative',
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '460px',
    boxShadow: '0 0 50px rgba(123, 47, 255, 0.25)',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1.4rem 1.8rem',
    borderBottom: '1px solid var(--border)',
    background: 'var(--bg-panel)',
  },
  title: {
    fontFamily: 'var(--font-title)',
    fontSize: '0.9rem',
    letterSpacing: '3px',
    color: 'var(--neon-purple)',
  },
  btnClose: {
    color: 'var(--text-muted)',
    fontSize: '1.1rem',
    cursor: 'pointer',
  },
  avatarBlock: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1.4rem 1.8rem',
    borderBottom: '1px solid var(--border)',
  },
  avatar: {
    width: '52px',
    height: '52px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, var(--neon-purple), var(--neon-pink))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'var(--font-title)',
    fontSize: '1.3rem',
    color: '#fff',
    flexShrink: 0,
    boxShadow: '0 0 16px rgba(123, 47, 255, 0.5)',
  },
  avatarName: {
    fontFamily: 'var(--font-title)',
    fontSize: '0.85rem',
    letterSpacing: '2px',
    color: 'var(--text-primary)',
  },
  avatarEmail: {
    fontSize: '0.78rem',
    color: 'var(--text-secondary)',
    marginTop: '2px',
  },
  tabs: {
    display: 'flex',
    borderBottom: '1px solid var(--border)',
  },
  tab: {
    flex: 1,
    padding: '0.85rem',
    fontSize: '0.78rem',
    letterSpacing: '1px',
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    borderBottom: '2px solid transparent',
    transition: 'var(--transition)',
  },
  tabActive: {
    color: 'var(--neon-cyan)',
    borderBottomColor: 'var(--neon-cyan)',
  },
  body: {
    padding: '1.8rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem',
  },
  label: {
    fontSize: '0.78rem',
    letterSpacing: '1px',
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
  },
  input: {
    background: 'var(--bg-panel)',
    border: '1px solid',
    borderRadius: '8px',
    padding: '11px 14px',
    color: 'var(--text-primary)',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  fieldError: {
    color: 'var(--neon-pink)',
    fontSize: '0.76rem',
  },
  errorGlobal: {
    color: 'var(--neon-pink)',
    fontSize: '0.82rem',
    textAlign: 'center',
  },
  success: {
    color: 'var(--neon-cyan)',
    fontSize: '0.82rem',
    textAlign: 'center',
  },
  btnSave: {
    marginTop: '0.4rem',
    background: 'linear-gradient(135deg, var(--neon-purple), var(--neon-pink))',
    color: '#fff',
    fontFamily: 'var(--font-title)',
    fontSize: '0.85rem',
    letterSpacing: '2px',
    padding: '13px',
    borderRadius: '8px',
    cursor: 'pointer',
    border: 'none',
    boxShadow: '0 0 18px rgba(123, 47, 255, 0.4)',
    transition: 'opacity 0.2s',
  },
  dangerZone: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem',
  },
  dangerText: {
    fontSize: '0.88rem',
    color: 'var(--text-secondary)',
    lineHeight: 1.6,
  },
  confirmBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
  },
  confirmText: {
    fontSize: '0.84rem',
    color: 'var(--neon-pink)',
  },
  confirmBtns: {
    display: 'flex',
    gap: '0.8rem',
  },
  btnDanger: {
    background: 'rgba(255, 45, 120, 0.15)',
    color: 'var(--neon-pink)',
    border: '1px solid var(--neon-pink)',
    padding: '11px 20px',
    borderRadius: '8px',
    fontSize: '0.83rem',
    letterSpacing: '1px',
    cursor: 'pointer',
    transition: 'var(--transition)',
  },
  btnCancel: {
    background: 'var(--bg-panel)',
    color: 'var(--text-secondary)',
    border: '1px solid var(--border)',
    padding: '11px 20px',
    borderRadius: '8px',
    fontSize: '0.83rem',
    cursor: 'pointer',
  },
}
