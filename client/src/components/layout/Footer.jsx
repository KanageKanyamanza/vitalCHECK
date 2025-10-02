import React from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import {
	Mail,
	Phone,
	MapPin,
	Linkedin,
	Instagram,
	Youtube
} from "lucide-react";
import logoIcon from "/android-icon-96x96.png";
import { InstallPWAButton, UserGuideButton } from "../ui";
import useSmoothScroll from "../../hooks/useSmoothScroll";

const Footer = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { scrollToTop, scrollToElement } = useSmoothScroll();

	const currentYear = new Date().getFullYear();

	// Icône TikTok personnalisée
	const TikTokIcon = ({ className }) => (
		<svg className={className} viewBox="0 0 24 24" fill="currentColor">
			<path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
		</svg>
	);

	const socialLinks = [
		{
			icon: Instagram,
			href: "https://www.instagram.com/VitalCheck1957_?igsh=MW8xdDlsMGRzM2Jidg==",
			label: "Instagram",
		},
		{
			icon: Linkedin,
			href: "https://www.linkedin.com/in/ubuntu-business-builders-113223363?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
			label: "LinkedIn",
		},
		{
			icon: TikTokIcon,
			href: "https://www.tiktok.com/@VitalCheck545?_t=ZN-8vKxXkXQe4g&_r=1",
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

	const handleScrollToSection = (sectionId) => {
		window.scrollTo({
			top: sectionId === 'terms' ? 0 : sectionId === 'privacy' ? 0 : document.getElementById(sectionId).offsetTop,
			behavior: 'smooth'
		});
	};

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
						behavior: 'smooth'
					});
				}
			}, 100);
		} else {
			// Ramener au top de la page si pas de section spécifique
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	};

	return (
		<footer className="bg-primary-500 text-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-4">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
					{/* Logo et Description */}
					<div className="lg:col-span-2">
						<div className="flex items-center space-x-3 mb-4">
							<div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
								<img
									src={logoIcon}
									alt="VitalCheck Logo"
									className="w-full h-full object-contain"
								/>
							</div>
							<div className="flex flex-col">
								<span className="text-white font-medium">
									Enterprise Health Check
								</span>
							</div>
						</div>
						<p className="text-white mb-6 max-w-md">
							{t("footer.description")}
						</p>

						{/* Social Links */}
						<div className="flex space-x-4 mb-4">
							{socialLinks.map((social, index) => (
								<a
									key={index}
									href={social.href}
									className="w-10 h-10 bg-accent-500 rounded-lg flex items-center justify-center hover:bg-accent-600 transition-colors duration-200"
									aria-label={social.label}
								>
									<social.icon className="w-5 h-5 text-white" />
								</a>
							))}
						</div>
					</div>

					{/* Liens Rapides */}
					<div>
						<h3 className="text-lg font-semibold mb-4">
							{t("footer.quickLinks")}
						</h3>
						<ul className="space-y-3">
							{quickLinks.map((link, index) => (
								<li key={index}>
									{link.href.startsWith("/") ? (
										<button
											onClick={() => handleNavigation(link.href, link.scrollTo)}
											className="text-white hover:text-gray-800 transition-colors duration-200 text-left"
										>
											{link.label}
										</button>
									) : (
										<button
											onClick={() => handleScrollToSection(link.scrollTo)}
											className="text-white hover:text-gray-800 transition-colors duration-200 text-left"
										>
											{link.label}
										</button>
									)}
								</li>
							))}
							{/* Guide d'utilisation */}
							<li>
								<UserGuideButton variant="footer" />
							</li>
						</ul>
					</div>

					{/* Contact Info */}
					<div>
						<h3 className="text-lg font-semibold mb-4">
							{t("footer.contact")}
						</h3>
						<div className="space-y-3">
							<div className="flex items-center space-x-3">
								<Mail className="w-5 h-5 text-accent-500" />
								<span className="text-white">info@checkmyenterprise.com</span>
							</div>
							<div className="space-y-2">
								<div className="flex items-center space-x-3">
									<Phone className="w-5 h-5 text-accent-500" />
									<div className="text-white">
										<div className="text-sm">🇸🇳 +221 771970713</div>
										<div className="text-sm">🇬🇧 +44 7546756325</div>
									</div>
								</div>
							</div>
						</div>
						{/* Install PWA Button */}
						<div className="flex md:justify-end mt-10">
							<InstallPWAButton />
						</div>
					</div>
				</div>

				{/* Bottom Bar */}
				<div className="border-t border-gray-300 mt-4 pt-8">
					<div className="flex flex-col md:flex-row justify-between items-center">
						<p className="text-white text-sm">
							&copy; {currentYear} VitalCheck Enterprise Health Check.{" "}
							{t("footer.allRightsReserved")}
						</p>
						<div className="flex items-center space-x-6 mt-4 md:mt-0">
							<button
								onClick={() => handleNavigation('/terms')}
								className="text-white hover:text-gray-800 text-sm transition-colors duration-200"
							>
								{t("footer.terms")}
							</button>
							<button
								onClick={() => handleNavigation('/privacy')}
								className="text-white hover:text-gray-800 text-sm transition-colors duration-200"
							>
								{t("footer.privacy")}
							</button>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
