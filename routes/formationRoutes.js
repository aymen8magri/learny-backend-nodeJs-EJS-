const express = require('express');
const router = express.Router();
const formationController = require('../controllers/formationController');
const { isAuthenticated, checkRole } = require('../middlewares/auth.middleware');

// =====================
// FRONT OFFICE : Stagiaire
// =====================

// voir tous les formations
router.get('/', isAuthenticated, checkRole('stagiaire'), formationController.getAllFormations);

// voir une formation par id
router.get('/:id', isAuthenticated, checkRole('stagiaire'), formationController.getFormationById);

// voir les formations d'une entreprise
router.get('/entreprise/:entrepriseId', isAuthenticated, checkRole('stagiaire'), formationController.getFormationsByEntreprise);


// =====================
// BACK OFFICE : Responsable, Entreprise
// =====================

// créer une formation
router.post('/', isAuthenticated, checkRole('entreprise'), formationController.createFormation);

// mettre à jour une formation
router.put('/:id', isAuthenticated, checkRole('entreprise'), formationController.updateFormation);

// supprimer une formation (responsable, entreprise)
router.delete('/:id', isAuthenticated, checkRole(['responsable','entreprise']), formationController.deleteFormation);

// lister toutes les formations (responsable)
// router.get('/all/formations', isAuthenticated, checkRole('responsable'), formationController.getAllFormationsAdmin);
router.get('/all/formations', formationController.getAllFormationsAdmin);

// lister les formations par entreprise (responsable, entreprise)
router.get('/all/entreprise/:entrepriseId', isAuthenticated, checkRole(['responsable','entreprise']), formationController.getFormationsByEntrepriseAdmin);

// voir une formation par id (responsable, entreprise)
router.get('/all/:id', isAuthenticated, checkRole(['responsable','entreprise']), formationController.getFormationByIdAdmin);



module.exports = router;