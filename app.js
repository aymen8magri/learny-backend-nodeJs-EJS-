// ===============================
// Importation des modules
// ===============================
const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');

require('./config/connect');

const { requireAuth } = require('./middlewares/requireAuth');
const { setUserInViews } = require('./middlewares/auth.middleware');

// Import des routes
const stagiaireRoutes = require('./routes/stagiaireRoutes');
const formationRoutes = require('./routes/formationRoutes');
const entrepriseRoutes = require('./routes/entrepriseRoutes');
const responsableRoutes = require('./routes/responsableRoutes');
const authRoutes = require('./routes/authRoutes');

// ===============================
// Initialisation de l’application
// ===============================
const app = express();

// ===============================
// Middlewares globaux
// ===============================

// Permet de parser le JSON envoyé par le front ou Postman
app.use(express.json());

// Permet de parser les données des formulaires HTML
app.use(express.urlencoded({ extended: true }));

// Permet de lire et écrire des cookies
app.use(cookieParser());

// Configuration du moteur de templates EJS + layouts
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/index');

// Dossier public pour les fichiers statiques (CSS, JS, images…)
app.use(express.static(path.join(__dirname, 'assets')));

// Middleware pour rendre l’utilisateur disponible dans toutes les vues
app.use(setUserInViews);

// ===============================
// Définition des routes
// ===============================

// Routes publiques (sans authentification)
app.use('/', authRoutes);
app.get('/', (req, res) => res.render('pages/home'));

// Routes protégées (nécessitent une authentification)
app.use('/stagiaires', requireAuth, stagiaireRoutes);
app.use('/formations', formationRoutes);
app.use('/entreprises', requireAuth, entrepriseRoutes);
app.use('/responsable', requireAuth, responsableRoutes);

// ===============================
// Gestion des erreurs 404
// ===============================
app.use((req, res) => {
  res.status(404).render('error', { message: 'Page non trouvée' });
});

// ===============================
// Lancement du serveur
// ===============================
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
