import fs from "fs";
import path from "path";
import pool from "../config/db.js";

export const getRandomTrack = async () => {
  const result = await pool.query("SELECT * FROM tracks ORDER BY RANDOM() LIMIT 1");
  return result.rows[0] || null;
};

export const recordHistory = async (trackId, userId = null) => {
  await pool.query(
    "INSERT INTO history (track_id, user_id) VALUES ($1, $2)",
    [trackId, userId]
  );
};

export const streamTrack = (track, req, res) => {
  const filePath = path.resolve(track.file_path);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Fichier audio introuvable" });
  }

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunkSize = end - start + 1;

    res.writeHead(206, {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize,
      "Content-Type": "audio/mpeg",
    });

    fs.createReadStream(filePath, { start, end }).pipe(res);
  } else {
    res.writeHead(200, {
      "Content-Length": fileSize,
      "Content-Type": "audio/mpeg",
      "Accept-Ranges": "bytes",
    });
    fs.createReadStream(filePath).pipe(res);
  }
};
