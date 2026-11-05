import React from "react";
import { useTranslation } from "react-i18next";
import { Check, Lock } from "lucide-react";
import { Button } from "../../components/ui/ds";
import { pick } from "./display";

/** Écran 1 : 3 catégories pré-cochées, le dirigeant peut en remplacer une parmi les 7. */
const CategoryStep = ({ config, selected, onChange, onContinue, lang }) => {
	const { t } = useTranslation();
	const isFree = config.access === "free";
	const fixedId = isFree ? config.preselected[0] : null;
	const full = selected.length >= config.selectionSize;

	const toggle = (id) => {
		if (id === fixedId) return;
		if (selected.includes(id)) onChange(selected.filter((s) => s !== id));
		else if (!full) onChange([...selected, id]);
	};

	return (
		<div>
			<p className="font-text text-ubb-body text-ubb-ink-muted">{t("f1.select.intro")}</p>
			{isFree && <p className="mt-2 font-text text-ubb-small text-ubb-ink-muted">{t("f1.select.freeNote")}</p>}

			<fieldset className="mt-5">
				<legend className="sr-only">{t("f1.select.title")}</legend>
				<ul className="space-y-2">
					{config.categoryOrder.map((id) => {
						const category = config.categories[id];
						const checked = selected.includes(id);
						const disabled = id === fixedId || (!checked && full);
						const locked = !config.unlocked.includes(id);
						return (
							<li key={id}>
								<label
									className={`flex min-h-[56px] cursor-pointer items-start gap-3 rounded-ubb-field border p-3 transition-colors ${
										checked ? "border-ubb-brand-900 bg-ubb-brand-50" : "border-ubb-brand-900/15 bg-white"
									} ${disabled && !checked ? "cursor-not-allowed opacity-60" : ""}`}
								>
									<input
										type="checkbox"
										className="peer sr-only"
										checked={checked}
										disabled={disabled}
										onChange={() => toggle(id)}
									/>
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
											{id === fixedId && (
												<span className="rounded-full bg-ubb-accent-100 px-2 py-0.5 font-text text-xs font-semibold text-ubb-accent-ink">
													{t("f1.select.freeBadge")}
												</span>
											)}
											{isFree && locked && (
												<span className="inline-flex items-center gap-1 rounded-full bg-ubb-brand-100 px-2 py-0.5 font-text text-xs font-semibold text-ubb-brand-900">
													<Lock className="h-3 w-3" aria-hidden="true" />
													{t("f1.select.lockedBadge")}
												</span>
											)}
											{!isFree && config.preselected.includes(id) && (
												<span className="rounded-full bg-ubb-brand-100 px-2 py-0.5 font-text text-xs font-semibold text-ubb-brand-900">
													{t("f1.select.suggested")}
												</span>
											)}
										</span>
										<span className="mt-0.5 block font-text text-ubb-small text-ubb-ink-muted">
											{pick(category.description, lang)}
										</span>
									</span>
								</label>
							</li>
						);
					})}
				</ul>
			</fieldset>

			<p className="mt-4 font-text text-sm font-semibold text-ubb-ink" aria-live="polite">
				{t("f1.select.count", { count: selected.length })}
				{full && <span className="mt-1 block font-normal text-ubb-ink-muted">{t("f1.select.max")}</span>}
			</p>

			<Button onClick={onContinue} disabled={selected.length === 0} className="mt-5 w-full sm:w-auto">
				{t("f1.select.continue")}
			</Button>
		</div>
	);
};

export default CategoryStep;
