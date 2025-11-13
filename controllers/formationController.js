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

        res.render('pages/formations/add', { entrepriseId, entrepriseName, isEdit: false, formation: null });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Erreur lors du chargement du profil' });
    }
};

// Créer une formation
exports.createFormation = async (req, res) => {
    try {
        const { title, description, dateDebut, dateFin, nbPlaces, duration, price, planning } = req.body;

        const entrepriseId = req.user.id;

        // Si une image est uploadée
        const imagePath = req.file ? '/uploads/' + req.file.filename : null;

        const newFormation = new Formation({
            title,
            description,
            dateDebut,
            dateFin,
            nbPlaces,
            duration,
            price,
            planning,
            entreprise: entrepriseId,
            image: imagePath,
            status: 'En attente',
        });

        await newFormation.save();

        res.redirect('/formations/add');
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

// Afficher le formulaire pré-rempli
exports.getEditForm = async (req, res) => {
    try {
        const formation = await Formation.findById(req.params.id);
        if (!formation) return res.status(404).send("Formation introuvable");
        res.render("pages/formations/add", {
            formation, // on envoie la formation existante
            entrepriseId: formation.entreprise,
            entrepriseName: req.user.name, // ou autre selon ton modèle
            isEdit: true // indicateur qu’on est en mode édition
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur serveur");
    }
};

// Mettre à jour une formation
exports.updateFormation = async (req, res) => {
    try {
        const { title, description, dateDebut, dateFin, nbPlaces, duration, price, planning } = req.body;

        // Si une image est uploadée
        const imagePath = req.file ? '/uploads/' + req.file.filename : undefined;

        // Construction des données à mettre à jour
        const updateData = {
            title,
            description,
            dateDebut,
            dateFin,
            nbPlaces,
            duration,
            price,
            planning,
        };

        // Si une nouvelle image est envoyée → on la met à jour
        if (imagePath) {
            updateData.image = imagePath;
        }

        // Mettre à jour la formation et récupérer la doc mise à jour
        const updatedFormation = await Formation.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true } // ✅ retourne l'objet mis à jour
        );

        // Redirection selon le status
        if (updatedFormation.status === 'Validée') {
            req.flash('success', 'Formation mise à jour avec succès');
            res.redirect('/formations/validees');
        } else {
            req.flash('success', 'Formation mise à jour avec succès');
            res.redirect('/formations/non-validees');
        }
    } catch (error) {
        console.error("Erreur updateFormation:", error);
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
        req.flash('success', 'Formation supprimée avec succès');
        res.redirect('/formations/non-validees');
    } catch (error) {
        req.flash('error', 'Erreur lors de la suppression de la formation');
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
        const formation = await Formation.findById(req.params.id).populate('entreprise');
        if (!formation) {
            return res.status(404).render('error', { message: 'Formation non trouvée' });
        }
        res.render('pages/formations/detail', { formation, entreprise: formation.entreprise });
    } catch (error) {
        res.status(500).render('error', { message: 'Erreur serveur' });
    }
};
