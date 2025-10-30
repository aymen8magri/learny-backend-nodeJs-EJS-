const Stagiaire = require('../../models/stagiaire');
const Formation = require('../../models/formation');

// =====================
// CRUD classiques
// =====================

// Obtenir un stagiaire par ID (responsable ou lui-même)
exports.getStagiaireById = async (req, res) => {
    try {
        const stagiaire = await Stagiaire.findById(req.params.id);
        if (!stagiaire) return res.status(404).json({ message: 'Stagiaire introuvable' });

        // Vérification si ce n'est pas un responsable
        if (req.user.role !== 'responsable' && req.user.id !== stagiaire._id.toString()) {
            return res.status(403).json({ message: 'Accès refusé' });
        }

        res.status(200).json(stagiaire);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
};

// Créer un stagiaire (inscription)
exports.createStagiaire = async (req, res) => {
    try {
        const newStagiaire = new Stagiaire(req.body);
        const savedStagiaire = await newStagiaire.save();
        res.status(201).json(savedStagiaire);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
};

// Mettre à jour un stagiaire (responsable ou lui-même)
exports.updateStagiaire = async (req, res) => {
    try {
        if (req.user.role !== 'responsable' && req.user.id !== req.params.id) {
            return res.status(403).json({ message: 'Accès refusé' });
        }

        const updatedStagiaire = await Stagiaire.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedStagiaire) return res.status(404).json({ message: 'Stagiaire introuvable' });

        res.status(200).json(updatedStagiaire);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
};


// =====================
// Routes métier Learny
// =====================

// Postuler à une formation
exports.postulerFormation = async (req, res) => {
    try {
        const stagiaireId = req.user.id;
        const formationId = req.params.formationId;

        const formation = await Formation.findById(formationId);
        if (!formation) return res.status(404).json({ message: 'Formation introuvable' });

        // Vérifier si le stagiaire a déjà postulé
        if (formation.stagiairesPostules.includes(stagiaireId)) {
            return res.status(400).json({ message: 'Vous avez déjà postulé à cette formation' });
        }

        formation.stagiairesPostules.push(stagiaireId);
        await formation.save();

        res.status(200).json({ message: 'Candidature envoyée avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
};

// Voir les candidatures du stagiaire connecté
exports.getCandidatures = async (req, res) => {
    try {
        const stagiaireId = req.user.id;

        const formations = await Formation.find({ stagiairesPostules: stagiaireId });
        res.status(200).json(formations);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
};
