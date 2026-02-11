const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
// Rate limiting désactivé - express-rate-limit retiré
const { initAdmin } = require("./scripts/init-admin");
const { startNewsletterScheduler } = require("./utils/newsletterScheduler");
require("dotenv").config();

const app = express();

// Configuration du trust proxy pour les headers X-Forwarded-For
app.set("trust proxy", 1);

// Security middleware
app.use(
	helmet({
		frameguard: { action: "deny" }, // X-Frame-Options: DENY
		contentSecurityPolicy: {
			directives: {
				defaultSrc: ["'self'"],
				styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
				fontSrc: ["'self'", "https://fonts.gstatic.com"],
				imgSrc: ["'self'", "data:", "https:"],
				scriptSrc: ["'self'"],
				connectSrc: ["'self'"],
			},
		},
	})
);
app.use(
	cors({
		origin: function (origin, callback) {
			// Autoriser les requêtes sans origine (ex: mobile apps, Postman)
			if (!origin) return callback(null, true);

			// Normaliser l'origine en supprimant le slash final
			const normalizedOrigin = origin.replace(/\/$/, "");

			const allowedOrigins = [
				"http://localhost:5173",
				"http://localhost:5174",
				"https://ubb-enterprise-health-check.vercel.app",
				"https://www.checkmyenterprise.com",
				"https://checkmyenterprise.com",
			];

			// En production, être plus permissif pour éviter les problèmes CORS
			if (process.env.NODE_ENV === "production") {
				// Autoriser tous les sous-domaines de checkmyenterprise.com
				if (normalizedOrigin.includes("checkmyenterprise.com")) {
					return callback(null, true);
				}
			}

			// Vérifier si l'origine normalisée est autorisée
			if (allowedOrigins.includes(normalizedOrigin)) {
				return callback(null, true);
			}

			console.log("🚫 [CORS] Origine non autorisée:", origin);
			callback(new Error("Non autorisé par CORS"));
		},
		credentials: true,
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
		// Ajouter des headers supplémentaires pour éviter les problèmes
		optionsSuccessStatus: 200, // Pour les navigateurs legacy
		preflightContinue: false,
	})
);

// Rate limiting désactivé pour permettre un trafic illimité en production
// Les limitations ont été retirées pour éviter de bloquer les clients

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Cookie parsing middleware
app.use(cookieParser());

// Routes - Aucune limitation de rate-limiting appliquée
app.use("/api/auth", require("./routes/auth"));
app.use("/api/client-auth", require("./routes/clientAuth").router); // Routes auth client
app.use("/api/unified-auth", require("./routes/unifiedAuth")); // Connexion unifiée
app.use("/api/assessments", require("./routes/assessments"));
app.use("/api/reports", require("./routes/reports"));
app.use("/api/contact", require("./routes/contact"));
app.use("/api/payments", require("./routes/payments")); // Route publique: /api/payments/record
app.use("/api/admin", require("./routes/payments")); // Routes admin: /api/admin/payments
app.use("/api/admin", require("./routes/admin"));
app.use("/api/blogs", require("./routes/blogs"));
app.use("/api/blog-visitors/admin", require("./routes/blogVisitorsAdmin"));
app.use("/api/blog-visitors", require("./routes/blogVisitors"));
app.use("/api/upload", require("./routes/upload"));
app.use("/api/chat", require("./routes/chatbot"));
app.use("/api/notifications", require("./routes/notifications"));
app.use("/api/newsletters", require("./routes/newsletters"));
app.use("/api", require("./routes/ping"));

// Routes SEO
app.use("/", require("./routes/sitemap"));

// Health check endpoint
app.get("/api/health", (req, res) => {
	res.json({ status: "OK", message: "vitalCHECK Health Check API is running" });
});

// Test endpoint pour vérifier les routes
app.get("/api/test", (req, res) => {
	res.json({
		status: "OK",
		message: "Test endpoint accessible",
		timestamp: new Date().toISOString(),
		routes: {
			translate: "/api/blogs/translate",
			translateTest: "/api/blogs/translate/test",
		},
	});
});

// Error handling middleware
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({
		message: "Something went wrong!",
		error: process.env.NODE_ENV === "development" ? err.message : {},
	});
});

// 404 handler
app.use("*", (req, res) => {
	res.status(404).json({ message: "Route not found" });
});

// Database connection with improved error handling
const connectDB = async () => {
	const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/vitalCHECK-health-check";

	// Options de connexion améliorées
	const mongooseOptions = {
		serverSelectionTimeoutMS: 5000, // Timeout après 5 secondes
		socketTimeoutMS: 45000,
		bufferCommands: false, // Désactiver le buffering mongoose
	};

	try {
		await mongoose.connect(mongoURI, mongooseOptions);
		console.log("✅ Connected to MongoDB");

		// Initialiser l'admin au démarrage
		try {
			await initAdmin();
		} catch (err) {
			console.warn("⚠️  Erreur lors de l'initialisation admin:", err.message);
		}

		const PORT = process.env.PORT || 5000;
		app.listen(PORT, () => {
			console.log(`🚀 Server running on port ${PORT}`);
		});

		// Scheduler interne (optionnel) pour newsletters programmées
		const schedulerEnabled = String(process.env.ENABLE_NEWSLETTER_SCHEDULER || '').toLowerCase() === 'true';
		const intervalMs = Number(process.env.NEWSLETTER_SCHEDULER_INTERVAL_MS || 60_000);
		startNewsletterScheduler({ enabled: schedulerEnabled, intervalMs, logger: console });
	} catch (error) {
		console.error("❌ MongoDB connection error:", error.message);

		// En production, MongoDB est obligatoire
		if (process.env.NODE_ENV === 'production') {
			console.error("❌ Production mode: MongoDB est requis. Arrêt du serveur.");
			process.exit(1);
		}

		// En développement, démarrer quand même avec avertissements
		console.warn("⚠️  Mode développement: Le serveur démarre sans MongoDB.");
		console.warn("💡 Solutions:");
		console.warn("   1. Démarrer MongoDB local: net start MongoDB (Windows) ou mongod");
		console.warn("   2. Utiliser MongoDB Atlas: Configurez MONGODB_URI dans .env");
		console.warn("   3. Continuer sans MongoDB: Certaines fonctionnalités ne seront pas disponibles");

		const PORT = process.env.PORT || 5000;
		app.listen(PORT, () => {
			console.log(`🚀 Server running on port ${PORT} (sans MongoDB)`);
		});
	}
};

// Gestion des événements de connexion
mongoose.connection.on('error', (err) => {
	if (process.env.NODE_ENV === 'production') {
		console.error('❌ MongoDB connection error:', err);
	} else {
		console.warn('⚠️  MongoDB connection error:', err.message);
	}
});

mongoose.connection.on('disconnected', () => {
	if (process.env.NODE_ENV === 'production') {
		console.error('❌ MongoDB disconnected');
	} else {
		console.warn('⚠️  MongoDB disconnected');
	}
});

// Démarrer la connexion
connectDB();

module.exports = app;