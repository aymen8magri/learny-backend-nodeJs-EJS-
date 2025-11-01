const express = require('express');
const router = express.Router();
const formationController = require('../controllers/formationController');
const { requireAuth } = require('../middlewares/requireAuth');
const { checkRole } = require('../middlewares/auth.middleware');

// =====================
// BACK OFFICE : Entreprise et Responsable
// =====================

// Formulaire d'ajout d'une formation (entreprise)
router.get('/add', requireAuth, checkRole('entreprise'), formationController.showAddForm);
router.post('/add', requireAuth, checkRole('entreprise'), formationController.createFormation);

// Lister les formations validees/non-validees de l'entreprise connectée
router.get('/validees', requireAuth, checkRole('entreprise'), formationController.getFormationsValideesEntreprise);
router.get('/non-validees', requireAuth, checkRole('entreprise'), formationController.getFormationsNonValideesEntreprise);

// Mettre à jour / supprimer une formation (entreprise / responsable)
router.put('/:id', requireAuth, checkRole('entreprise'), formationController.updateFormation);
router.delete('/:id', requireAuth, checkRole(['responsable','entreprise']), formationController.deleteFormation);

// Lister toutes les formations (responsable)
router.get('/all/formations', requireAuth, checkRole('responsable'), formationController.getAllFormationsAdmin);

// Lister formations d'une entreprise (responsable/entreprise)
router.get('/all/entreprise/:entrepriseId', requireAuth, checkRole(['responsable','entreprise']), formationController.getFormationsByEntrepriseAdmin);

// Voir une formation par ID (responsable/entreprise)
router.get('/all/:id', requireAuth, checkRole(['responsable','entreprise']), formationController.getFormationByIdAdmin);

// =====================
// FRONT OFFICE : Stagiaire
// =====================

// Voir toutes les formations (stagiaire)
router.get('/', requireAuth, checkRole('stagiaire'), formationController.getAllFormations);

// Voir les formations d'une entreprise (stagiaire)
router.get('/entreprise/:entrepriseId', requireAuth, checkRole('stagiaire'), formationController.getFormationsByEntreprise);

// **DERNIÈRE** : voir une formation par ID (stagiaire) -> toujours après toutes les autres
router.get('/getFormationById/:id', requireAuth, checkRole('stagiaire'), formationController.getFormationById);

module.exports = router;
