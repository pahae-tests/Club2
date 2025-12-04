import dbConnect from '../_lib/connect';
import Projet from '../_models/Projet';

export default async function handler(req, res) {
  await dbConnect();
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const { id } = req.query;

  try {
    await Projet.findByIdAndDelete(id);
    res.status(200).json({ message: "Projet supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la suppression du projet" });
  }
}