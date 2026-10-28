import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, User, LayoutDashboard, Menu, X } from "lucide-react";
import { NavbarLanguageSelector, UserGuideButton } from "../ui";
import { Button } from "../ui/ds";
import { useAssessment } from "../../context/AssessmentContext";
import { useClientAuth } from "../../context/ClientAuthContext";
import logoIcon from "/android-icon-96x96.png";

const NAV_LINKS = [
	{ path: "/", key: "navigation.home" },
	{ path: "/about", key: "navigation.about" },
	{ path: "/pricing", key: "navigation.pricing" },
	{ path: "/blog", key: "navigation.blog" },
	{ path: "/contact", key: "navigation.contact" },
];

const Navbar = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const location = useLocation();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);

	// Vérification sécurisée du contexte Assessment
	let dispatch;
	try {
		dispatch = useAssessment().dispatch;
	} catch (error) {
		console.warn("AssessmentContext not available in Navbar:", error.message);
		dispatch = () => {};
	}

	// Client Auth Context
	const { user: clientUser, isAuthenticated } = useClientAuth();

	// Admin Auth Context (depuis localStorage)
	const isAdminAuthenticated = !!localStorage.getItem("adminToken");

	// Ombre de l'en-tête dès qu'on quitte le haut de page
	useEffect(() => {
		const handleScroll = () => setIsScrolled(window.scrollY > 8);
		handleScroll();
		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	// Fermer le menu à chaque changement de page
	useEffect(() => {
		setIsMobileMenuOpen(false);
	}, [location.pathname]);

	// Menu mobile ouvert : bloquer le scroll de la page et fermer avec Échap
	useEffect(() => {
		if (!isMobileMenuOpen) return;
		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		const handleKey = (e) => e.key === "Escape" && setIsMobileMenuOpen(false);
		window.addEventListener("keydown", handleKey);
		return () => {
			document.body.style.overflow = previousOverflow;
			window.removeEventListener("keydown", handleKey);
		};
	}, [isMobileMenuOpen]);

	const handleLanguageChange = (language) => {
		dispatch({ type: "SET_LANGUAGE", payload: language });
	};

	const isActive = (path) => location.pathname === path;

	const handleSmartLogin = () => {
		if (localStorage.getItem("adminToken")) {
			navigate("/admin/dashboard");
		} else if (localStorage.getItem("clientToken")) {
			navigate("/client/dashboard");
		} else {
			navigate("/login");
		}
		setIsMobileMenuOpen(false);
	};

	const accountLabel =
		isAdminAuthenticated ? t("navigation.adminDashboard")
		: isAuthenticated && clientUser ?
			clientUser.firstName || clientUser.companyName || t("navigation.myAccount")
		:	t("navigation.login");

	const AccountIcon =
		isAdminAuthenticated ? LayoutDashboard
		: isAuthenticated && clientUser ? User
		: LogIn;

	return (
		<>
		<header
			className={`fixed inset-x-0 top-0 z-50 h-ubb-header bg-white/95 backdrop-blur transition-shadow duration-200 ${
				isScrolled || isMobileMenuOpen ?
					"shadow-ubb-sm"
				:	"border-b border-ubb-brand-900/[0.06]"
			}`}
		>
			<nav
				className="ubb-container flex h-full items-center justify-between gap-3"
				aria-label={t("navigation.mainMenu")}
			>
				{/* Logo */}
				<Link
					to="/"
					className="ubb-focus -ml-1 flex shrink-0 items-center gap-2.5 rounded-ubb-chip p-1"
				>
					<img
						src={logoIcon}
						alt=""
						width="36"
						height="36"
						className="h-9 w-9 rounded-ubb-chip object-contain"
					/>
					<span className="flex flex-col leading-none">
						<span className="font-heading text-lg font-bold tracking-tight text-ubb-ink">
							vitalCHECK
						</span>
						<span className="mt-0.5 font-text text-xs text-ubb-ink-muted">
							{t("navigation.byUbb")}
						</span>
					</span>
				</Link>

				{/* Liens desktop */}
				<ul className="hidden items-center gap-1 lg:flex">
					{NAV_LINKS.map(({ path, key }) => (
						<li key={path}>
							<Link
								to={path}
								aria-current={isActive(path) ? "page" : undefined}
								className={`ubb-focus relative inline-flex min-h-[44px] items-center rounded-ubb-chip px-3 font-text text-[0.95rem] font-medium transition-colors ${
									isActive(path) ?
										"text-ubb-ink after:absolute after:inset-x-3 after:bottom-1.5 after:h-0.5 after:rounded-full after:bg-ubb-accent-500"
									:	"text-ubb-ink-muted hover:text-ubb-ink"
								}`}
							>
								{t(key)}
							</Link>
						</li>
					))}
				</ul>

				{/* Actions */}
				<div className="flex items-center gap-2">
					<div className="hidden lg:block">
						<NavbarLanguageSelector onLanguageChange={handleLanguageChange} />
					</div>

					<button
						type="button"
						onClick={handleSmartLogin}
						className="ubb-focus hidden min-h-[44px] items-center gap-2 rounded-full px-4 font-text text-sm font-semibold text-ubb-ink hover:bg-ubb-brand-50 lg:inline-flex"
					>
						<AccountIcon className="h-4 w-4" aria-hidden="true" />
						<span className="max-w-[10rem] truncate">{accountLabel}</span>
					</button>

					<Button to="/diagnostic" size="sm" className="hidden min-[420px]:inline-flex">
						<span className="lg:hidden">{t("navigation.startDiagnosticShort")}</span>
						<span className="hidden lg:inline">{t("navigation.startDiagnostic")}</span>
					</Button>

					{/* Bouton menu mobile */}
					<button
						type="button"
						onClick={() => setIsMobileMenuOpen((open) => !open)}
						className="ubb-focus inline-flex h-11 w-11 items-center justify-center rounded-full text-ubb-ink hover:bg-ubb-brand-50 lg:hidden"
						aria-expanded={isMobileMenuOpen}
						aria-controls="ubb-mobile-menu"
						aria-label={
							isMobileMenuOpen ? t("navigation.closeMenu") : t("navigation.openMenu")
						}
					>
						{isMobileMenuOpen ?
							<X className="h-6 w-6" aria-hidden="true" />
						:	<Menu className="h-6 w-6" aria-hidden="true" />}
					</button>
				</div>
			</nav>
		</header>

			{/* Menu mobile : panneau plein écran sous l'en-tête.
			    Hors du <header> : son backdrop-filter piégerait le position: fixed. */}
			<AnimatePresence>
				{isMobileMenuOpen && (
					<motion.div
						id="ubb-mobile-menu"
						initial={{ opacity: 0, y: -8 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -8 }}
						transition={{ duration: 0.2, ease: "easeOut" }}
						className="fixed inset-x-0 bottom-0 top-ubb-header z-40 overflow-y-auto bg-white lg:hidden"
					>
						<div className="ubb-container flex min-h-full flex-col gap-6 pb-8 pt-4">
							<ul className="flex flex-col">
								{NAV_LINKS.map(({ path, key }) => (
									<li key={path} className="border-b border-ubb-brand-900/[0.07]">
										<Link
											to={path}
											aria-current={isActive(path) ? "page" : undefined}
											onClick={() => setIsMobileMenuOpen(false)}
											className={`ubb-focus flex min-h-[56px] items-center justify-between font-heading text-xl font-semibold ${
												isActive(path) ? "text-ubb-ink" : "text-ubb-ink/80"
											}`}
										>
											{t(key)}
											{isActive(path) && (
												<span className="h-2 w-2 rounded-full bg-ubb-accent-500" aria-hidden="true" />
											)}
										</Link>
									</li>
								))}
								<li className="border-b border-ubb-brand-900/[0.07]">
									<UserGuideButton
										variant="menu"
										className="min-h-[56px] w-full font-heading text-xl font-semibold"
									/>
								</li>
							</ul>

							<div className="flex items-center justify-between gap-4">
								<span className="font-text text-sm font-semibold text-ubb-ink-muted">
									{t("navigation.language")}
								</span>
								<NavbarLanguageSelector
									variant="segmented"
									onLanguageChange={handleLanguageChange}
								/>
							</div>

							<div className="mt-auto flex flex-col gap-3">
								<Button to="/diagnostic" size="lg" className="w-full">
									{t("navigation.startDiagnostic")}
								</Button>
								<Button variant="outline" onClick={handleSmartLogin} className="w-full">
									<AccountIcon className="h-4 w-4" aria-hidden="true" />
									{accountLabel}
								</Button>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
};

export default Navbar;
