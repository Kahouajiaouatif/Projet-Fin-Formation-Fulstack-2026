import pool from "../config/db.js";

export const generatePls = async (userId) => {
  // Récupérer les 20 dernières pistes jouées
  let result;
  if (userId) {
    result = await pool.query(`
      SELECT tracks.title, tracks.artist, history.played_at
      FROM history
      JOIN tracks ON history.track_id = tracks.id
      WHERE history.user_id = $1
      ORDER BY history.played_at DESC
      LIMIT 20
    `, [userId]);
  } else {
    result = await pool.query(`
      SELECT tracks.title, tracks.artist, history.played_at
      FROM history
      JOIN tracks ON history.track_id = tracks.id
      ORDER BY history.played_at DESC
      LIMIT 20
    `);
  }

  const tracks = result.rows;
  if (!tracks.length) return null;

  let plsContent = "[playlist]\n\n";
  tracks.forEach((track, i) => {
    const num = i + 1;
    plsContent += `File${num}=http://localhost:5000/api/radio/stream\n`;
    plsContent += `Title${num}=${track.artist} - ${track.title}\n`;
    plsContent += `Length${num}=-1\n\n`;
  });
  plsContent += `NumberOfEntries=${tracks.length}\n`;
  plsContent += `Version=2\n`;

  return plsContent;
};
