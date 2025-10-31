const Formation = require('../models/Formation');

// =====================
// FRONT OFFICE : Stagiaire
// =====================

// Voir toutes les formations
exports.getAllFormations = async (req, res) => {
    try {
        const formations = await Formation.find().sort({ createdAt: -1 });
        res.json(formations);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Voir une formation par ID
exports.getFormationById = async (req, res) => {
    try {
        const formation = await Formation.findById(req.params.id);
        if (!formation) {
            return res.status(404).json({ message: 'Formation non trouvée' });
        }
        res.json(formation);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Voir les formations d'une entreprise
exports.getFormationsByEntreprise = async (req, res) => {
    try {
        const formations = await Formation.find({ entreprise: req.params.entrepriseId }).sort({ createdAt: -1 });
        res.json(formations);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// =====================
// BACK OFFICE : Responsable, Entreprise
// =====================

// Créer une formation
exports.createFormation = async (req, res) => {
    try {
        const newFormation = new Formation(req.body);
        await newFormation.save();
        res.redirect('/formations/list');
    } catch (error) {
        res.status(500).render('error', { message: 'Erreur lors de la création de la formation' });
    }
};

// Mettre à jour une formation
exports.updateFormation = async (req, res) => {
    try {
        const updatedFormation = await Formation.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedFormation) {
            return res.status(404).render('error', { message: 'Formation non trouvée' });
        }
        res.redirect('/formations/list');
    } catch (error) {
        res.status(500).render('error', { message: 'Erreur lors de la mise à jour de la formation' });
    }
};

// Supprimer une formation
exports.deleteFormation = async (req, res) => {
    try {
        const deletedFormation = await Formation.findByIdAndDelete(req.params.id);
        if (!deletedFormation) {
            return res.status(404).render('error', { message: 'Formation non trouvée' });
        }
        res.redirect('/formations/list');
    } catch (error) {
        res.status(500).render('error', { message: 'Erreur lors de la suppression de la formation' });
    }
};

// Lister toutes les formations (Responsable)
exports.getAllFormationsAdmin = async (req, res) => {
    try {
        const formations = await Formation.find().sort({ createdAt: -1 });
        res.render('pages/formations/list', { formations });
    } catch (error) {
        res.status(500).render('error', { message: 'Erreur serveur' });
    }
};

// Lister les formations par entreprise (Responsable, Entreprise)
exports.getFormationsByEntrepriseAdmin = async (req, res) => {
    try {
        const formations = await Formation.find({ entreprise: req.params.entrepriseId }).sort({ createdAt: -1 });
        res.render('pages/formations/list', { formations });
    } catch (error) {
        res.status(500).render('error', { message: 'Erreur serveur' });
    }
};

// Voir une formation par ID (Responsable, Entreprise)
exports.getFormationByIdAdmin = async (req, res) => {
    try {
        const formation = await Formation.findById(req.params.id);
        if (!formation) {
            return res.status(404).render('error', { message: 'Formation non trouvée' });
        }
        res.render('formations/detail', { formation });
    } catch (error) {
        res.status(500).render('error', { message: 'Erreur serveur' });
    }
};
