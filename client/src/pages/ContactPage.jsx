import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import { MapPin, Phone, Mail, Clock, CheckCircle2 } from "lucide-react";
import { useAssessment } from "../context/AssessmentContext";
import { SocialShare } from "../components/ui";
import { AuthLayout, Button, FormField } from "../components/ui/ds";
import SEOHead from "../components/seo/SEOHead";
import { API_BASE_URL } from "../services/api";

const EMPTY_FORM = {
	name: "",
	email: "",
	company: "",
	phone: "",
	subject: "",
	message: "",
	inquiryType: "",
};

const INQUIRY_TYPES = ["general", "assessment", "premium", "technical", "partnership", "other"];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ContactPage = () => {
	const { t } = useTranslation();
	const { user, assessment } = useAssessment();
	const [formData, setFormData] = useState(EMPTY_FORM);
	const [errors, setErrors] = useState({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSent, setIsSent] = useState(false);

	// Pré-remplir les champs avec les données de l'évaluation
	useEffect(() => {
		if (user && (user.companyName || user.email)) {
			setFormData((prev) => ({
				...prev,
				name: user.companyName || "",
				email: user.email || "",
				company: user.companyName || "",
				// Pré-remplir le type de demande selon le contexte
				inquiryType: assessment ? "premium" : "general",
				// Sujet et message personnalisés si l'utilisateur vient de terminer une évaluation
				subject:
					assessment ? `Demande de services premium - ${user.companyName}` : "",
				message:
					assessment ?
						`Bonjour,\n\nJ'ai récemment terminé l'évaluation vitalCHECK Enterprise Health Check pour ${user.companyName} et je souhaiterais en savoir plus sur vos services premium.\n\nMerci de me contacter pour discuter des options disponibles.\n\nCordialement`
					:	"",
			}));
		}
	}, [user, assessment]);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
		if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
	};

	const validate = () => {
		const next = {};
		if (!formData.name.trim()) next.name = t("contact.errors.name");
		if (!formData.email.trim()) next.email = t("contact.errors.email");
		else if (!EMAIL_PATTERN.test(formData.email.trim())) next.email = t("contact.errors.emailInvalid");
		if (!formData.inquiryType) next.inquiryType = t("contact.errors.inquiryType");
		if (!formData.subject.trim()) next.subject = t("contact.errors.subject");
		if (!formData.message.trim()) next.message = t("contact.errors.message");
		return next;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const next = validate();
		setErrors(next);
		const first = Object.keys(next)[0];
		if (first) {
			document.getElementById(`contact-${first}`)?.focus();
			return;
		}

		setIsSubmitting(true);
		try {
			// URL complète de l'API : un chemin relatif tombait sur la page d'accueil en production
			const response = await fetch(`${API_BASE_URL}/contact`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			if (response.ok) {
				toast.success(t("contact.form.successMessage"));
				setFormData(EMPTY_FORM);
				setIsSent(true);
			} else {
				throw new Error("Erreur lors de l'envoi du message");
			}
		} catch (error) {
			console.error("Erreur:", error);
			toast.error(t("contact.form.errorMessage"));
		} finally {
			setIsSubmitting(false);
		}
	};

	const field = (name) => ({
		id: `contact-${name}`,
		name,
		value: formData[name],
		onChange: handleInputChange,
		"aria-invalid": errors[name] ? "true" : "false",
		"aria-describedby": errors[name] ? `contact-${name}-error` : undefined,
	});

	const phoneValue = t("contact.info.phone.value");
	const emailValue = t("contact.info.email.value");
	const infos = [
		{ key: "address", icon: MapPin, value: t("contact.info.address.value") },
		{ key: "phone", icon: Phone, value: phoneValue.replace(/[^\d+ ]/g, "").trim(), href: `tel:+${phoneValue.replace(/\D/g, "")}` },
		{ key: "email", icon: Mail, value: emailValue, href: `mailto:${emailValue}` },
		{ key: "hours", icon: Clock, value: t("contact.info.hours.value") },
	];

	return (
		<>
			<SEOHead
				title={t("contact.seo.title")}
				description={t("contact.seo.description")}
				url="/contact"
			/>
			<AuthLayout
				scene="contact"
				width="lg"
				title={t("contact.title")}
				subtitle={t("contact.subtitle")}
				panelTitle={t("contact.why.title")}
				panelText={t("contact.why.description")}
			>
				{isSent ? (
					<div role="status" className="ubb-card p-6 sm:p-8">
						<span className="flex h-14 w-14 items-center justify-center rounded-full bg-ubb-brand-50 text-ubb-brand-900">
							<CheckCircle2 className="h-8 w-8" aria-hidden="true" />
						</span>
						<h2 className="ubb-heading mt-5 text-ubb-subtitle">{t("contact.sent.title")}</h2>
						<p className="mt-2 font-text text-ubb-body text-ubb-ink-muted">{t("contact.form.successMessage")}</p>
						<Button variant="outline" onClick={() => setIsSent(false)} className="mt-6">
							{t("contact.sent.again")}
						</Button>
					</div>
				) : (
					<form onSubmit={handleSubmit} noValidate className="space-y-5">
						<div className="grid gap-5 sm:grid-cols-2">
							<FormField id="contact-name" label={t("contact.form.name")} error={errors.name}>
								<input type="text" autoComplete="name" className="ubb-input" placeholder={t("contact.form.namePlaceholder")} required {...field("name")} />
							</FormField>
							<FormField id="contact-email" label={t("contact.form.email")} error={errors.email}>
								<input type="email" autoComplete="email" inputMode="email" className="ubb-input" placeholder={t("contact.form.emailPlaceholder")} required {...field("email")} />
							</FormField>
							<FormField id="contact-company" label={t("contact.form.company")} optional={t("common.optional")}>
								<input type="text" autoComplete="organization" className="ubb-input" placeholder={t("contact.form.companyPlaceholder")} {...field("company")} />
							</FormField>
							<FormField id="contact-phone" label={t("contact.form.phone")} optional={t("common.optional")}>
								<input type="tel" autoComplete="tel" inputMode="tel" className="ubb-input" placeholder={t("contact.form.phonePlaceholder")} {...field("phone")} />
							</FormField>
						</div>

						<FormField id="contact-inquiryType" label={t("contact.form.inquiryType")} error={errors.inquiryType}>
							<select className="ubb-input" required {...field("inquiryType")}>
								<option value="">{t("contact.form.inquiryTypePlaceholder")}</option>
								{INQUIRY_TYPES.map((type) => (
									<option key={type} value={type}>
										{t(`contact.form.inquiryTypes.${type}`)}
									</option>
								))}
							</select>
						</FormField>

						<FormField id="contact-subject" label={t("contact.form.subject")} error={errors.subject}>
							<input type="text" className="ubb-input" placeholder={t("contact.form.subjectPlaceholder")} required {...field("subject")} />
						</FormField>

						<FormField id="contact-message" label={t("contact.form.message")} error={errors.message}>
							<textarea rows={5} className="ubb-input resize-y" placeholder={t("contact.form.messagePlaceholder")} required {...field("message")} />
						</FormField>

						<Button type="submit" size="lg" disabled={isSubmitting} className="w-full">
							{isSubmitting ? t("contact.form.sending") : t("contact.form.send")}
						</Button>
						<p className="font-text text-ubb-small text-ubb-ink-muted">{t("contact.form.privacy")}</p>
					</form>
				)}

				{/* Coordonnées : toujours visibles, y compris sur mobile (l'illustration y est masquée) */}
				<section aria-labelledby="contact-info-title" className="mt-10 border-t border-ubb-brand-900/[0.08] pt-8">
					<h2 id="contact-info-title" className="font-heading text-lg font-semibold text-ubb-ink">
						{t("contact.info.title")}
					</h2>
					<ul className="mt-4 space-y-1">
						{infos.map(({ key, icon: Icon, value, href }) => (
							<li key={key} className="flex items-start gap-3 py-2">
								<span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-ubb-field bg-ubb-mist text-ubb-brand-900">
									<Icon className="h-[18px] w-[18px]" aria-hidden="true" />
								</span>
								<span className="min-w-0">
									<span className="block font-text text-xs font-semibold text-ubb-ink-muted">
										{t(`contact.info.${key}.title`)}
									</span>
									{href ? (
										<a href={href} className="ubb-focus inline-flex min-h-[44px] items-center rounded font-text text-ubb-body font-medium text-ubb-ink underline decoration-ubb-accent-500 decoration-2 underline-offset-4">
											{value}
										</a>
									) : (
										<span className="block font-text text-ubb-body text-ubb-ink">{value}</span>
									)}
								</span>
							</li>
						))}
					</ul>
					<p className="mt-4 font-text text-ubb-small text-ubb-ink-muted">
						{t("company.name")}. {t("company.rccm")} / {t("company.ninea")}
					</p>
				</section>
			</AuthLayout>
			<SocialShare title={t("contact.seo.title")} description={t("contact.seo.description")} />
		</>
	);
};

export default ContactPage;
