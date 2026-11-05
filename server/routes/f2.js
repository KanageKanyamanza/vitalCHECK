const express = require("express");
const config = require("../config/f2-alerts");

const router = express.Router();

// GET /api/f2/config — seuils, gravités et textes de l'auto-contrôle d'alerte.
// Configuration publique : aucun chiffre de l'utilisateur n'est reçu par le serveur.
router.get("/config", (req, res) => {
	res.set("Cache-Control", "public, max-age=300");
	res.json({ success: true, config });
});

module.exports = router;
