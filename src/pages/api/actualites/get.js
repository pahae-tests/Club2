import dbConnect from '../_lib/connect';
import Actualite from '../_models/Actualite';

export default async function handler(req, res) {
  await dbConnect();
  try {
    const actualites = await Actualite.find({});
    res.status(200).json(actualites);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des actualités" });
  }
}