import React from "react";
import { useTranslation } from "react-i18next";
import { FormField } from "../../components/ui/ds";
import { formatNumber, parseDigits } from "./format";

/**
 * Champ numérique commun aux outils F1 et F2 : clavier numérique, séparateur de milliers,
 * police de 16 px (pas de zoom automatique sur iPhone), case « Je ne sais pas » facultative.
 */
const NumberField = ({ id, label, unit, value, unknown = false, onValue, onUnknown, error }) => {
	const { t } = useTranslation();
	return (
		<FormField id={id} label={label} error={error}>
			<div className="flex items-center gap-2">
				<input
					id={id}
					type="text"
					inputMode="numeric"
					autoComplete="off"
					value={value == null ? "" : formatNumber(value)}
					onChange={(e) => onValue(parseDigits(e.target.value))}
					disabled={unknown}
					aria-invalid={error ? "true" : undefined}
					aria-describedby={error ? `${id}-error` : undefined}
					className="ubb-input min-w-0 flex-1 disabled:bg-ubb-paper-soft disabled:text-ubb-ink-muted"
				/>
				{unit && <span className="shrink-0 font-text text-sm font-semibold text-ubb-ink-muted">{unit}</span>}
			</div>
			{onUnknown && (
				<label className="mt-1 inline-flex min-h-[44px] cursor-pointer items-center gap-3 font-text text-ubb-small text-ubb-ink">
					<input
						type="checkbox"
						checked={unknown}
						onChange={(e) => onUnknown(e.target.checked)}
						className="ubb-focus h-5 w-5 shrink-0 accent-[rgb(var(--ubb-brand-900))]"
					/>
					{t("tools.dontKnow")}
				</label>
			)}
		</FormField>
	);
};

export default NumberField;
