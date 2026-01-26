import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { HelmetProvider } from "react-helmet-async";
import { PerformanceAnalytics } from "./components/seo";
import { SplashScreen, Layout } from "./components/layout";
import { AppRoutes } from "./routes";
import { AssessmentProvider } from "./context/AssessmentContext";
import { ClientAuthProvider } from "./context/ClientAuthContext";
import { toastColors } from "./utils/colors";
import { usePWAUpdate } from "./hooks/usePWAUpdate";
import { usePushNotifications } from "./hooks/usePushNotifications";
import { useClientAuth } from "./context/ClientAuthContext";

function AppContent() {
	// Vérifier si l'utilisateur a déjà vu la splash screen
	const [showSplash, setShowSplash] = useState(() => {
		const hasSeenSplash = localStorage.getItem("hasSeenSplash");
		return !hasSeenSplash; // Afficher la splash screen seulement si l'utilisateur ne l'a jamais vue
	});

	usePWAUpdate();
	const { user } = useClientAuth();
	const { setAppBadge } = usePushNotifications(user?._id);
	const location = useLocation();

	// Scroll to top on route change
	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}, [location.pathname]);

	const handleSplashComplete = () => {
		setShowSplash(false);
		// Mémoriser que l'utilisateur a vu la splash screen
		localStorage.setItem("hasSeenSplash", "true");
	};

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Analytics et Performance Monitoring */}
			<PerformanceAnalytics />

			{showSplash && <SplashScreen onLoadingComplete={handleSplashComplete} />}

			{!showSplash && (
				<Layout>
					<AppRoutes />
				</Layout>
			)}

			<Toaster
				position="top-right"
				toastOptions={{
					duration: 4000,
					style: {
						background: toastColors.background,
						color: toastColors.text,
					},
				}}
			/>
		</div>
	);
}

function App() {
	return (
		<HelmetProvider>
			<ClientAuthProvider>
				<AssessmentProvider>
					<Router
						future={{
							v7_startTransition: true,
							v7_relativeSplatPath: true,
						}}
					>
						<AppContent />
					</Router>
				</AssessmentProvider>
			</ClientAuthProvider>
		</HelmetProvider>
	);
}

export default App;
