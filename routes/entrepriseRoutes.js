const express = require('express');
const router = express.Router();
const entrepriseController = require('../controllers/entrepriseController');
const { isAuthenticated, checkRole } = require('../middlewares/auth.middleware');
const { requireAuth } = require('../middlewares/requireAuth');


// =====================
// FRONT OFFICE : Stagiaire
// =====================

// lister toutes les entreprises
router.get('/', requireAuth, checkRole('stagiaire'), entrepriseController.getAllEntreprises);


// =====================
// BACK OFFICE : Responsable, Entreprise
// =====================

// Voir le profil de entreprise
router.get('/profile', requireAuth, checkRole('entreprise'), entrepriseController.showProfilePage);

// Mettre à jour le profil de entreprise
router.post('/profile/update', requireAuth, checkRole('entreprise'), entrepriseController.updateProfile);

// Lister toutes les entreprises
//router.get('/all/entreprises', requireAuth, checkRole('responsable'), entrepriseController.getAllEntreprisesAdmin);
router.get('/all/entreprises', entrepriseController.getAllEntreprisesAdmin);

// Supprimer une entreprise
router.delete('/:id', requireAuth, checkRole('responsable'), entrepriseController.deleteEntreprise);


module.exports = router;