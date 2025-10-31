const Stagiaire = require('../models/Stagiaire');

// =====================
// FRONT OFFICE : Stagiaire
// =====================

// Voir son propre profil
exports.getStagiaireById = async (req, res) => {
    try {
        const stagiaire = await Stagiaire.findById(req.params.id);
        if (!stagiaire) {
            return res.status(404).json({ message: 'Stagiaire non trouvé' });
        }
        res.json(stagiaire);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Mettre à jour son profil
exports.updateStagiaire = async (req, res) => {
    try {
        const updatedStagiaire = await Stagiaire.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedStagiaire) {
            return res.status(404).json({ message: 'Stagiaire non trouvé' });
        }
        res.json(updatedStagiaire);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};


// =====================
// BACK OFFICE : Responsable
// =====================

// Lister tous les stagiaires
exports.getAllStagiaires = async (req, res) => {
    try {
        const stagiaires = await Stagiaire.find().sort({ createdAt: -1 });
        res.render('pages/responsable/stagiaires', { stagiaires });
    } catch (error) {
        res.status(500).render('error', { message: 'Erreur lors du chargement des stagiaires' });
    }
};

// Supprimer un stagiaire
exports.deleteStagiaire = async (req, res) => {
    try {
        const deletedStagiaire = await Stagiaire.findByIdAndDelete(req.params.id);
        if (!deletedStagiaire) {
            res.render('responsable/stagiaires', { error: 'Stagiaire non trouvé' });
        }
        res.redirect('/responsable/stagiaires');
    } catch (error) {
        res.status(500).render('error', { message: 'Erreur lors de la suppression' });
    }
};
