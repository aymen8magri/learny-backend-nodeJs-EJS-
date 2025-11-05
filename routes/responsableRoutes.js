const express = require('express');
const router = express.Router();
const responsableController = require('../controllers/responsableController');
const { isAuthenticated, checkRole } = require('../middlewares/auth.middleware');
const { requireAuth } = require('../middlewares/requireAuth');

// Dashboard du responsable
router.get('/dashboard', requireAuth, checkRole('responsable'), responsableController.getDashboard);

// Page listant les formations en attente
router.get('/formations/pending', requireAuth, checkRole('responsable'), responsableController.getPendingFormations);

// Page listant les formations validées
router.get('/formations/validated', requireAuth, checkRole('responsable'), responsableController.getValidatedFormations);

// Actions sur les formations
router.post('/formations/:id/validate', requireAuth, checkRole('responsable'), responsableController.validateFormation);
router.post('/formations/:id/reject', requireAuth, checkRole('responsable'), responsableController.rejectFormation);
router.post('/formations/:id/delete', requireAuth, checkRole('responsable'), responsableController.deleteFormation);

module.exports = router;
