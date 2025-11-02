const Entreprise = require('../models/Entreprise');
const bcrypt = require('bcrypt');
const Formation = require('../models/Formation');


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

// Afficher le dashboard de l'entreprise
exports.showDashboard = async (req, res) => {
  try {
    const entreprise = await Entreprise.findById(req.user.id);

    const formations = await Formation.find({ entreprise: req.user.id }).sort({ createdAt: -1 }).limit(5);
    const totalFormations = await Formation.countDocuments({ entreprise: req.user.id });
    const pendingFormations = await Formation.countDocuments({ entreprise: req.user.id, status: 'En attente' });
    const validatedFormations = await Formation.countDocuments({ entreprise: req.user.id, status: 'Validée' });
    const refusedFormations = await Formation.countDocuments({ entreprise: req.user.id, status: 'Refusée' });

    res.render('pages/entreprise/dashboard', {
      entreprise,
      formations,
      stats: { totalFormations, pendingFormations, validatedFormations, refusedFormations }
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { message: 'Erreur lors du chargement du dashboard' });
  }
};

// Voir le profil de son entreprise
exports.showProfilePage = async (req, res) => {
    try {
        const entreprise = await Entreprise.findById(req.user.id);
        res.render('pages/entreprise/profile', { entreprise });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Erreur lors du chargement du profil' });
    }
};

// Mettre à jour le profil de son entreprise
exports.updateProfile = async (req, res) => {
    try {
        const { name, address, phone, password } = req.body;
        const updateData = { name, address, phone };

        if (password && password.trim() !== "") {
            updateData.password = await bcrypt.hash(password, 10);
        }

        await Entreprise.findByIdAndUpdate(req.user.id, updateData);
        res.redirect('/entreprises/profile');
    } catch (err) {
        console.error(err);
        res.status(500).render('error', { message: "Erreur lors de la mise à jour" });
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
