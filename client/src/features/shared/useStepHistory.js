import { useCallback, useEffect, useRef } from "react";

/**
 * Écrans d'un outil (F1, F2) dans l'historique du navigateur : le bouton retour du téléphone
 * revient à l'écran précédent au lieu de quitter la page. Même adresse, une entrée par écran.
 *
 * - `steps` : écrans concernés, dans l'ordre (le premier ouvre l'historique de l'outil)
 * - `goBack()` : écran précédent (comme le bouton du téléphone)
 * - `goBackTo(step)` : revient à un écran déjà vu (ex. « Modifier mes chiffres »)
 */
export const useStepHistory = (step, setStep, steps) => {
	const entries = useRef([]); // écrans empilés dans l'historique, dans l'ordre
	const position = useRef(-1); // position actuelle dans `entries`
	const fromPop = useRef(false);
	const currentStep = useRef(step);
	currentStep.current = step;

	useEffect(() => {
		if (!steps.includes(step)) return;
		if (fromPop.current) {
			fromPop.current = false;
			return;
		}
		// L'état du routeur (clé, index) est conservé dans chaque entrée
		const base = window.history.state || {};
		if (position.current === -1) {
			entries.current = [step];
			position.current = 0;
			window.history.replaceState({ ...base, toolStep: step, toolPos: 0 }, "");
			return;
		}
		if (entries.current[position.current] === step) return;
		entries.current = [...entries.current.slice(0, position.current + 1), step];
		position.current += 1;
		window.history.pushState({ ...base, toolStep: step, toolPos: position.current }, "");
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [step]);

	useEffect(() => {
		const onPop = (event) => {
			const state = event.state;
			if (!state || !steps.includes(state.toolStep)) return;
			position.current = state.toolPos;
			if (state.toolStep !== currentStep.current) {
				fromPop.current = true;
				setStep(state.toolStep);
			}
		};
		window.addEventListener("popstate", onPop);
		return () => window.removeEventListener("popstate", onPop);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const goBack = useCallback(() => {
		if (position.current > 0) window.history.back();
	}, []);

	const goBackTo = useCallback(
		(target) => {
			const index = entries.current.lastIndexOf(target, position.current);
			if (index >= 0 && index < position.current) window.history.go(index - position.current);
			else setStep(target);
		},
		[setStep],
	);

	return { goBack, goBackTo };
};

/**
 * Quitte l'outil depuis le premier écran : ferme l'onglet ouvert depuis le site,
 * sinon (fermeture refusée par le navigateur) ouvre la page de repli.
 */
export const leaveTool = (navigate, fallbackPath) => {
	window.close();
	setTimeout(() => {
		if (!window.closed) navigate(fallbackPath);
	}, 300);
};
