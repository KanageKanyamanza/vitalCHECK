import { useState, useEffect, useCallback } from "react";
import { API_BASE_URL } from "../services/api";

const useLoading = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [loadingProgress, setLoadingProgress] = useState(0);
	const [backendReady, setBackendReady] = useState(false);
	const [loadingSteps, setLoadingSteps] = useState([]);

	// Fonction pour ping le backend
	const pingBackend = useCallback(async () => {
		try {
			const response = await fetch(`${API_BASE_URL}/ping`);
			const data = await response.json();

			if (data.success) {
				setBackendReady(true);
				return true;
			}
			return false;
		} catch (error) {
			console.log("Backend ping failed:", error.message);
			return false;
		}
	}, []);

	// Fonction pour simuler le chargement progressif
	const simulateLoading = useCallback(async () => {
		const steps = [
			{ name: "Initialisation...", progress: 10 },
			{ name: "Connexion au serveur...", progress: 25 },
			{ name: "Chargement des questions...", progress: 40 },
			{ name: "Préparation de l'interface...", progress: 60 },
			{ name: "Vérification des services...", progress: 80 },
			{ name: "Finalisation...", progress: 100 },
		];

		for (let i = 0; i < steps.length; i++) {
			const step = steps[i];

			// Mettre à jour l'étape actuelle
			setLoadingSteps((prev) => [...prev, step]);
			setLoadingProgress(step.progress);

			// Ping le backend à certaines étapes
			if (step.progress === 25 || step.progress === 60) {
				await pingBackend();
			}

			// Délai variable selon l'étape
			const delay = step.progress === 25 ? 2000 : 800;
			await new Promise((resolve) => setTimeout(resolve, delay));
		}

		// Attendre que le backend soit prêt
		let attempts = 0;
		const maxAttempts = 15;

		while (!backendReady && attempts < maxAttempts) {
			const isReady = await pingBackend();
			if (isReady) break;

			await new Promise((resolve) => setTimeout(resolve, 1000));
			attempts++;
		}

		// Finaliser le chargement
		setTimeout(() => {
			setIsLoading(false);
		}, 1000);
	}, [backendReady, pingBackend]);

	// Démarrer le chargement au montage
	useEffect(() => {
		simulateLoading();
	}, [simulateLoading]);

	// Fonction pour forcer l'arrêt du chargement
	const stopLoading = useCallback(() => {
		setIsLoading(false);
	}, []);

	// Fonction pour redémarrer le chargement
	const restartLoading = useCallback(() => {
		setIsLoading(true);
		setLoadingProgress(0);
		setBackendReady(false);
		setLoadingSteps([]);
		simulateLoading();
	}, [simulateLoading]);

	return {
		isLoading,
		loadingProgress,
		backendReady,
		loadingSteps,
		stopLoading,
		restartLoading,
		pingBackend,
	};
};

export default useLoading;
