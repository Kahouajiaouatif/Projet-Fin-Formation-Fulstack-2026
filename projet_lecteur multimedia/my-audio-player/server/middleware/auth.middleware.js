import jwt from "jsonwebtoken";
import redisClient from "../config/redis.js";

const JWT_SECRET = process.env.JWT_SECRET || "limbik_secret_key_2026";

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token manquant" });
  }

  const token = authHeader.split(" ")[1];

  // Vérifier si le token est blacklisté (déconnexion)
  const isBlacklisted = await redisClient.get(`blacklist:${token}`);
  if (isBlacklisted) {
    return res.status(401).json({ error: "Session expirée, veuillez vous reconnecter" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token invalide" });
  }
};
