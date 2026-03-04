import pool from "../config/db.js";
import { getRandomTrack, recordHistory, streamTrack } from "../services/stream.service.js";

export const stream = async (req, res) => {
  try {
    const track = await getRandomTrack();
    if (!track) {
      return res.status(404).json({ error: "Aucune piste disponible" });
    }

    const userId = req.user?.id || null;
    await recordHistory(track.id, userId);

    streamTrack(track, req, res);
  } catch (err) {
    console.error("Erreur streaming:", err);
    res.status(500).json({ error: "Erreur lors du streaming" });
  }
};

export const getNowPlaying = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT tracks.title, tracks.artist, tracks.id
      FROM history
      JOIN tracks ON history.track_id = tracks.id
      ORDER BY history.played_at DESC
      LIMIT 1
    `);
    res.json(result.rows[0] || null);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const getHistory = async (req, res) => {
  try {
    const userId = req.user?.id;
    let result;

    if (userId) {
      result = await pool.query(`
        SELECT tracks.title, tracks.artist, history.played_at
        FROM history
        JOIN tracks ON history.track_id = tracks.id
        WHERE history.user_id = $1
        ORDER BY history.played_at DESC
        LIMIT 10
      `, [userId]);
    } else {
      result = await pool.query(`
        SELECT tracks.title, tracks.artist, history.played_at
        FROM history
        JOIN tracks ON history.track_id = tracks.id
        ORDER BY history.played_at DESC
        LIMIT 10
      `);
    }

    res.json(result.rows);
  } catch (err) {
    console.error("Erreur historique:", err);
    res.status(500).json({ error: "Erreur lors de la récupération de l'historique" });
  }
};

export const searchTracks = async (req, res) => {
  const { q } = req.query;

  if (!q || q.trim().length < 2) {
    return res.status(400).json({ error: "Requête de recherche trop courte" });
  }

  try {
    const result = await pool.query(`
      SELECT id, title, artist
      FROM tracks
      WHERE LOWER(title) LIKE LOWER($1) OR LOWER(artist) LIKE LOWER($1)
      ORDER BY artist, title
      LIMIT 20
    `, [`%${q.trim()}%`]);

    res.json(result.rows);
  } catch (err) {
    console.error("Erreur recherche:", err);
    res.status(500).json({ error: "Erreur lors de la recherche" });
  }
};
