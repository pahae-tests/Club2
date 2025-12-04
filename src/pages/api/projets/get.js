import dbConnect from '../_lib/connect';
import Projet from '../_models/Projet';

export default async function handler(req, res) {
  await dbConnect();
  try {
    const projets = await Projet.find({}).populate({
      path: 'groupes.members',
      model: 'Membre',
    });
    res.status(200).json(projets);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des projets" });
  }
}