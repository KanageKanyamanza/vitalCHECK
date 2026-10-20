import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import {
	Mail,
	Phone,
	MapPin,
	Linkedin,
	Instagram,
	Youtube,
	Send,
	CheckCircle,
} from "lucide-react";
import logoIcon from "/android-icon-96x96.png";
import { InstallPWAButton, UserGuideButton } from "../ui";
import toast from "react-hot-toast";
// import useSmoothScroll from "../../hooks/useSmoothScroll";

import { API_BASE_URL } from "../../services/api";

const Footer = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	// const { scrollToTop, scrollToElement } = useSmoothScroll();

	const currentYear = new Date().getFullYear();

	// État pour la newsletter
	const [email, setEmail] = useState("");
	const [isSubscribing, setIsSubscribing] = useState(false);
	const [isSubscribed, setIsSubscribed] = useState(false);

	// Validation de l'email
	const isValidEmail = (email) => {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	};

	// Gérer l'abonnement à la newsletter
	const handleNewsletterSubmit = async (e) => {
		e.preventDefault();

		if (!email.trim()) {
			toast.error(t("footer.newsletter.invalidEmail"));
			return;
		}

		if (!isValidEmail(email)) {
			toast.error(t("footer.newsletter.invalidEmail"));
			return;
		}

		setIsSubscribing(true);

		try {
			const response = await fetch(`${API_BASE_URL}/newsletters/subscribe`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email: email.trim(),
					source: "footer",
				}),
			});

			const data = await response.json();

			if (data.success) {
				setIsSubscribed(true);
				toast.success(t("footer.newsletter.success"));
				setEmail("");

				// Réinitialiser après 3 secondes
				setTimeout(() => {
					setIsSubscribed(false);
				}, 3000);
			} else {
				toast.error(data.message || t("footer.newsletter.error"));
			}
		} catch (error) {
			console.error("Erreur lors de l'abonnement:", error);
			toast.error(t("footer.newsletter.error"));
		} finally {
			setIsSubscribing(false);
		}
	};

	// Icône TikTok personnalisée
	const TikTokIcon = ({ className }) => (
		<svg className={className} viewBox="0 0 24 24" fill="currentColor">
			<path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
		</svg>
	);

	const socialLinks = [
		{
			icon: Instagram,
			href: "https://www.instagram.com/vitalCHECK1957_?igsh=MW8xdDlsMGRzM2Jidg==",
			label: "Instagram",
		},
		{
			icon: Linkedin,
			href: "https://www.linkedin.com/in/ubuntu-business-builders-113223363?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
			label: "LinkedIn",
		},
		{
			icon: TikTokIcon,
			href: "https://www.tiktok.com/@vitalCHECK545?_t=ZN-8vKxXkXQe4g&_r=1",
			label: "TikTok",
		},
		{
			icon: Youtube,
			href: "https://youtube.com/@ubuntubusinessbuilders?si=NL3IMhyHoM06UCC2",
			label: "YouTube",
		},
	];

	const quickLinks = [
		{ label: t("footer.about"), href: "/about" },
		{ label: t("footer.services"), href: "/about", scrollTo: "what-we-do" },
		{ label: t("footer.contact"), href: "/contact" },
		// { label: t('footer.privacy'), href: '/privacy' },
		// { label: t('footer.terms'), href: '/terms' }
	];

	const handleNavigation = (path, scrollToId = null) => {
		navigate(path);
		// Si on a un scrollToId, attendre un peu que la page se charge puis scroll vers la section
		if (scrollToId) {
			setTimeout(() => {
				const element = document.getElementById(scrollToId);
				if (element) {
					// Calculer la position avec un offset pour laisser de l'espace au-dessus
					const elementPosition = element.offsetTop;
					const offsetPosition = elementPosition - 100; // 100px d'offset pour voir le titre

					window.scrollTo({
						top: offsetPosition,
						behavior: "smooth",
					});
				}
			}, 100);
		} else {
			// Ramener au top de la page si pas de section spécifique
			window.scrollTo({ top: 0, behavior: "smooth" });
		}
	};

	return (
		<footer className="bg-ubb-navy-950 font-text text-white">
			{/* Newsletter */}
			<div className="border-b border-white/10">
				<div className="ubb-container grid gap-8 py-12 sm:py-14 lg:grid-cols-2 lg:items-center">
					<div>
						<h2 className="ubb-heading text-ubb-subtitle text-white">
							{t("footer.newsletter.subtitle")}
						</h2>
						<p className="mt-2 max-w-ubb-prose text-ubb-body text-ubb-navy-200">
							{t("footer.newsletter.description")}
						</p>
					</div>

					<form onSubmit={handleNewsletterSubmit} noValidate>
						<label htmlFor="footer-newsletter-email" className="sr-only">
							{t("footer.newsletter.emailPlaceholder")}
						</label>
						<div className="flex flex-col gap-3 sm:flex-row">
							<input
								id="footer-newsletter-email"
								type="email"
								autoComplete="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder={t("footer.newsletter.emailPlaceholder")}
								disabled={isSubscribing || isSubscribed}
								className="ubb-input flex-1 border-transparent focus-visible:ring-offset-ubb-navy-950 disabled:opacity-60"
							/>
							<button
								type="submit"
								disabled={isSubscribing || isSubscribed || !email.trim()}
								className="ubb-btn ubb-btn-primary focus-visible:ring-offset-ubb-navy-950"
							>
								{isSubscribed ?
									<>
										<CheckCircle className="h-5 w-5" aria-hidden="true" />
										{t("footer.newsletter.success")}
									</>
								: isSubscribing ?
									<>
										<span
											className="h-5 w-5 animate-spin rounded-full border-2 border-ubb-navy-900 border-t-transparent"
											aria-hidden="true"
										/>
										{t("footer.newsletter.subscribing")}
									</>
								:	<>
										<Send className="h-5 w-5" aria-hidden="true" />
										{t("footer.newsletter.subscribe")}
									</>
								}
							</button>
						</div>
					</form>
				</div>
			</div>

			{/* Contenu principal */}
			<div className="ubb-container grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
				{/* Marque */}
				<div className="sm:col-span-2 lg:col-span-5">
					<div className="flex items-center gap-3">
						{/* Le logo du pied de page reste l'accès discret à l'administration */}
						<Link to="/admin" className="cursor-default" tabIndex={-1}>
							<img
								src={logoIcon}
								alt=""
								width="40"
								height="40"
								className="h-10 w-10 rounded-ubb-chip bg-white object-contain p-0.5"
							/>
						</Link>
						<span className="flex flex-col leading-none">
							<span className="font-heading text-xl font-bold">vitalCHECK</span>
							<span className="mt-1 text-sm text-ubb-navy-200">
								{t("navigation.byUbb")}
							</span>
						</span>
					</div>
					<p className="mt-5 max-w-md text-ubb-body text-ubb-navy-200">
						{t("footer.description")}
					</p>

					<ul className="mt-6 flex gap-2">
						{socialLinks.map((social) => (
							<li key={social.label}>
								<a
									href={social.href}
									target="_blank"
									rel="noopener noreferrer"
									aria-label={social.label}
									className="ubb-focus flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-ubb-gold-500 hover:text-ubb-gold-500 focus-visible:ring-offset-ubb-navy-950"
								>
									<social.icon className="h-5 w-5" aria-hidden="true" />
								</a>
							</li>
						))}
					</ul>
				</div>

				{/* Liens rapides */}
				<div className="lg:col-span-3">
					<h2 className="font-heading text-base font-semibold text-white">
						{t("footer.quickLinks")}
					</h2>
					<ul className="mt-4 space-y-1">
						{quickLinks.map((link) => (
							<li key={link.label}>
								<button
									onClick={() => handleNavigation(link.href, link.scrollTo)}
									className="ubb-focus min-h-[44px] rounded text-left text-ubb-navy-200 transition-colors hover:text-white focus-visible:ring-offset-ubb-navy-950"
								>
									{link.label}
								</button>
							</li>
						))}
						<li>
							<UserGuideButton
								variant="footer"
								className="min-h-[44px] focus-visible:ring-offset-ubb-navy-950"
							/>
						</li>
					</ul>
				</div>

				{/* Contact */}
				<div className="lg:col-span-4">
					<h2 className="font-heading text-base font-semibold text-white">
						{t("footer.contact")}
					</h2>
					<ul className="mt-4 space-y-1">
						<li>
							<a
								href="mailto:info@checkmyenterprise.com"
								className="ubb-focus inline-flex min-h-[44px] items-center gap-3 rounded text-ubb-navy-200 hover:text-white focus-visible:ring-offset-ubb-navy-950"
							>
								<Mail className="h-5 w-5 text-ubb-gold-500" aria-hidden="true" />
								info@checkmyenterprise.com
							</a>
						</li>
						<li>
							<a
								href="tel:+221788346969"
								className="ubb-focus inline-flex min-h-[44px] items-center gap-3 rounded text-ubb-navy-200 hover:text-white focus-visible:ring-offset-ubb-navy-950"
							>
								<Phone className="h-5 w-5 text-ubb-gold-500" aria-hidden="true" />
								+221 78 834 69 69
							</a>
						</li>
						<li className="flex min-h-[44px] items-center gap-3 text-ubb-navy-200">
							<MapPin className="h-5 w-5 text-ubb-gold-500" aria-hidden="true" />
							{t("footer.location")}
						</li>
					</ul>
					<div className="mt-6">
						<InstallPWAButton />
					</div>
				</div>
			</div>

			{/* Mentions légales */}
			<div className="border-t border-white/10">
				<div className="ubb-container flex flex-col gap-4 py-6 text-ubb-small text-ubb-navy-300 md:flex-row md:items-center md:justify-between">
					<div>
						<p>
							&copy; {currentYear} {t("company.name")}. {t("footer.allRightsReserved")}
						</p>
						<p className="mt-1">
							{t("company.rccm")} / {t("company.ninea")}
						</p>
					</div>
					<div className="flex gap-6">
						<button
							onClick={() => handleNavigation("/terms")}
							className="ubb-focus min-h-[44px] rounded hover:text-white focus-visible:ring-offset-ubb-navy-950"
						>
							{t("footer.terms")}
						</button>
						<button
							onClick={() => handleNavigation("/privacy")}
							className="ubb-focus min-h-[44px] rounded hover:text-white focus-visible:ring-offset-ubb-navy-950"
						>
							{t("footer.privacy")}
						</button>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
