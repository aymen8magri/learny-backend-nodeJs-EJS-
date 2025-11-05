const express = require('express');
const router = express.Router();
const stagiaireController = require('../controllers/stagiaireController');
const { isAuthenticated, checkRole } = require('../middlewares/auth.middleware');
const { requireAuth } = require('../middlewares/requireAuth');

// =====================
// FRONT OFFICE : Stagiaire
// =====================

// Voir son propre profil
router.get('/:id', isAuthenticated, checkRole('stagiaire'), stagiaireController.getStagiaireById);

// Mettre à jour son profil
router.put('/:id', isAuthenticated, checkRole('stagiaire'), stagiaireController.updateStagiaire);


// =====================
// BACK OFFICE : Responsable
// =====================

// Lister tous les stagiaires
router.get('/', requireAuth, checkRole('responsable'), stagiaireController.getAllStagiaires);

// Supprimer un stagiaire
router.post('/:id', requireAuth, checkRole('responsable'), stagiaireController.deleteStagiaire);



module.exports = router;
