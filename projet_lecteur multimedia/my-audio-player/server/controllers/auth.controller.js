import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";
import redisClient from "../config/redis.js";

const JWT_SECRET = process.env.JWT_SECRET || "limbik_secret_key_2026";
const SALT_ROUNDS = 12;

export const register = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email et mot de passe requis" });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: "Le mot de passe doit faire au moins 6 caractères" });
  }

  try {
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: "Cet email est déjà utilisé" });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const result = await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email",
      [email, hashedPassword]
    );

    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "24h" });

    // Stocker la session dans Redis
    await redisClient.setEx(`session:${user.id}`, 86400, token);

    res.status(201).json({ token, user: { id: user.id, email: user.email } });
  } catch (err) {
    console.error("Erreur inscription:", err);
    res.status(500).json({ error: "Erreur serveur lors de l'inscription" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email et mot de passe requis" });
  }

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect" });
    }

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "24h" });

    // Stocker la session dans Redis
    await redisClient.setEx(`session:${user.id}`, 86400, token);

    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (err) {
    console.error("Erreur connexion:", err);
    res.status(500).json({ error: "Erreur serveur lors de la connexion" });
  }
};

export const logout = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (token) {
    // Blacklister le token dans Redis pendant 24h
    await redisClient.setEx(`blacklist:${token}`, 86400, "1");
    // Supprimer la session
    await redisClient.del(`session:${req.user.id}`);
  }

  res.json({ message: "Déconnexion réussie" });
};
