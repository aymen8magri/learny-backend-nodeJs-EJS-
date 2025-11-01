const mongoose = require('mongoose');

const entrepriseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    logo: { type: String },
        role: { type: String, default: 'entreprise' },
}, { timestamps: true });



module.exports = mongoose.model('Entreprise', entrepriseSchema);