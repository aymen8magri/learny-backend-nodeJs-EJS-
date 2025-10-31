const Entreprise = require('../models/Entreprise');


// =====================
// FRONT OFFICE : Stagiaire
// =====================

// Lister toutes les entreprises
exports.getAllEntreprises = async (req, res) => {
    try {
        const entreprises = await Entreprise.find();
        res.status(200).json(entreprises);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};


// =====================
// BACK OFFICE : Responsable, Entreprise
// =====================

// Voir le profil de son entreprise
exports.getEntrepriseById = async (req, res) => {
    try {
        const entreprise = await Entreprise.findById(req.params.id);
        if (!entreprise) {
            return res.status(404).render('error', { message: 'Entreprise non trouvée' });
        }
        res.render('entrepriseProfile', { entreprise });
    } catch (error) {
        res.status(500).render('error', { message: 'Erreur serveur' });
    }   
};

// Mettre à jour le profil de son entreprise
exports.updateEntreprise = async (req, res) => {
    try {
        const updatedEntreprise = await Entreprise.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedEntreprise) {
            return res.status(404).render('error', { message: 'Entreprise non trouvée' });
        }
        res.redirect(`/entreprises/${req.params.id}`);
    } catch (error) {
        res.status(500).render('error', { message: 'Erreur lors de la mise à jour de l\'entreprise' });
    }
};

// Lister toutes les entreprises (admin)
exports.getAllEntreprisesAdmin = async (req, res) => {
    try {
        const entreprises = await Entreprise.find();
        res.render('pages/responsable/entreprises', { entreprises });
    } catch (error) {
        res.status(500).render('error', { message: 'Erreur serveur' });
    }
};

// Supprimer une entreprise
exports.deleteEntreprise = async (req, res) => {
    try {
        const deletedEntreprise = await Entreprise.findByIdAndDelete(req.params.id);
        if (!deletedEntreprise) {
            return res.status(404).render('error', { message: 'Entreprise non trouvée' });
        }
        res.redirect('/entreprises/all');
    } catch (error) {
        res.status(500).render('error', { message: 'Erreur lors de la suppression de l\'entreprise' });
    }
};
