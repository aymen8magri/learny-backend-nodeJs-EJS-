const mongoose = require('mongoose');

const formationSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    dateDebut: { type: Date, required: true },
    dateFin: { type: Date, required: true },
    nbPlaces: { type: Number, required: true },
    duration: { type: Number, required: true },
    price: { type: Number, required: true },
    planning: { type: String },
    image: { type: String },
    entreprise: { type: mongoose.Schema.Types.ObjectId, ref: 'Entreprise', required: true },
    stagiairesPostules: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Stagiaire' }],
    valide: { type: Boolean, default: false },
}, { timestamps: true });



module.exports = mongoose.model('Formation', formationSchema);