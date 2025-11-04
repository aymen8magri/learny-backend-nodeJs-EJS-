const jwt = require('jsonwebtoken');
const Entreprise = require('../models/Entreprise');
const Responsable = require('../models/Responsable');

exports.setUserInViews = (req, res, next) => {
  const token = req.cookies?.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, '123456789');
      res.locals.user = decoded;
    } catch (err) {
      res.locals.user = null;
    }
  } else {
    res.locals.user = null;
  }
  next();
};

exports.isAuthenticated = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token manquant' });

  try {
    const decoded = jwt.verify(token, "123456789");
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token invalide' });
  }
};

// Middleware pour vérifier le rôle
exports.checkRole = (...roles) => {
  return (req, res, next) => {
    console.log('Utilisateur connecté =>', req.user);
    if (!roles.includes(req.user.role)) {
      console.log('Rôle attendu:', roles, 'Rôle actuel:', req.user.role);
      return res.status(403).json({ message: 'Accès refusé : rôle non autorisé' });
    }
    next();
  };
};
