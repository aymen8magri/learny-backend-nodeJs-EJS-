const mongoose = require('mongoose');

const formationStagiaireSchema = new mongoose.Schema({
  stagiaire: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stagiaire',
    required: true,
  },
  formation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Formation',
    required: true,
  },
  datePostulation: {
    type: Date,
    default: Date.now,
  },
  etatInscription: {
    type: String,
    enum: ['En attente', 'Validée', 'Refusée'],
    default: 'En attente',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Formation_Stagiaire', formationStagiaireSchema);
