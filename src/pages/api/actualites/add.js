import dbConnect from '../_lib/connect';
import Actualite from '../_models/Actualite';

export default async function handler(req, res) {
  await dbConnect();
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }
  try {
    const actualite = await Actualite.create(req.body);
    res.status(201).json(actualite);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de l'ajout de l'actualité" });
  }
}