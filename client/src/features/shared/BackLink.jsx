import React from "react";
import { ArrowLeft } from "lucide-react";

/** Lien « ← Retour » en haut de chaque écran des outils F1 et F2 (cible tactile de 44 px). */
const BackLink = ({ label, onClick }) => (
	<button
		type="button"
		onClick={onClick}
		className="ubb-focus -ml-1 inline-flex min-h-[44px] items-center gap-1.5 rounded px-1 font-text text-sm font-semibold text-ubb-brand-900 hover:underline"
	>
		<ArrowLeft className="h-4 w-4" aria-hidden="true" />
		{label}
	</button>
);

export default BackLink;
