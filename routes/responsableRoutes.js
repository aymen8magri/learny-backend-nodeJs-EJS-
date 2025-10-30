const express = require('express');
const router = express.Router();
const responsableController = require('../controllers/api/responsableController');
const { isAuthenticated, checkRole } = require('../middlewares/auth.middleware');

// Toutes les routes sont protégées pour les responsables (admin)
router.use(isAuthenticated, checkRole('responsable'));

// =====================
// Gestion des utilisateurs (stagiaires et entreprises)
// =====================

// Voir tous les stagiaires
router.get('/stagiaires', responsableController.getAllUsers);

// Voir tous les entreprises
router.get('/entreprises', responsableController.getAllUsers);

// Supprimer un stagiaire
router.delete('/stagiaires/:id', responsableController.deleteUser);

// Supprimer une entreprise
router.delete('/entreprises/:id', responsableController.deleteUser);

// =====================
// Gestion des formations
// =====================

// Voir toutes les formations (en attente ou validées)
router.get('/formations', responsableController.getAllFormations);

// Valider une formation avant publication
router.patch('/formations/:id/validate', responsableController.validateFormation);

// Supprimer une formation
router.delete('/formations/:id', responsableController.deleteFormation);

module.exports = router;
