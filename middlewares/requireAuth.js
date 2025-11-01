const jwt = require('jsonwebtoken');

exports.requireAuth = (req, res, next) => {
  console.log("Cookies reçus:", req.cookies);

  const token = req.cookies?.token;

  if (!token) {
    // Cas Flutter (API)
    if (req.originalUrl.startsWith('/api')) {
      return res.status(401).json({ message: 'Token manquant' });
    }

    // Cas Web (EJS)
    return res.redirect('/login');
  }

  try {
    const decoded = jwt.verify(token, '123456789');
    req.user = decoded;
    res.locals.user = decoded; // ✅ accessible dans EJS (navbar, etc.)
    next();
  } catch (err) {
    console.error('Erreur JWT:', err.message);
    res.clearCookie('token');
    return res.redirect('/login');
  }
};
