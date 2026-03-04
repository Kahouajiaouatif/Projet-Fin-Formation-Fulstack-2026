-- ==========================================
-- Limbik Radio — Initialisation base de données
-- ==========================================

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tracks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    artist VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    duration INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS history (
    id SERIAL PRIMARY KEY,
    track_id INT REFERENCES tracks(id) ON DELETE CASCADE,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_history_user ON history(user_id);
CREATE INDEX IF NOT EXISTS idx_history_played_at ON history(played_at DESC);
CREATE INDEX IF NOT EXISTS idx_tracks_title ON tracks(LOWER(title));
CREATE INDEX IF NOT EXISTS idx_tracks_artist ON tracks(LOWER(artist));

-- Données de démonstration (pistes exemples)
INSERT INTO tracks (title, artist, file_path) VALUES
    ('Nuit Profonde', 'Limbik Project', '/app/media/mp3/nuit-profonde.mp3'),
    ('Fréquence Alpha', 'Ondes Cerebrales', '/app/media/mp3/frequence-alpha.mp3'),
    ('Ambient Voyage', 'Synthwave Dreams', '/app/media/mp3/ambient-voyage.mp3'),
    ('Techno Underground', 'Dark Pulse', '/app/media/mp3/techno-underground.mp3'),
    ('Chill Session', 'Lo-Fi Collective', '/app/media/mp3/chill-session.mp3')
ON CONFLICT DO NOTHING;
