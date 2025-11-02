const Formation = require('../models/Formation');

// =====================
// FRONT OFFICE : Stagiaire
// =====================

// Voir toutes les formations
exports.getAllFormations = async (req, res) => {
    try {
        const formations = await Formation.find().sort({ createdAt: -1 });
        res.json(formations);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Voir une formation par ID
exports.getFormationById = async (req, res) => {
    try {
        const formation = await Formation.findById(req.params.id);
        if (!formation) {
            return res.status(404).json({ message: 'Formation non trouvée' });
        }
        res.json(formation);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Voir les formations d'une entreprise
exports.getFormationsByEntreprise = async (req, res) => {
    try {
        const formations = await Formation.find({ entreprise: req.params.entrepriseId }).sort({ createdAt: -1 });
        res.json(formations);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// =====================
// BACK OFFICE : Responsable, Entreprise
// =====================
// Afficher le formulaire d'ajout de formation
exports.showAddForm = async (req, res) => {
    try {
        // On peut récupérer l'id et le nom de l'entreprise connectée
        const entrepriseId = req.user.id;
        const entrepriseName = req.user.nom; // si tu as stocké le nom dans le token/session

        res.render('pages/formations/add', { entrepriseId, entrepriseName });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Erreur lors du chargement du profil' });
    }
};

// Créer une formation
exports.createFormation = async (req, res) => {
    try {
        // On récupère les champs du formulaire
        const { title, description, dateDebut, dateFin, nbPlaces, duration, price, planning } = req.body;

        // On récupère l'entreprise connectée via req.user.id
        const entrepriseId = req.user.id;

        // Création de la formation
        const newFormation = new Formation({
            title,
            description,
            dateDebut,
            dateFin,
            nbPlaces,
            duration,
            price,
            planning,
            entreprise: entrepriseId,  // association automatique
            status: 'En attente'       // valeur par défaut
        });

        await newFormation.save();

        // Redirection vers le formulaire ou vers la liste
        res.redirect('/formations/add');  // ou '/formations/all/entreprise/:id' si tu veux montrer la liste
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Erreur lors de la création de la formation' });
    }
};

// Formations validées pour l'entreprise connectée
exports.getFormationsValideesEntreprise = async (req, res) => {
    try {
        const formations = await Formation.find({
            status: 'Validée',
            entreprise: req.user.id   // filtrer par entreprise connectée
        });
        res.render('pages/entreprise/formationsValidees', { formations });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Erreur serveur' });
    }
};

// Formations non validées pour l'entreprise connectée
exports.getFormationsNonValideesEntreprise = async (req, res) => {
    try {
        const formations = await Formation.find({
            status: { $in: ['En attente', 'Refusée'] },
            entreprise: req.user.id   // filtrer par entreprise connectée
        });
        res.render('pages/entreprise/formationsNonValidees', { formations });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Erreur serveur' });
    }
};


// Mettre à jour une formation
exports.updateFormation = async (req, res) => {
    try {
        const updatedFormation = await Formation.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedFormation) {
            return res.status(404).render('error', { message: 'Formation non trouvée' });
        }
        res.redirect('/formations/list');
    } catch (error) {
        res.status(500).render('error', { message: 'Erreur lors de la mise à jour de la formation' });
    }
};

// Supprimer une formation
exports.deleteFormation = async (req, res) => {
    try {
        const deletedFormation = await Formation.findByIdAndDelete(req.params.id);
        if (!deletedFormation) {
            return res.status(404).render('error', { message: 'Formation non trouvée' });
        }
        res.redirect('/formations/list');
    } catch (error) {
        res.status(500).render('error', { message: 'Erreur lors de la suppression de la formation' });
    }
};

// Lister toutes les formations (Responsable)
exports.getAllFormationsAdmin = async (req, res) => {
    try {
        const formations = await Formation.find().sort({ createdAt: -1 });
        res.render('pages/formations/list', { formations });
    } catch (error) {
        res.status(500).render('error', { message: 'Erreur serveur' });
    }
};

// Lister les formations par entreprise (Responsable, Entreprise)
exports.getFormationsByEntrepriseAdmin = async (req, res) => {
    try {
        const formations = await Formation.find({ entreprise: req.params.entrepriseId }).sort({ createdAt: -1 });
        res.render('pages/formations/list', { formations });
    } catch (error) {
        res.status(500).render('error', { message: 'Erreur serveur' });
    }
};

// Voir une formation par ID (Responsable, Entreprise)
exports.getFormationByIdAdmin = async (req, res) => {
    try {
        const formation = await Formation.findById(req.params.id);
        if (!formation) {
            return res.status(404).render('error', { message: 'Formation non trouvée' });
        }
        res.render('formations/detail', { formation });
    } catch (error) {
        res.status(500).render('error', { message: 'Erreur serveur' });
    }
};
