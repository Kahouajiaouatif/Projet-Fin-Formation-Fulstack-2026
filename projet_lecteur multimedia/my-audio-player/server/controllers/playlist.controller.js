import { generatePls } from "../services/pls.service.js";

export const downloadPlaylist = async (req, res) => {
  try {
    const userId = req.user?.id || null;
    const plsContent = await generatePls(userId);

    if (!plsContent) {
      return res.status(404).json({ error: "Aucune piste dans l'historique pour générer une playlist" });
    }

    res.setHeader("Content-Type", "audio/x-scpls");
    res.setHeader("Content-Disposition", 'attachment; filename="limbik-radio.pls"');
    res.send(plsContent);
  } catch (err) {
    console.error("Erreur génération playlist:", err);
    res.status(500).json({ error: "Erreur lors de la génération de la playlist" });
  }
};
