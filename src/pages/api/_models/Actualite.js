import mongoose from "mongoose";

const actualiteSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: true,
    trim: true,
  },
  descr: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  heure: {
    type: String,
    required: true,
  },
  salle: {
    type: String,
    required: true,
    trim: true,
  },
}, {
  timestamps: true, // ajoute createdAt et updatedAt
});

const Actualite = mongoose.models.Actualite || mongoose.model("Actualite", actualiteSchema);
export default Actualite;