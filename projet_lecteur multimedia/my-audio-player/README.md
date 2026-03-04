# 🎵 Limbik Radio

Radio en ligne diffusant des fichiers MP3 de manière aléatoire, avec authentification utilisateur, historique des pistes et téléchargement de playlist.

## Technologies

| Couche       | Technologie                    |
|--------------|-------------------------------|
| Frontend     | React 19 + Vite                |
| Backend      | Node.js + Express 5            |
| Auth & Cache | Redis 7                        |
| Base données | PostgreSQL 15                  |
| Déploiement  | Docker + Docker Compose        |
| Style        | CSS pur (Flexbox) — pas de Tailwind/Bootstrap |

## Fonctionnalités

- **Inscription / Connexion / Déconnexion** sécurisée (JWT + bcrypt + Redis)
- **Lecteur audio** avec diffusion aléatoire en temps réel
- **Streaming** partiel (range requests) pour une lecture fluide
- **Song History** : modal avec les 10 dernières pistes écoutées
- **Song Request** : barre de recherche par artiste ou titre
- **Playlist** : téléchargement au format `.pls` (compatible VLC)

## Démarrage rapide

### Prérequis
- Docker et Docker Compose installés

### Lancement

```bash
cd my-audio-player
docker-compose up --build
```

Puis ouvrir dans le navigateur : **http://localhost:5173**

### Ajouter des fichiers MP3

Copier vos fichiers `.mp3` dans le dossier `media/mp3/` puis les enregistrer en base :

```sql
INSERT INTO tracks (title, artist, file_path)
VALUES ('Mon titre', 'Mon artiste', '/app/media/mp3/mon-fichier.mp3');
```

## Structure du projet

```
my-audio-player/
├── client/          → Frontend React + Vite
│   └── src/
│       ├── components/
│       │   ├── AuthForm.jsx
│       │   ├── Player.jsx
│       │   ├── SongHistoryModal.jsx
│       │   ├── SongRequestModal.jsx
│       │   └── PlaylistModal.jsx
│       ├── services/api.js
│       └── styles/
│           ├── main.css
│           └── player.css
├── server/          → Backend Node.js + Express
│   ├── config/      → PostgreSQL + Redis
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   └── services/
├── database/        → Script SQL init
├── media/mp3/       → Fichiers audio
└── docker-compose.yml
```

## Ports

| Service    | Port |
|------------|------|
| Frontend   | 5173 |
| Backend    | 5000 |
| PostgreSQL | 5432 |
| Redis      | 6379 |

## Playlist .pls

Les fichiers `.pls` téléchargés nécessitent **VLC** pour être lus.
Télécharger VLC : https://www.videolan.org/vlc/
