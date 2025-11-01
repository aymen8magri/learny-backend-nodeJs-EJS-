const Formation = require('../models/Formation');

// =====================
// BACK OFFICE : Responsable
// =====================

// Lister les formations en attente
exports.getPendingFormations = async (req, res) => {
  try {
    const formations = await Formation.find({ status: 'En attente' }).populate('entreprise');
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
    res.redirect('/responsable/formations-validated');
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
    res.redirect('/responsable/formations-pending');
  } catch (error) {
    res.status(500).render('error', { message: 'Erreur lors du rejet' });
  }
};
