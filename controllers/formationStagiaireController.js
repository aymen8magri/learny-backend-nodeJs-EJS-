const { render } = require('ejs');
const FormationStagiaire = require('../models/Formation_Stagiaire');

// =====================
// FRONT OFFICE : Stagiaire
// =====================

// Postuler à une formation
exports.postulerFormation = async (req, res) => {
    try {
        const stagiaireId = req.user.id; // ID du stagiaire depuis le JWT
        const { formationId } = req.body;

        if (!formationId) {
            return res.status(400).json({ message: 'ID de formation requis' });
        }

        // Vérifier si la candidature existe déjà
        const existingApplication = await FormationStagiaire.findOne({
            stagiaire: stagiaireId,
            formation: formationId,
        });

        if (existingApplication) {
            return res.status(400).json({ message: 'Vous avez déjà postulé à cette formation' });
        }

        const newApplication = new FormationStagiaire({
            stagiaire: stagiaireId,
            formation: formationId,
            etatInscription: 'En attente',
        });

        await newApplication.save();
        res.status(201).json({ message: 'Candidature envoyée avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Récupérer les formations postulées par le stagiaire
exports.getFormationsByStagiaire = async (req, res) => {
    try {
        const stagiaireId = req.user.id; // ID du stagiaire depuis le JWT
        const applications = await FormationStagiaire.find({ stagiaire: stagiaireId })
            .populate({
                path: 'formation',
                populate: { path: 'entreprise' } // <-- ici on peuple l'entreprise
            })
            .exec();
        console.log(applications);
        res.status(200).json(applications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// =====================
// Back Office : ENTREPRISE
// =====================

// Récupérer les stagiaires inscrits à une formation d'une entreprise
exports.getStagiairesByFormation = async (req, res) => {
  try {
    const { formationId } = req.params;

    const stagiaires = await FormationStagiaire.find({ formation: formationId })
      .populate("stagiaire")   // données du stagiaire
      .populate("formation")   // utile pour afficher le titre dans la page EJS
      .exec();

    if (!stagiaires) {
      return res.status(404).render("error", { message: "Aucun stagiaire trouvé." });
    }
    console.log(stagiaires);
    console.log(stagiaires[0]?.formation);

    res.render("pages/entreprise/stagiaires-by-formation", {
      stagiaires,
      formation: stagiaires[0]?.formation || null
    });

  } catch (error) {
    console.error(error);
    res.status(500).render("error", { message: "Erreur serveur" });
  }
};
