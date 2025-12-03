const express = require('express');
const router = express.Router();
const formationStagiaireController = require('../controllers/formationStagiaireController');
const { requireAuth } = require('../middlewares/requireAuth');
const { checkRole } = require('../middlewares/auth.middleware');

// =====================
// FRONT OFFICE : Stagiaire
// =====================

// postuler à une formation
router.post('/postuler', requireAuth, checkRole('stagiaire'), formationStagiaireController.postulerFormation);

// get les formations postulées par le stagiaire
router.get('/mes-formations', requireAuth, checkRole('stagiaire'), formationStagiaireController.getFormationsByStagiaire);


// =====================
// Back Office : ENTREPRISE
// =====================

// lister les stagiaires inscrits à une formation de l'entreprise
router.get('/formation/:formationId/stagiaires', requireAuth, checkRole('entreprise'), formationStagiaireController.getStagiairesByFormation);

module.exports = router;