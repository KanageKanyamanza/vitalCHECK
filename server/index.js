const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
// Rate limiting désactivé - express-rate-limit retiré
const { initAdmin } = require("./scripts/init-admin");
require("dotenv").config();

const app = express();

// Configuration du trust proxy pour les headers X-Forwarded-For
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());
app.use(
	cors({
		origin: function (origin, callback) {
			// Autoriser les requêtes sans origine (ex: mobile apps, Postman)
			if (!origin) return callback(null, true);
			
			const allowedOrigins = [
				"http://localhost:5173",
				"http://localhost:5174",
				"https://www.checkmyenterprise.com",
			];
			
			// Vérifier si l'origine est autorisée
			if (allowedOrigins.includes(origin)) {
				return callback(null, true);
			}
			
			callback(new Error('Non autorisé par CORS'));
		},
		credentials: true,
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
		allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
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
app.use("/api/assessments", require("./routes/assessments"));
app.use("/api/reports", require("./routes/reports"));
app.use("/api/contact", require("./routes/contact"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/blogs", require("./routes/blogs"));
app.use("/api/upload", require("./routes/upload"));
app.use("/api", require("./routes/ping"));

// Health check endpoint
app.get("/api/health", (req, res) => {
	res.json({ status: "OK", message: "VitalCheck Health Check API is running" });
});

// Test endpoint pour vérifier les routes
app.get("/api/test", (req, res) => {
	res.json({ 
		status: "OK", 
		message: "Test endpoint accessible",
		timestamp: new Date().toISOString(),
		routes: {
			translate: "/api/blogs/translate",
			translateTest: "/api/blogs/translate/test"
		}
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

// Database connection
mongoose
	.connect(
		process.env.MONGODB_URI || "mongodb://localhost:27017/VitalCheck-health-check"
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
