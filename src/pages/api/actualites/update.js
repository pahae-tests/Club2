import dbConnect from '../_lib/connect';
import Actualite from '../_models/Actualite';

export default async function handler(req, res) {
  await dbConnect();
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }
  const { id } = req.query;
  try {
    const actualite = await Actualite.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(actualite);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la mise à jour de l'actualité" });
  }
}