import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
	Mail,
	Phone,
	MapPin,
	Linkedin,
	Instagram,
	Youtube
} from "lucide-react";
import logoIcon from "/icons/android-icon-96x96.png";
import { InstallPWAButton } from "../ui";
import useSmoothScroll from "../../hooks/useSmoothScroll";

const Footer = () => {
	const { t } = useTranslation();
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
			href: "https://www.instagram.com/ubb1957_?igsh=MW8xdDlsMGRzM2Jidg==",
			label: "Instagram",
		},
		{
			icon: Linkedin,
			href: "https://www.linkedin.com/in/ubuntu-business-builders-113223363?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
			label: "LinkedIn",
		},
		{
			icon: TikTokIcon,
			href: "https://www.tiktok.com/@ubb545?_t=ZN-8vKxXkXQe4g&_r=1",
			label: "TikTok",
		},
		{
			icon: Youtube,
			href: "https://youtube.com/@ubuntubusinessbuilders?si=NL3IMhyHoM06UCC2",
			label: "YouTube",
		},
	];

	const quickLinks = [
		{ label: t("footer.about"), href: "#about", scrollTo: "about" },
		{ label: t("footer.services"), href: "#services", scrollTo: "services" },
		{ label: t("footer.contact"), href: "#contact", scrollTo: "contact" },
		// { label: t('footer.privacy'), href: '/privacy' },
		// { label: t('footer.terms'), href: '/terms' }
	];

	const handleScrollToSection = (sectionId) => {
		window.scrollTo({
			top: sectionId === 'terms' ? 0 : sectionId === 'privacy' ? 0 : document.getElementById(sectionId).offsetTop,
			behavior: 'smooth'
		});
	};

	return (
		<footer className="bg-gray-900 text-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-4">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
					{/* Logo et Description */}
					<div className="lg:col-span-2">
						<div className="flex items-center space-x-3 mb-4">
							<div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
								<img
									src={logoIcon}
									alt="UBB Logo"
									className="w-full h-full object-contain"
								/>
							</div>
							<div className="flex flex-col">
								<span className="text-lg font-display font-bold ubb-gradient-text">
									UBB
								</span>
								<span className="text-xs text-gray-400 font-medium">
									Enterprise Health Check
								</span>
							</div>
						</div>
						<p className="text-gray-300 mb-6 max-w-md">
							{t("footer.description")}
						</p>

						{/* Social Links */}
						<div className="flex space-x-4 mb-4">
							{socialLinks.map((social, index) => (
								<a
									key={index}
									href={social.href}
									className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-500 transition-colors duration-200"
									aria-label={social.label}
								>
									<social.icon className="w-5 h-5" />
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
										<Link
											to={link.href}
											className="text-gray-300 hover:text-white transition-colors duration-200"
										>
											{link.label}
										</Link>
									) : (
										<button
											onClick={() => handleScrollToSection(link.scrollTo)}
											className="text-gray-300 hover:text-white transition-colors duration-200 text-left"
										>
											{link.label}
										</button>
									)}
								</li>
							))}
						</ul>
					</div>

					{/* Contact Info */}
					<div>
						<h3 className="text-lg font-semibold mb-4">
							{t("footer.contact")}
						</h3>
						<div className="space-y-3">
							<div className="flex items-center space-x-3">
								<Mail className="w-5 h-5 text-primary-500" />
								<span className="text-gray-300">ambrose.n@growthubb.space</span>
							</div>
							<div className="space-y-2">
								<div className="flex items-center space-x-3">
									<Phone className="w-5 h-5 text-primary-500" />
									<div className="text-gray-300">
										<div className="text-sm">SEN: +221 771970713</div>
										<div className="text-sm">GB: +44 7546756325</div>
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
				<div className="border-t border-gray-800 mt-4 pt-8">
					<div className="flex flex-col md:flex-row justify-between items-center">
						<p className="text-gray-400 text-sm">
							&copy; {currentYear} UBB Enterprise Health Check.{" "}
							{t("footer.allRightsReserved")}
						</p>
						<div className="flex items-center space-x-6 mt-4 md:mt-0">
							<Link
								to="/terms"
								onClick={() => handleScrollToSection('terms')}
								className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
							>
								{t("footer.terms")}
							</Link>
							<Link
								to="/privacy"
								onClick={() => handleScrollToSection('privacy')}
								className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
							>
								{t("footer.privacy")}
							</Link>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
