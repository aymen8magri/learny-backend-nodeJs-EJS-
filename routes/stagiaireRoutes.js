const express = require('express');
const router = express.Router();
const stagiaireController = require('../controllers/api/stagiaireController');
const { isAuthenticated, checkRole } = require('../middlewares/auth.middleware');

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
// router.get('/', isAuthenticated, checkRole('responsable'), stagiaireController.getAllStagiaires);
router.get('/', stagiaireController.getAllStagiaires);

// Supprimer un stagiaire
router.delete('/:id', isAuthenticated, checkRole('responsable'), stagiaireController.deleteStagiaire);



module.exports = router;
