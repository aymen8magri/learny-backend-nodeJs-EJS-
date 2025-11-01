const express = require('express');
const router = express.Router();
const responsableController = require('../controllers/responsableController');
const { isAuthenticated, checkRole } = require('../middlewares/auth.middleware');

// Page listant les formations en attente
router.get('/formations/pending', isAuthenticated, checkRole('responsable'), responsableController.getPendingFormations);

// Page listant les formations validées
router.get('/formations/validated', isAuthenticated, checkRole('responsable'), responsableController.getValidatedFormations);

// Actions sur les formations
router.post('/formations/:id/validate', isAuthenticated, checkRole('responsable'), responsableController.validateFormation);
router.post('/formations/:id/reject', isAuthenticated, checkRole('responsable'), responsableController.rejectFormation);

module.exports = router;
