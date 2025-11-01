const mongoose = require('mongoose');

const responsableSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    profilePicture: { type: String },
        role: { type: String, default: 'responsable' },
}, { timestamps: true });



module.exports = mongoose.model('Responsable', responsableSchema);