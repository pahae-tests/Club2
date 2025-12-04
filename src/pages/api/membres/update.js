import dbConnect from '../_lib/connect';
import Membre from '../_models/Membre';

export default async function handler(req, res) {
  await dbConnect();
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }
  const { id } = req.query;
  try {
    const membre = await Membre.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(membre);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la mise à jour du membre" });
  }
}