const mongoose = require('mongoose');

const responsableSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    profilePicture: { type: String },
}, { timestamps: true });



module.exports = mongoose.model('Responsable', responsableSchema);