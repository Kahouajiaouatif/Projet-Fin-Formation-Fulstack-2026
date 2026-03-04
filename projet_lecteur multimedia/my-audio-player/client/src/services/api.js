const BASE_URL = "/api";

const getHeaders = () => {
  const token = localStorage.getItem("limbik_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// Auth
export const register = async (email, password) => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Erreur d'inscription");
  }
  return res.json();
};

export const login = async (email, password) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Erreur de connexion");
  }
  return res.json();
};

export const logout = async () => {
  const res = await fetch(`${BASE_URL}/auth/logout`, {
    method: "POST",
    headers: getHeaders(),
  });
  localStorage.removeItem("limbik_token");
  localStorage.removeItem("limbik_user");
  return res.json();
};

// Radio
export const getStreamUrl = () => `${BASE_URL}/radio/stream`;

export const getHistory = async () => {
  const res = await fetch(`${BASE_URL}/radio/history`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Erreur de récupération de l'historique");
  return res.json();
};

export const searchTracks = async (query) => {
  const res = await fetch(`${BASE_URL}/radio/search?q=${encodeURIComponent(query)}`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Erreur de recherche");
  return res.json();
};

// Playlist
export const downloadPlaylist = async () => {
  const res = await fetch(`${BASE_URL}/playlist/download`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Erreur lors du téléchargement de la playlist");

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "limbik-radio.pls";
  a.click();
  URL.revokeObjectURL(url);
};
