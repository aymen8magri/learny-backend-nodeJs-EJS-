const express = require('express');
const router = express.Router();
const stagiaireController = require('../controllers/api/stagiaireController');
const { isAuthenticated, checkRole } = require('../middlewares/auth.middleware');


// =====================
// Routes CRUD classiques
// =====================

// Obtenir un stagiaire par ID
router.get('/:id', isAuthenticated, checkRole('responsable', 'stagiaire'), stagiaireController.getStagiaireById);

// Créer un nouveau stagiaire
router.post('/', stagiaireController.createStagiaire);

// Mettre à jour un stagiaire
router.put('/:id', isAuthenticated, checkRole('responsable', 'stagiaire'), stagiaireController.updateStagiaire);


// =====================
// Routes spécifiques métier
// =====================

// Postuler à une formation
router.post('/postuler/:formationId', isAuthenticated, checkRole('stagiaire'), stagiaireController.postulerFormation);

// Consulter ses candidatures
router.get('/:stagiaireId/candidatures', isAuthenticated, checkRole('stagiaire'), stagiaireController.getCandidatures);



module.exports = router;
