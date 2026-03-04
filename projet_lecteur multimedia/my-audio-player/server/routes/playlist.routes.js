import { Router } from "express";
import { downloadPlaylist } from "../controllers/playlist.controller.js";

const router = Router();

router.get("/download", downloadPlaylist);

export default router;
