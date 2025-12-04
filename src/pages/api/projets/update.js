import dbConnect from '../_lib/connect';
import Projet from '../_models/Projet';

export default async function handler(req, res) {
  await dbConnect();
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const { id } = req.query;

  try {
    const projet = await Projet.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(projet);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la mise à jour du projet" });
  }
}