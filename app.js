const express = require('express');
const path = require('path');
require('./config/connect');
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const { requireAuth } = require('./middlewares/requireAuth');
const { setUserInViews } = require('./middlewares/auth.middleware');


const stagiaireRoutes = require('./routes/stagiaireRoutes');
const formationRoutes = require('./routes/formationRoutes');
const entrepriseRoutes = require('./routes/entrepriseRoutes');
const responsableRoutes = require('./routes/responsableRoutes');
const authRoutes = require('./routes/authRoutes');


const app = express();

// =====================
// Middlewares
// =====================

// Pour parser le JSON envoyé depuis le front ou Postman
app.use(express.json());

// Pour parser les données des formulaires HTML
app.use(express.urlencoded({ extended: true }));

// Pour parser les cookies
app.use(cookieParser());

// Pour utiliser les layouts EJS

// Définir le dossier des vues EJS
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'assets')));

app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layouts/index');


app.use(setUserInViews);

// =====================
// Routes
// =====================
// ✅ Routes publiques (sans auth)
app.use('/', authRoutes);
app.get('/', (req, res) => res.render('pages/home'));

// ✅ Routes protégées (nécessitent un token)
app.use('/stagiaires', requireAuth, stagiaireRoutes);
app.use('/formations', formationRoutes);
app.use('/entreprises', requireAuth, entrepriseRoutes);
app.use('/responsable', requireAuth, responsableRoutes);





// =====================
// Gestion des erreurs 404
// =====================
app.use((req, res) => {
  res.status(404).render('error', { message: 'Page non trouvée' });
});



// =====================
// Lancement du serveur
// =====================
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
