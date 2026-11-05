// Drapeaux de fonctionnalités, lus au build (variables Vite). Absents = désactivés.

/** F1 Calculateur de pertes cachées */
export const isF1HiddenLossesEnabled = import.meta.env.VITE_F1_HIDDEN_LOSSES === "true";

/** Bandeau « Valeurs provisoires » : en développement, ou sur un build de préproduction qui le demande */
export const showDraftBanner = !import.meta.env.PROD || import.meta.env.VITE_SHOW_DRAFT_BANNER === "true";
