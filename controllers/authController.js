const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Stagiaire = require('../models/Stagiaire');
const Responsable = require('../models/Responsable');
const Entreprise = require('../models/Entreprise');

// ==========================
// SIGNUP (API - Flutter pour Stagiaire + EJS pour Entreprise)
// ==========================
exports.signup = async (req, res) => {
  try {
    const { source } = req.body;

    // === Cas Flutter (stagiaire)
    if (source === 'api') {
      const { firstName, lastName, email, password } = req.body;

      const existing = await Stagiaire.findOne({ email });
      if (existing) return res.status(400).json({ message: 'Email déjà utilisé' });

      const hashed = await bcrypt.hash(password, 10);
      const stagiaire = new Stagiaire({ firstName, lastName, email, password: hashed });
      await stagiaire.save();

      return res.status(201).json({ message: 'Stagiaire créé avec succès' });
    }

    // === Cas EJS (entreprise)
    const { name, email, password, address, phone } = req.body;

    const existingEntreprise = await Entreprise.findOne({ email });
    if (existingEntreprise) {
      return res.render('pages/signup', { error: 'Email déjà utilisé', success: null });
    }

    const hashed = await bcrypt.hash(password, 10);
    const entreprise = new Entreprise({
      name,
      email,
      password: hashed,
      address,
      phone,
      role: 'entreprise',
    });
    await entreprise.save();
    return res.redirect('/login?registered=1');
  } catch (err) {
    console.error(err);
    if (req.body.source === 'web')
      return res.render('pages/signup', { error: 'Erreur serveur', success: null });
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};


// ==========================
// LOGIN (API - Flutter ou EJS - Web)
// ==========================
exports.login = async (req, res) => {
  try {
    const { email, password, role, source } = req.body;

    // Flutter → stagiaire
    if (source === 'api') {
      const stagiaire = await Stagiaire.findOne({ email });
      if (!stagiaire) return res.status(404).json({ message: 'Utilisateur introuvable' });

      const isMatch = await bcrypt.compare(password, stagiaire.password);
      if (!isMatch) return res.status(400).json({ message: 'Mot de passe incorrect' });

      const token = jwt.sign({ id: stagiaire._id, role: 'stagiaire' }, '123456789', {
        expiresIn: '2h',
      });

      return res.status(200).json({ token, user: stagiaire });
    }

    // EJS → entreprise ou responsable
    let user;
    if (role === 'entreprise') user = await Entreprise.findOne({ email });
    else if (role === 'responsable') user = await Responsable.findOne({ email });
    else return res.render('pages/login', { error: 'Rôle non valide' });

    if (!user) return res.render('pages/login', { error: 'Utilisateur introuvable' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.render('pages/login', { error: 'Mot de passe incorrect' });

    const token = jwt.sign({ id: user._id, role }, '123456789', { expiresIn: '2h' });

    // Cookie pour EJS
    res.cookie('token', token, {
      httpOnly: true,
      secure: false,        // mettre true si HTTPS
      sameSite: 'lax',      // permet l'envoi du cookie sur les redirections internes
      maxAge: 2 * 60 * 60 * 1000, // 2 heures
    });
    if (role === 'responsable') return res.redirect('/responsable/dashboard');
    if (role === 'entreprise') return res.redirect('/entreprises/dashboard');
  } catch (err) {
    console.error(err);
    if (req.body.source === 'web')
      return res.render('pages/login', { error: 'Erreur serveur' });
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// ==========================
// PAGES EJS
// ==========================
exports.showSignupPage = (req, res) => {
  res.render('pages/signup', { error: null, success: null });
};

exports.showLoginPage = (req, res) => {
  res.render('pages/login', { error: null });
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
};
