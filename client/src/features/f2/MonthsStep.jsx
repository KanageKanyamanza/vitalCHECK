import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../components/ui/ds";
import { formatNumber, parseDigits } from "../shared/format";

const ROWS = ["sales", "expenses"];

/**
 * Écran 1 sur 2 : ventes et dépenses des 3 derniers mois.
 * 3 colonnes de mois ; le libellé de chaque ligne est au-dessus pour laisser ~100 px par champ à 360 px.
 * « Je ne sais pas » par ligne : la ligne entière n'est pas évaluée.
 */
const MonthsStep = ({ months, figures, unknown, onFigures, onUnknown, onContinue }) => {
	const { t } = useTranslation();
	const [errors, setErrors] = useState({});

	const setCell = (row, index, value) => {
		const next = [...figures[row]];
		next[index] = value;
		onFigures({ ...figures, [row]: next });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const next = {};
		for (const row of ROWS) {
			if (!unknown[row] && figures[row].some((v) => v == null)) next[row] = t("f2.months.rowError");
		}
		setErrors(next);
		const first = ROWS.find((row) => next[row]);
		if (first) {
			document.getElementById(`f2-${first}-${figures[first].findIndex((v) => v == null)}`)?.focus();
			return;
		}
		onContinue();
	};

	return (
		<form onSubmit={handleSubmit} noValidate>
			<p className="font-text text-ubb-body text-ubb-ink-muted">{t("f2.months.intro")}</p>

			{/* En-tête des colonnes : les vrais noms des 3 derniers mois */}
			<div className="mt-5 grid grid-cols-3 gap-2" aria-hidden="true">
				{months.map((month) => (
					<span key={month} className="text-center font-text text-sm font-semibold text-ubb-ink">
						{month}
					</span>
				))}
			</div>

			{ROWS.map((row) => {
				const label = t(`f2.months.${row}`);
				const errorId = `f2-${row}-error`;
				return (
					<fieldset key={row} className="mt-3">
						<legend className="ubb-label">{label}</legend>
						<div className="grid grid-cols-3 gap-2">
							{months.map((month, index) => (
								<input
									key={month}
									id={`f2-${row}-${index}`}
									type="text"
									inputMode="numeric"
									autoComplete="off"
									aria-label={t("f2.months.cellLabel", { row: label, month })}
									aria-invalid={errors[row] && figures[row][index] == null ? "true" : undefined}
									aria-describedby={errors[row] ? errorId : undefined}
									value={figures[row][index] == null ? "" : formatNumber(figures[row][index])}
									onChange={(e) => setCell(row, index, parseDigits(e.target.value))}
									disabled={unknown[row]}
									className="ubb-input min-w-0 px-2 text-center text-base disabled:bg-ubb-paper-soft disabled:text-ubb-ink-muted"
								/>
							))}
						</div>
						{errors[row] && !unknown[row] && (
							<p id={errorId} role="alert" className="mt-1.5 font-text text-sm font-medium text-red-700">
								{errors[row]}
							</p>
						)}
						<label className="mt-1 inline-flex min-h-[44px] cursor-pointer items-center gap-3 font-text text-ubb-small text-ubb-ink">
							<input
								type="checkbox"
								checked={unknown[row]}
								onChange={(e) => onUnknown({ ...unknown, [row]: e.target.checked })}
								className="ubb-focus h-5 w-5 shrink-0 accent-[rgb(var(--ubb-brand-900))]"
							/>
							{t(`f2.months.${row}Unknown`)}
						</label>
					</fieldset>
				);
			})}

			<Button type="submit" className="mt-5 w-full sm:w-auto">
				{t("f2.months.continue")}
			</Button>
		</form>
	);
};

export default MonthsStep;
