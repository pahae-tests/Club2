import mongoose from "mongoose";

const membreSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    trim: true,
  },
  prenom: {
    type: String,
    required: true,
    trim: true,
  },
  tel: {
    type: String,
    required: true,
    match: [/^0[5-7]\d{8}$/, "Numéro de téléphone invalide"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, "Email invalide"],
  },
  dateN: {
    type: Date,
    required: true,
  },
  ville: {
    type: String,
    required: true,
  },
  points: {
    type: Number,
    default: 0,
    min: 0,
  },
  admin: {
    type: Boolean,
    default: false,
  },
  img: {
    type: String,
    default: "/imgs/default.jpg",
  },
}, {
  timestamps: true, // ajoute createdAt et updatedAt
});

const Membre = mongoose.models.Membre || mongoose.model("Membre", membreSchema);
export default Membre;