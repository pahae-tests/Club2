import dbConnect from '../_lib/connect';
import Projet from '../_models/Projet';

export default async function handler(req, res) {
  await dbConnect();
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const { projectId, votes } = req.body;

  try {
    const projet = await Projet.findById(projectId);
    if (!projet) return res.status(404).json({ error: "Projet non trouvé" });

    // 🔥 mise à jour des points pour chaque groupe
    projet.groupes.forEach((g, i) => {
      g.points = votes[i] || 0;
    });

    // 🔒 marquer le projet comme finalisé
    projet.current = false;

    await projet.save();

    res.status(200).json(projet);
  } catch (error) {
    console.error("Erreur:", error);
    res.status(500).json({ error: "Erreur lors de la finalisation du projet" });
  }
}