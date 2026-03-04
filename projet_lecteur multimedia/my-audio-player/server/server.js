import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import radioRoutes from "./routes/radio.routes.js";
import playlistRoutes from "./routes/playlist.routes.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/radio", radioRoutes);
app.use("/api/playlist", playlistRoutes);

// Santé du serveur
app.get("/health", (req, res) => res.json({ status: "ok" }));

app.listen(PORT, () => {
  console.log(`Serveur Limbik Radio démarré sur le port ${PORT}`);
});
