import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(cors());

const MEDIA_DIR = path.join(__dirname, "..", "media", "mp3");

// Retourne un MP3 aléatoire depuis media/mp3
app.get("/stream", (req, res) => {
  const files = fs.readdirSync(MEDIA_DIR).filter(f => f.endsWith(".mp3"));

  if (!files.length) {
    return res.status(404).send("Aucun fichier MP3 trouvé dans media/mp3");
  }

  const file = files[Math.floor(Math.random() * files.length)];
  const filePath = path.join(MEDIA_DIR, file);
  const stat = fs.statSync(filePath);

  res.setHeader("Content-Type", "audio/mpeg");
  res.setHeader("Content-Length", stat.size);
  res.setHeader("X-Track-Title", file.replace(".mp3", ""));

  fs.createReadStream(filePath).pipe(res);
});

// Historique fictif pour la démo
app.get("/history", (req, res) => {
  const files = fs.readdirSync(MEDIA_DIR).filter(f => f.endsWith(".mp3"));
  const history = files.map(f => ({ title: f.replace(".mp3", ""), artist: "Local" }));
  res.json(history);
});

app.listen(5000, () => console.log("✅ Serveur dev lancé sur http://localhost:5000"));
