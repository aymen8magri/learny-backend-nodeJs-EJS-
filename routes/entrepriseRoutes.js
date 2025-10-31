const express = require('express');
const router = express.Router();
const entrepriseController = require('../controllers/entrepriseController');
const { isAuthenticated, checkRole } = require('../middlewares/auth.middleware');


// =====================
// FRONT OFFICE : Stagiaire
// =====================

// lister toutes les entreprises
router.get('/', isAuthenticated, checkRole('stagiaire'), entrepriseController.getAllEntreprises);


// =====================
// BACK OFFICE : Responsable, Entreprise
// =====================

// Voir le profil de son entreprise
router.get('/:id', isAuthenticated, checkRole('entreprise'), entrepriseController.getEntrepriseById);

// Mettre à jour le profil de son entreprise
router.put('/:id', isAuthenticated, checkRole('entreprise'), entrepriseController.updateEntreprise);

// Lister toutes les entreprises
//router.get('/all/entreprises', isAuthenticated, checkRole('responsable'), entrepriseController.getAllEntreprisesAdmin);
router.get('/all/entreprises', entrepriseController.getAllEntreprisesAdmin);

// Supprimer une entreprise
router.delete('/:id', isAuthenticated, checkRole('responsable'), entrepriseController.deleteEntreprise);


module.exports = router;