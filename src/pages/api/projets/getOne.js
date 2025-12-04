import dbConnect from '../_lib/connect';
import Projet from '../_models/Projet';
import Membre from '../_models/Membre';

export default async function handler(req, res) {
  await dbConnect();
  try {
    const projet = await Projet.findOne({ current: true }).populate({
      path: 'groupes.members',
      model: 'Membre',
    });

    if (!projet) {
      return res.status(404).json({ error: "Aucun projet en cours trouvé" });
    }

    res.status(200).json(projet);
  } catch (error) {
    console.error("Erreur:", error);
    res.status(500).json({ error: "Erreur lors de la récupération du projet" });
  }
}