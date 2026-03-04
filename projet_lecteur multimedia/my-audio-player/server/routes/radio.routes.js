import { Router } from "express";
import { stream, getNowPlaying, getHistory, searchTracks } from "../controllers/radio.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

// Le stream est accessible sans authentification, mais enregistre l'user si connecté
router.get("/stream", stream);
router.get("/now-playing", getNowPlaying);
router.get("/history", getHistory);
router.get("/search", searchTracks);

export default router;
