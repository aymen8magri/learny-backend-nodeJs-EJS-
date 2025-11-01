const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// === Flutter / API ===
router.post('/api/signup', (req, res, next) => {
  req.body.source = 'api'; // 👈 on précise la source
  next();
}, authController.signup);

router.post('/api/login', (req, res, next) => {
  req.body.source = 'api';
  next();
}, authController.login);

// === EJS / Web ===
router.get('/login', authController.showLoginPage);
router.post('/login', (req, res, next) => {
  req.body.source = 'web';
  next();
}, authController.login);

// === Signup uniquement pour entreprise (EJS) ===
router.get('/signup', authController.showSignupPage);
router.post('/signup', (req, res, next) => {
  req.body.source = 'web';
  next();
}, authController.signup);

router.get('/logout', authController.logout);

module.exports = router;
