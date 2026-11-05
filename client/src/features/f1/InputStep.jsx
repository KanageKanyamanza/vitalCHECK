import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, FormField } from "../../components/ui/ds";
import { formatNumber, needsRevenue } from "./lossCalculator";
import { pick } from "./display";

const MAX_BY_TYPE = { percent: 100, days: 31, months: 120, hours: 744 };

const parseDigits = (text) => {
	const digits = text.replace(/\D/g, "").slice(0, 13);
	return digits === "" ? null : Number(digits);
};

/** Champ numérique : clavier numérique, séparateur de milliers, case « Je ne sais pas ». */
const NumberField = ({ id, label, unit, value, unknown, onValue, onUnknown, error }) => {
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
				<span className="shrink-0 font-text text-sm font-semibold text-ubb-ink-muted">{unit}</span>
			</div>
			<label className="mt-1 inline-flex min-h-[44px] cursor-pointer items-center gap-3 font-text text-ubb-small text-ubb-ink">
				<input
					type="checkbox"
					checked={unknown}
					onChange={(e) => onUnknown(e.target.checked)}
					className="ubb-focus h-5 w-5 shrink-0 accent-[rgb(var(--ubb-brand-900))]"
				/>
				{t("f1.input.dontKnow")}
			</label>
		</FormField>
	);
};

/** Écran 2 : au plus 2 champs par catégorie, CA mensuel demandé seulement s'il sert. */
const InputStep = ({ config, categoryIds, inputs, onChange, onBack, onSubmit, lang }) => {
	const { t } = useTranslation();
	const [errors, setErrors] = useState({});
	const askRevenue = needsRevenue(categoryIds, inputs, config);

	const setValue = (fieldId, value) => onChange({ ...inputs, values: { ...inputs.values, [fieldId]: value } });
	const setUnknown = (fieldId, unknown) => onChange({ ...inputs, unknown: { ...inputs.unknown, [fieldId]: unknown } });

	const validateField = (value, unknown, type) => {
		if (unknown) return null;
		if (value == null) return t("f1.input.required");
		const max = MAX_BY_TYPE[type];
		if (max != null && value > max) return t("f1.input.tooHigh", { max });
		return null;
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const next = {};
		for (const id of categoryIds) {
			for (const field of config.categories[id].fields) {
				if (field.shared) continue;
				const error = validateField(inputs.values[field.id], inputs.unknown[field.id], field.type);
				if (error) next[field.id] = error;
			}
		}
		if (askRevenue) {
			const error = validateField(inputs.revenue.value, inputs.revenue.unknown, "money");
			if (error) next.revenue = error;
		}
		setErrors(next);
		const firstError = Object.keys(next)[0];
		if (firstError) {
			document.getElementById(`f1-field-${firstError}`)?.focus();
			return;
		}
		onSubmit();
	};

	return (
		<form onSubmit={handleSubmit} noValidate>
			<p className="font-text text-ubb-body text-ubb-ink-muted">{t("f1.input.intro")}</p>

			<div className="mt-5 space-y-5">
				{categoryIds.map((id) => {
					const category = config.categories[id];
					const ownFields = category.fields.filter((f) => !f.shared);
					return (
						<fieldset key={id} className="rounded-ubb-field border border-ubb-brand-900/10 bg-white p-4">
							<legend className="float-left mb-3 w-full font-heading text-base font-semibold text-ubb-ink">{pick(category.title, lang)}</legend>
							<div className="clear-left space-y-4">
								{ownFields.map((field) => (
									<NumberField
										key={field.id}
										id={`f1-field-${field.id}`}
										label={pick(field.label, lang)}
										unit={t(`f1.input.units.${field.type}`)}
										value={inputs.values[field.id]}
										unknown={!!inputs.unknown[field.id]}
										onValue={(v) => setValue(field.id, v)}
										onUnknown={(u) => setUnknown(field.id, u)}
										error={errors[field.id]}
									/>
								))}
							</div>
						</fieldset>
					);
				})}

				{askRevenue && (
					<fieldset className="rounded-ubb-field border border-ubb-accent-100 bg-ubb-accent-50 p-4">
						<legend className="float-left mb-1 w-full font-heading text-base font-semibold text-ubb-ink">{t("f1.input.revenueTitle")}</legend>
						<p className="clear-left mb-3 font-text text-ubb-small text-ubb-ink-muted">{t("f1.input.revenueHint")}</p>
						<NumberField
							id="f1-field-revenue"
							label={t("f1.input.revenueLabel")}
							unit="FCFA"
							value={inputs.revenue.value}
							unknown={inputs.revenue.unknown}
							onValue={(v) => onChange({ ...inputs, revenue: { ...inputs.revenue, value: v } })}
							onUnknown={(u) => onChange({ ...inputs, revenue: { ...inputs.revenue, unknown: u } })}
							error={errors.revenue}
						/>
					</fieldset>
				)}
			</div>

			<div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
				<Button variant="outline" onClick={onBack}>
					{t("f1.input.back")}
				</Button>
				<Button type="submit">{t("f1.input.submit")}</Button>
			</div>
		</form>
	);
};

export default InputStep;
