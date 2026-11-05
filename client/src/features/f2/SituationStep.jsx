import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../components/ui/ds";
import NumberField from "../shared/NumberField";

// Les 5 chiffres de la situation actuelle ; « Je ne sais pas » rend la règle liée non vérifiée
export const SITUATION_FIELDS = [
	{ id: "overdueReceivables", type: "money" },
	{ id: "cash", type: "money" },
	{ id: "fixedCosts", type: "money" },
	{ id: "stockouts", type: "count", max: 1000 },
	{ id: "topClientShare", type: "percent", max: 100 },
];

/** Écran 2 sur 2 : la situation aujourd'hui. */
const SituationStep = ({ lastMonth, figures, unknown, onFigures, onUnknown, onBack, onSubmit }) => {
	const { t } = useTranslation();
	const [errors, setErrors] = useState({});

	const handleSubmit = (e) => {
		e.preventDefault();
		const next = {};
		for (const field of SITUATION_FIELDS) {
			if (unknown[field.id]) continue;
			const value = figures[field.id];
			if (value == null) next[field.id] = t("f2.situation.required");
			else if (field.max != null && value > field.max) next[field.id] = t("f2.situation.tooHigh", { max: field.max });
		}
		setErrors(next);
		const first = SITUATION_FIELDS.find((f) => next[f.id]);
		if (first) {
			document.getElementById(`f2-field-${first.id}`)?.focus();
			return;
		}
		onSubmit();
	};

	return (
		<form onSubmit={handleSubmit} noValidate>
			<p className="font-text text-ubb-body text-ubb-ink-muted">{t("f2.situation.intro")}</p>
			<div className="mt-5 space-y-4">
				{SITUATION_FIELDS.map((field) => (
					<NumberField
						key={field.id}
						id={`f2-field-${field.id}`}
						label={t(`f2.situation.${field.id}`, { month: lastMonth })}
						unit={t(`f2.situation.units.${field.type}`)}
						value={figures[field.id]}
						unknown={!!unknown[field.id]}
						onValue={(v) => onFigures({ ...figures, [field.id]: v })}
						onUnknown={(u) => onUnknown({ ...unknown, [field.id]: u })}
						error={errors[field.id]}
					/>
				))}
			</div>
			<div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
				<Button variant="outline" onClick={onBack}>
					{t("f2.situation.back")}
				</Button>
				<Button type="submit">{t("f2.situation.submit")}</Button>
			</div>
		</form>
	);
};

export default SituationStep;
