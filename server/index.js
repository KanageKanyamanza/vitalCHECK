const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { initAdmin } = require("./scripts/init-admin");
require("dotenv").config();

const app = express();

// Security middleware
app.use(helmet());
app.use(
	cors({
		origin: function (origin, callback) {
			// Autoriser les requêtes sans origine (ex: mobile apps, Postman)
			if (!origin) return callback(null, true);
			
			const allowedOrigins = [
				"http://localhost:5173",
				"https://ubb-enterprise-health-check.vercel.app",
				"https://ubb-enterprise-health-check-git-feedback-roll-haurlys-projects.vercel.app",
				"https://ubb-enterprise-health-check-43lryld5y-roll-haurlys-projects.vercel.app",
			];
			
			// Vérifier si l'origine est autorisée ou si c'est une URL Vercel
			if (allowedOrigins.includes(origin) || origin.includes('vercel.app')) {
				return callback(null, true);
			}
			
			callback(new Error('Non autorisé par CORS'));
		},
		credentials: true,
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
		allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
	})
);

// Rate limiting - Plus permissif pour les formulaires
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 500, // limit each IP to 500 requests per windowMs (plus permissif)
	message: {
		success: false,
		message: "Trop de requêtes, veuillez réessayer dans quelques minutes"
	},
	standardHeaders: true,
	legacyHeaders: false,
});

// Rate limiting plus strict pour les routes d'authentification
const authLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 20, // limit each IP to 20 auth requests per windowMs
	message: {
		success: false,
		message: "Trop de tentatives de connexion, veuillez réessayer dans 15 minutes"
	},
	standardHeaders: true,
	legacyHeaders: false,
});

app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authLimiter, require("./routes/auth"));
app.use("/api/assessments", require("./routes/assessments"));
app.use("/api/reports", require("./routes/reports"));
app.use("/api/admin", authLimiter, require("./routes/admin"));
app.use("/api", require("./routes/ping"));

// Health check endpoint
app.get("/api/health", (req, res) => {
	res.json({ status: "OK", message: "UBB Health Check API is running" });
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

// Database connection
mongoose
	.connect(
		process.env.MONGODB_URI || "mongodb://localhost:27017/ubb-health-check"
	)
	.then(async () => {
		console.log("Connected to MongoDB");
		
		// Initialiser l'admin au démarrage
		await initAdmin();
		
		const PORT = process.env.PORT || 5000;
		app.listen(PORT, () => {
			console.log(`Server running on port ${PORT}`);
		});
	})
	.catch((error) => {
		console.error("MongoDB connection error:", error);
		process.exit(1);
	});

module.exports = app;
