import dbConnect from '../_lib/connect';
import Actualite from '../_models/Actualite';

export default async function handler(req, res) {
  await dbConnect();
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }
  const { id } = req.query;
  try {
    await Actualite.findByIdAndDelete(id);
    res.status(200).json({ message: "Actualité supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la suppression de l'actualité" });
  }
}