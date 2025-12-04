export const config = {
  api: {
    bodyParser: {
      sizeLimit: '20mb',
    },
  },
};

import dbConnect from '../_lib/connect';
import Membre from '../_models/Membre';

export default async function handler(req, res) {
  await dbConnect();
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }
  try {
    const membre = await Membre.create(req.body);
    res.status(201).json(membre);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de l'ajout du membre" });
  }
}