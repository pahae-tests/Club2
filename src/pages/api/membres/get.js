import dbConnect from '../_lib/connect';
import Membre from '../_models/Membre';

export default async function handler(req, res) {
  await dbConnect();
  try {
    const membres = await Membre.find({});
    res.status(200).json(membres);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des membres" });
  }
}