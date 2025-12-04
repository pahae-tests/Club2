import dbConnect from '../_lib/connect';
import Projet from '../_models/Projet';
import Membre from '../_models/Membre';

export default async function handler(req, res) {
  await dbConnect();
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    // Récupérer tous les membres admins
    const admins = await Membre.find({ admin: true });
    const nonAdmins = await Membre.find({ admin: false });

    // Créer n groupes (n = nombre d'admins)
    const groupes = admins.map((admin, index) => ({
      points: 0,
      members: [admin._id],
    }));

    // Répartir les non-admins sur les groupes
    nonAdmins.forEach((member, index) => {
      const groupIndex = index % groupes.length;
      groupes[groupIndex].members.push(member._id);
    });

    // Créer le projet
    const projet = await Projet.create({
      ...req.body,
      groupes,
      current: true,
    });

    res.status(201).json(projet);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de l'ajout du projet" });
  }
}