import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, ChevronDown, Lock } from "lucide-react";
import { Button } from "../../components/ui/ds";
import { pick } from "./display";

const Badges = ({ id, config }) => {
	const { t } = useTranslation();
	const isFree = config.access === "free";
	return (
		<>
			{isFree && config.unlocked.includes(id) && (
				<span className="rounded-full bg-ubb-accent-100 px-2 py-0.5 font-text text-xs font-semibold text-ubb-accent-ink">
					{t("f1.select.freeBadge")}
				</span>
			)}
			{isFree && !config.unlocked.includes(id) && (
				<span className="inline-flex items-center gap-1 rounded-full bg-ubb-brand-100 px-2 py-0.5 font-text text-xs font-semibold text-ubb-brand-900">
					<Lock className="h-3 w-3" aria-hidden="true" />
					{t("f1.select.lockedBadge")}
				</span>
			)}
		</>
	);
};

/**
 * Écran 1 : les 3 sujets choisis d'après le diagnostic.
 * Abonné : « Changer un sujet » déplie les 7 catégories pour en remplacer un.
 * Gratuit : les 3 sujets sont offerts ; « Voir les sujets Premium » montre les autres, verrouillés.
 */
const CategoryStep = ({ config, selected, onChange, onContinue, lang }) => {
	const { t } = useTranslation();
	const [expanded, setExpanded] = useState(false);
	const isFree = config.access === "free";
	const full = selected.length >= config.selectionSize;
	const ordered = config.categoryOrder.filter((id) => selected.includes(id));
	const premiumIds = config.categoryOrder.filter((id) => !config.unlocked.includes(id));

	const toggle = (id) => {
		if (selected.includes(id)) onChange(selected.filter((s) => s !== id));
		else if (!full) onChange([...selected, id]);
	};

	return (
		<div>
			<p className="font-text text-ubb-body text-ubb-ink-muted">{t("f1.select.intro")}</p>
			{isFree && <p className="mt-2 font-text text-ubb-small text-ubb-ink-muted">{t("f1.select.freeNote")}</p>}

			{!expanded && (
				<ul className="mt-5 space-y-2">
					{ordered.map((id) => {
						const category = config.categories[id];
						return (
							<li key={id} className="flex items-start gap-3 rounded-ubb-field border border-ubb-brand-900 bg-ubb-brand-50 p-3">
								<span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded bg-ubb-brand-900 text-white" aria-hidden="true">
									<Check className="h-4 w-4" strokeWidth={3} />
								</span>
								<span className="min-w-0 flex-1">
									<span className="flex flex-wrap items-center gap-x-2 gap-y-1">
										<span className="font-text font-semibold text-ubb-ink">{pick(category.title, lang)}</span>
										<Badges id={id} config={config} />
									</span>
									<span className="mt-0.5 block font-text text-ubb-small text-ubb-ink-muted">{pick(category.description, lang)}</span>
								</span>
							</li>
						);
					})}
				</ul>
			)}

			<button
				type="button"
				onClick={() => setExpanded((v) => !v)}
				aria-expanded={expanded}
				aria-controls="f1-all-categories"
				className="ubb-focus mt-3 inline-flex min-h-[44px] items-center gap-1.5 rounded font-text text-sm font-semibold text-ubb-brand-900 underline underline-offset-4"
			>
				{expanded ? t("f1.select.close") : isFree ? t("f1.select.seePremium") : t("f1.select.change")}
				<ChevronDown className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`} aria-hidden="true" />
			</button>

			{expanded && isFree && (
				<div id="f1-all-categories" className="mt-2">
					<ul className="space-y-2">
						{premiumIds.map((id) => {
							const category = config.categories[id];
							return (
								<li key={id} className="flex items-start gap-3 rounded-ubb-field border border-ubb-brand-900/15 bg-white p-3">
									<Lock className="mt-1 h-4 w-4 shrink-0 text-ubb-ink-muted" aria-hidden="true" />
									<span className="min-w-0 flex-1">
										<span className="flex flex-wrap items-center gap-x-2 gap-y-1">
											<span className="font-text font-semibold text-ubb-ink">{pick(category.title, lang)}</span>
											<Badges id={id} config={config} />
										</span>
										<span className="mt-0.5 block font-text text-ubb-small text-ubb-ink-muted">{pick(category.description, lang)}</span>
									</span>
								</li>
							);
						})}
					</ul>
					<Button to="/checkout?plan=premium" variant="outline" size="sm" className="mt-3">
						{t("f1.results.locked.cta")}
					</Button>
				</div>
			)}

			{expanded && !isFree && (
				<fieldset id="f1-all-categories" className="mt-2">
					<legend className="sr-only">{t("f1.select.title")}</legend>
					<ul className="space-y-2">
						{config.categoryOrder.map((id) => {
							const category = config.categories[id];
							const checked = selected.includes(id);
							const disabled = !checked && full;
							return (
								<li key={id}>
									<label
										className={`flex min-h-[56px] cursor-pointer items-start gap-3 rounded-ubb-field border p-3 transition-colors ${
											checked ? "border-ubb-brand-900 bg-ubb-brand-50" : "border-ubb-brand-900/15 bg-white"
										} ${disabled && !checked ? "cursor-not-allowed opacity-60" : ""}`}
									>
										<input type="checkbox" className="peer sr-only" checked={checked} disabled={disabled} onChange={() => toggle(id)} />
										<span
											className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded border-2 peer-focus-visible:ring-2 peer-focus-visible:ring-ubb-brand-900 peer-focus-visible:ring-offset-2 ${
												checked ? "border-ubb-brand-900 bg-ubb-brand-900 text-white" : "border-ubb-brand-900/30 bg-white"
											}`}
											aria-hidden="true"
										>
											{checked && <Check className="h-4 w-4" strokeWidth={3} />}
										</span>
										<span className="min-w-0 flex-1">
											<span className="flex flex-wrap items-center gap-x-2 gap-y-1">
												<span className="font-text font-semibold text-ubb-ink">{pick(category.title, lang)}</span>
												<Badges id={id} config={config} />
											</span>
											<span className="mt-0.5 block font-text text-ubb-small text-ubb-ink-muted">{pick(category.description, lang)}</span>
										</span>
									</label>
								</li>
							);
						})}
					</ul>
					<p className="mt-3 font-text text-sm font-semibold text-ubb-ink" aria-live="polite">
						{t("f1.select.count", { count: selected.length })}
						{full && <span className="mt-1 block font-normal text-ubb-ink-muted">{t("f1.select.max")}</span>}
					</p>
				</fieldset>
			)}

			<Button onClick={onContinue} disabled={selected.length === 0} className="mt-5 w-full sm:w-auto">
				{t("f1.select.continue")}
			</Button>
		</div>
	);
};

export default CategoryStep;
