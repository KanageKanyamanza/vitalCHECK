const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const Payment = require("../models/Payment");
const {
	sendWelcomeEmail,
	sendPasswordResetEmail,
} = require("../utils/emailService");
const { notifyAdmins } = require("../utils/pushService");

// Middleware pour authentifier le client
const authenticateClient = async (req, res, next) => {
	try {
		const token = req.headers.authorization?.split(" ")[1];

		if (!token) {
			return res.status(401).json({ message: "Token manquant" });
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user = await User.findById(decoded.userId).select("-password");

		if (!user) {
			return res.status(404).json({ message: "Utilisateur non trouvé" });
		}

		req.user = user;
		next();
	} catch (error) {
		return res.status(401).json({ message: "Token invalide" });
	}
};

// Register - Créer un compte client
router.post("/register", async (req, res) => {
	try {
		const {
			email,
			password,
			firstName,
			lastName,
			companyName,
			sector,
			companySize,
			phone,
		} = req.body;

		// Vérifier si l'utilisateur existe déjà
		let user = await User.findOne({ email: email.toLowerCase() });

		if (user && user.hasAccount) {
			return res.status(400).json({
				message: "Un compte existe déjà avec cet email",
			});
		}

		if (user) {
			// L'utilisateur existe déjà (depuis une évaluation gratuite), on ajoute juste le mot de passe
			user.password = password;
			user.firstName = firstName;
			user.lastName = lastName;
			user.phone = phone;
			user.hasAccount = true;
			await user.save();
		} else {
			// Créer un nouvel utilisateur
			user = new User({
				email: email.toLowerCase(),
				password,
				firstName,
				lastName,
				companyName,
				sector,
				companySize,
				phone,
				hasAccount: true,
			});
			await user.save();
		}

		// Générer le token
		const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
			expiresIn: "7d",
		});

		// Envoyer email de bienvenue
		try {
			await sendWelcomeEmail(user.email, firstName || companyName);
		} catch (emailError) {
			console.error("Error sending welcome email:", emailError);
			// Continue even if email fails
		}

		// Notifier les admins de la création de compte
		try {
			await notifyAdmins({
				title: "Nouveau compte client",
				body: `${user.companyName} (${user.email}) a créé un compte.`,
				data: { url: "/admin/users" },
			});
		} catch (pushError) {
			console.error("Push notification admin error:", pushError);
		}

		res.status(201).json({
			message: "Compte créé avec succès",
			token,
			user: {
				id: user._id,
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName,
				companyName: user.companyName,
				subscription: user.subscription,
			},
		});
	} catch (error) {
		console.error("Register error:", error);
		res.status(500).json({
			message: "Erreur lors de la création du compte",
			error: error.message,
		});
	}
});

// Login - Connexion client
router.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body;

		// Trouver l'utilisateur avec le mot de passe
		const user = await User.findOne({ email: email.toLowerCase() }).select(
			"+password"
		);

		if (!user || !user.hasAccount) {
			return res.status(401).json({
				message: "Email ou mot de passe incorrect",
			});
		}

		// Vérifier le mot de passe
		const isMatch = await user.comparePassword(password);

		if (!isMatch) {
			return res.status(401).json({
				message: "Email ou mot de passe incorrect",
			});
		}

		// Mettre à jour la date de dernière connexion
		user.lastLogin = new Date();
		await user.save();

		// Générer le token
		const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
			expiresIn: "7d",
		});

		res.json({
			message: "Connexion réussie",
			token,
			user: {
				id: user._id,
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName,
				companyName: user.companyName,
				subscription: user.subscription,
				isPremium: user.isPremium,
			},
		});
	} catch (error) {
		console.error("Login error:", error);
		res.status(500).json({
			message: "Erreur lors de la connexion",
			error: error.message,
		});
	}
});

// Get current user profile
router.get("/me", authenticateClient, async (req, res) => {
	try {
		const user = await User.findById(req.user._id)
			.populate("assessments")
			.select("-password");

		res.json({
			user: {
				id: user._id,
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName,
				companyName: user.companyName,
				sector: user.sector,
				companySize: user.companySize,
				phone: user.phone,
				subscription: user.subscription,
				isPremium: user.isPremium,
				assessments: user.assessments,
			},
		});
	} catch (error) {
		console.error("Get profile error:", error);
		res.status(500).json({
			message: "Erreur lors de la récupération du profil",
			error: error.message,
		});
	}
});

// Update user profile
router.put("/profile", authenticateClient, async (req, res) => {
	try {
		const { firstName, lastName, companyName, sector, companySize, phone } =
			req.body;

		const user = await User.findById(req.user._id);

		if (firstName) user.firstName = firstName;
		if (lastName) user.lastName = lastName;
		if (companyName) user.companyName = companyName;
		if (sector) user.sector = sector;
		if (companySize) user.companySize = companySize;
		if (phone) user.phone = phone;

		await user.save();

		res.json({
			message: "Profil mis à jour avec succès",
			user: {
				id: user._id,
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName,
				companyName: user.companyName,
				sector: user.sector,
				companySize: user.companySize,
				phone: user.phone,
				subscription: user.subscription,
			},
		});
	} catch (error) {
		console.error("Update profile error:", error);
		res.status(500).json({
			message: "Erreur lors de la mise à jour du profil",
			error: error.message,
		});
	}
});

// Change password
router.put("/change-password", authenticateClient, async (req, res) => {
	try {
		const { currentPassword, newPassword } = req.body;

		const user = await User.findById(req.user._id).select("+password");

		// Vérifier le mot de passe actuel
		const isMatch = await user.comparePassword(currentPassword);
		if (!isMatch) {
			return res.status(401).json({ message: "Mot de passe actuel incorrect" });
		}

		// Mettre à jour le mot de passe
		user.password = newPassword;
		await user.save();

		res.json({ message: "Mot de passe modifié avec succès" });
	} catch (error) {
		console.error("Change password error:", error);
		res.status(500).json({
			message: "Erreur lors du changement de mot de passe",
			error: error.message,
		});
	}
});

// Get user's payments
router.get("/payments", authenticateClient, async (req, res) => {
	try {
		const payments = await Payment.find({ customerEmail: req.user.email })
			.sort({ createdAt: -1 })
			.lean();

		res.json({ payments });
	} catch (error) {
		console.error("Get payments error:", error);
		res.status(500).json({
			message: "Erreur lors de la récupération des paiements",
			error: error.message,
		});
	}
});

// Forgot password - Request password reset
router.post("/forgot-password", async (req, res) => {
	try {
		const { email } = req.body;

		if (!email) {
			return res.status(400).json({
				message: "L'adresse email est requise",
			});
		}

		// Trouver l'utilisateur
		const user = await User.findOne({ 
			email: email.toLowerCase(),
			hasAccount: true 
		});

		// Pour des raisons de sécurité, on ne révèle pas si l'email existe ou non
		if (!user) {
			return res.json({
				message: "Si cet email existe, un lien de réinitialisation a été envoyé.",
			});
		}

		// Générer un token de réinitialisation
		const resetToken = crypto.randomBytes(32).toString("hex");
		const resetTokenHash = crypto
			.createHash("sha256")
			.update(resetToken)
			.digest("hex");

		// Sauvegarder le token hashé et la date d'expiration (1 heure)
		user.resetPasswordToken = resetTokenHash;
		user.resetPasswordExpires = Date.now() + 3600000; // 1 heure
		await user.save();

		// Envoyer l'email de réinitialisation
		try {
			const userName = user.firstName || user.companyName || "Utilisateur";
			await sendPasswordResetEmail(user.email, userName, resetToken);
		} catch (emailError) {
			console.error("Error sending password reset email:", emailError);
			// Ne pas révéler l'erreur à l'utilisateur pour des raisons de sécurité
		}

		res.json({
			message: "Si cet email existe, un lien de réinitialisation a été envoyé.",
		});
	} catch (error) {
		console.error("Forgot password error:", error);
		res.status(500).json({
			message: "Erreur lors de la demande de réinitialisation",
			error: error.message,
		});
	}
});

// Reset password - Reset password with token
router.post("/reset-password/:token", async (req, res) => {
	try {
		const { token } = req.params;
		const { password } = req.body;

		if (!password || password.length < 6) {
			return res.status(400).json({
				message: "Le mot de passe doit contenir au moins 6 caractères",
			});
		}

		// Hasher le token pour le comparer avec celui en base
		const resetTokenHash = crypto
			.createHash("sha256")
			.update(token)
			.digest("hex");

		// Trouver l'utilisateur avec un token valide et non expiré
		const user = await User.findOne({
			resetPasswordToken: resetTokenHash,
			resetPasswordExpires: { $gt: Date.now() },
		}).select("+resetPasswordToken +resetPasswordExpires");

		if (!user) {
			return res.status(400).json({
				message: "Le lien de réinitialisation est invalide ou a expiré",
			});
		}

		// Mettre à jour le mot de passe
		user.password = password;
		user.resetPasswordToken = undefined;
		user.resetPasswordExpires = undefined;
		await user.save();

		res.json({
			message: "Mot de passe réinitialisé avec succès",
		});
	} catch (error) {
		console.error("Reset password error:", error);
		res.status(500).json({
			message: "Erreur lors de la réinitialisation du mot de passe",
			error: error.message,
		});
	}
});

module.exports = { router, authenticateClient };
