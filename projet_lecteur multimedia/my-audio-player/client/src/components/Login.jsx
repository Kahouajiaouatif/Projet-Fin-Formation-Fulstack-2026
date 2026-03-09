import { useState } from 'react'

export default function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail]           = useState('')
  const [password, setPassword]     = useState('')
  const [username, setUsername]     = useState('')

  // Erreurs par champ
  const [errors, setErrors] = useState({})

  /* ── Règles de validation ── */
  function validate() {
    const newErrors = {}

    // Nom d'utilisateur (inscription uniquement)
    if (isRegister) {
      if (!username.trim()) {
        newErrors.username = "Le nom d'utilisateur est obligatoire."
      } else if (username.trim().length < 3) {
        newErrors.username = "Minimum 3 caractères."
      } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        newErrors.username = "Uniquement lettres, chiffres et _ autorisés."
      }
    }

    // Email
    if (!email.trim()) {
      newErrors.email = "L'email est obligatoire."
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Format email invalide (ex: ton@email.com)."
    }

    // Mot de passe
    if (!password) {
      newErrors.password = "Le mot de passe est obligatoire."
    } else if (password.length < 6) {
      newErrors.password = "Minimum 6 caractères."
    }

    return newErrors
  }

  function handleSubmit(e) {
    e.preventDefault()

    const foundErrors = validate()
    if (Object.keys(foundErrors).length > 0) {
      setErrors(foundErrors)
      return
    }

    setErrors({})
    // Connexion simulée — sera remplacée par un appel API
    onLogin({ email, username: username || email.split('@')[0] })
  }

  function switchMode() {
    setIsRegister(!isRegister)
    setErrors({})
    setEmail('')
    setPassword('')
    setUsername('')
  }

  return (
    <div style={styles.page}>

      {/* Logo */}
      <div style={styles.logoBlock}>
        <h1 style={styles.logo}>MYAUDIOPLAYER</h1>
        <p style={styles.tagline}>Electronic · Ambient · Techno</p>
      </div>

      {/* Carte */}
      <div style={styles.card}>
        <h2 style={styles.formTitle}>
          {isRegister ? 'Créer un compte' : 'Connexion'}
        </h2>

        <form onSubmit={handleSubmit} style={styles.form} noValidate>

          {/* Nom d'utilisateur */}
          {isRegister && (
            <div style={styles.field}>
              <label style={styles.label}>Nom d'utilisateur</label>
              <input
                style={{
                  ...styles.input,
                  borderColor: errors.username ? 'var(--neon-pink)' : 'var(--border)',
                }}
                type="text"
                placeholder="DJ Limbik"
                value={username}
                onChange={e => {
                  setUsername(e.target.value)
                  setErrors(prev => ({ ...prev, username: '' }))
                }}
              />
              {errors.username && <span style={styles.fieldError}>{errors.username}</span>}
            </div>
          )}

          {/* Email */}
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              style={{
                ...styles.input,
                borderColor: errors.email ? 'var(--neon-pink)' : 'var(--border)',
              }}
              type="email"
              placeholder="ton@email.com"
              value={email}
              onChange={e => {
                setEmail(e.target.value)
                setErrors(prev => ({ ...prev, email: '' }))
              }}
            />
            {errors.email && <span style={styles.fieldError}>{errors.email}</span>}
          </div>

          {/* Mot de passe */}
          <div style={styles.field}>
            <label style={styles.label}>Mot de passe</label>
            <input
              style={{
                ...styles.input,
                borderColor: errors.password ? 'var(--neon-pink)' : 'var(--border)',
              }}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => {
                setPassword(e.target.value)
                setErrors(prev => ({ ...prev, password: '' }))
              }}
            />
            {errors.password && <span style={styles.fieldError}>{errors.password}</span>}
          </div>

          <button type="submit" style={styles.btnSubmit}>
            {isRegister ? "S'inscrire" : 'Se connecter'}
          </button>

        </form>

        <p style={styles.switchText}>
          {isRegister ? 'Déjà un compte ?' : 'Pas encore de compte ?'}{' '}
          <span style={styles.switchLink} onClick={switchMode}>
            {isRegister ? 'Se connecter' : "S'inscrire"}
          </span>
        </p>
      </div>

    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2rem',
    background: 'var(--bg-dark)',
    padding: '2rem',
  },
  logoBlock: { textAlign: 'center' },
  logo: {
    fontFamily: 'var(--font-title)',
    fontSize: '2.2rem',
    letterSpacing: '6px',
    color: 'var(--text-primary)',
    textShadow: '0 0 30px rgba(123, 47, 255, 0.7)',
  },
  tagline: {
    marginTop: '8px',
    fontSize: '0.75rem',
    letterSpacing: '3px',
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
  },
  card: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '16px',
    padding: '2.5rem',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 0 40px rgba(123, 47, 255, 0.15)',
  },
  formTitle: {
    fontFamily: 'var(--font-title)',
    fontSize: '1rem',
    letterSpacing: '3px',
    color: 'var(--neon-purple)',
    marginBottom: '1.8rem',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '0.8rem',
    letterSpacing: '1px',
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
  },
  input: {
    background: 'var(--bg-panel)',
    border: '1px solid',
    borderRadius: '8px',
    padding: '12px 16px',
    color: 'var(--text-primary)',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  fieldError: {
    color: 'var(--neon-pink)',
    fontSize: '0.78rem',
    marginTop: '2px',
  },
  btnSubmit: {
    marginTop: '0.5rem',
    background: 'linear-gradient(135deg, var(--neon-purple), var(--neon-pink))',
    color: '#fff',
    fontFamily: 'var(--font-title)',
    fontSize: '0.9rem',
    letterSpacing: '2px',
    padding: '14px',
    borderRadius: '8px',
    boxShadow: '0 0 20px rgba(123, 47, 255, 0.4)',
    cursor: 'pointer',
    border: 'none',
  },
  switchText: {
    marginTop: '1.5rem',
    textAlign: 'center',
    fontSize: '0.82rem',
    color: 'var(--text-secondary)',
  },
  switchLink: {
    color: 'var(--neon-cyan)',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
}
