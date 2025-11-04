const Formation = require('../models/Formation');
const Stagiaire = require('../models/Stagiaire');
const Entreprise = require('../models/Entreprise');

// =====================
// BACK OFFICE : Responsable
// =====================

// Afficher le dashboard du responsable
exports.getDashboard = async (req, res) => {
  try {
    // Exécuter les requêtes en parallèle (plus rapide)
    const [totalFormations, pendingFormations, validatedFormations, refusedFormations, totalStagiaires , totalEntreprises ] = await Promise.all([
      Formation.countDocuments(),
      Formation.countDocuments({ status: 'En attente' }),
      Formation.countDocuments({ status: 'Validée' }),
      Formation.countDocuments({ status: 'Refusée' }),
      Stagiaire.countDocuments(),
      Entreprise.countDocuments()
    ]);

    // Calculer les pourcentages (évite les divisions par zéro)
    const total = totalFormations || 1;
    const stats = {
      pendingPercent: ((pendingFormations / total) * 100).toFixed(1),
      validatedPercent: ((validatedFormations / total) * 100).toFixed(1),
      refusedPercent: ((refusedFormations / total) * 100).toFixed(1),
    };

    // Récupérer les dernières formations créées (pour tableau sur le dashboard)
    const latestFormations = await Formation.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('entreprise', 'name');

    // Rendu de la page EJS
    res.render('pages/responsable/dashboard', {
      totalFormations,
      pendingFormations,
      validatedFormations,
      refusedFormations,
      totalStagiaires,
      totalEntreprises,
      stats,
      latestFormations
    });
  } catch (error) {
    console.error('Erreur Dashboard Responsable:', error.message);
    res.status(500).render('error', { message: 'Erreur lors du chargement du dashboard.' });
  }
};


// Lister les formations en attente
exports.getPendingFormations = async (req, res) => {
  try {
    const formations = await Formation.find({ status: { $in: ['En attente', 'Refusée'] } }).populate('entreprise');
    res.render('pages/responsable/formations-pending', { formations });
  } catch (error) {
    res.status(500).render('error', { message: 'Erreur lors du chargement des formations en attente' });
  }
};

// Lister les formations validées
exports.getValidatedFormations = async (req, res) => {
  try {
    const formations = await Formation.find({ status: 'Validée' }).populate('entreprise');
    res.render('pages/responsable/formations-validated', { formations });
  } catch (error) {
    res.status(500).render('error', { message: 'Erreur lors du chargement des formations validées' });
  }
};

// Valider une formation
exports.validateFormation = async (req, res) => {
  try {
    const formation = await Formation.findByIdAndUpdate(req.params.id, { status: 'Validée' });
    if (!formation) {
      return res.status(404).render('error', { message: 'Formation non trouvée' });
    }
    res.redirect('/responsable/formations/validated');
  } catch (error) {
    res.status(500).render('error', { message: 'Erreur lors de la validation' });
  }
};

// Rejeter une formation
exports.rejectFormation = async (req, res) => {
  try {
    const formation = await Formation.findByIdAndUpdate(req.params.id, { status: 'Refusée' });
    if (!formation) {
      return res.status(404).render('error', { message: 'Formation non trouvée' });
    }
    res.redirect('/responsable/formations/pending');
  } catch (error) {
    res.status(500).render('error', { message: 'Erreur lors du rejet' });
  }
};
