import mongoose from "mongoose";

const groupeSchema = new mongoose.Schema({
  points: {
    type: Number,
    required: true,
    default: 0,
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Membre",
      required: true,
    }
  ],
}, { _id: false });

const projetSchema = new mongoose.Schema({
  current: {
    type: Boolean,
    default: false,
  },
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
  groupes: {
    type: [groupeSchema],
    default: [],
  },
}, {
  timestamps: true, // ajoute createdAt et updatedAt
});

const Projet = mongoose.models.Projet || mongoose.model("Projet", projetSchema);
export default Projet;