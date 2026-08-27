import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  LayoutDashboard,
  FileText,
  User,
  LogOut,
  BarChart2,
  X,
  Zap,
  Home,
  ClipboardList,
} from "lucide-react";
import { useClientAuth } from "../../context/ClientAuthContext";
import logoIcon from "/android-icon-96x96.png";

const PAID_PLANS = ["standard", "premium", "diagnostic"];

const NavItem = ({ icon: Icon, label, to, active, onClick, badge }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    if (onClick) onClick();
    if (to) navigate(to);
  };
  return (
    <button
      onClick={handleClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all group border-l-[3px] ${
        active
          ? "bg-accent-500/20 text-accent-500 border-accent-500 pl-[13px]"
          : "text-green-100 hover:bg-white/10 hover:text-white border-transparent pl-[13px]"
      }`}
    >
      <Icon
        className={`w-4 h-4 shrink-0 ${
          active ? "text-accent-500" : "text-green-300 group-hover:text-white"
        }`}
      />
      <span className="truncate">{label}</span>
      {badge && (
        <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded bg-accent-500 text-primary-900 shrink-0">
          {badge}
        </span>
      )}
    </button>
  );
};

const ClientSidebar = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const { user, logout } = useClientAuth();
  const navigate = useNavigate();

  const isPremium =
    user?.subscription?.status === "active" &&
    PAID_PLANS.includes(user?.subscription?.plan);

  const plan = user?.subscription?.plan || "free";
  const planLabel = plan === "free" ? t("clientLayout.planFree") : plan.toUpperCase();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    onClose?.();
    logout();
  };

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-30 flex flex-col w-[260px]
        bg-primary-900 text-white shadow-2xl
        transition-transform duration-300 ease-in-out
        lg:static lg:translate-x-0 lg:shadow-none
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 shrink-0">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2.5 hover:opacity-90 transition-opacity"
        >
          <img src={logoIcon} alt="VitalCHECK" className="w-8 h-8 rounded-md" />
          <div className="leading-none">
            <span className="font-bold text-white text-sm tracking-wide">VitalCHECK</span>
            <br />
            <span className="text-[10px] text-accent-400 font-medium uppercase tracking-widest">
              Enterprise Health
            </span>
          </div>
        </button>
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-lg text-green-300 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* User chip */}
      <div className="px-4 py-3 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-accent-500 flex items-center justify-center shrink-0">
            <span className="text-primary-900 font-bold text-sm">
              {(user?.companyName || user?.firstName || "U").charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">
              {user?.companyName || user?.firstName || user?.email}
            </p>
            <span
              className={`text-[10px] font-bold uppercase tracking-wide ${
                isPremium ? "text-accent-400" : "text-green-400"
              }`}
            >
              {planLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {/* Retour accueil */}
        <NavItem
          icon={Home}
          label={t("clientLayout.nav.home")}
          to="/"
          active={false}
          onClick={onClose}
        />

        <div className="my-1 border-t border-white/10" />

        <NavItem
          icon={LayoutDashboard}
          label={t("clientLayout.nav.dashboard")}
          to="/client/dashboard"
          active={isActive("/client/dashboard")}
          onClick={onClose}
        />
        {/* Historique des évaluations */}
        <NavItem
          icon={ClipboardList}
          label={t("clientLayout.nav.history")}
          to="/client/history"
          active={isActive("/client/history")}
          onClick={onClose}
        />
        <NavItem
          icon={User}
          label={t("clientLayout.nav.profile")}
          to="/client/profile"
          active={isActive("/client/profile")}
          onClick={onClose}
        />

        {/* Premium section */}
        <div className="pt-4">
          <p className="px-4 mb-1 text-[10px] font-bold uppercase tracking-widest text-green-500">
            {isPremium ? t("clientLayout.nav.premiumSection") : t("clientLayout.nav.advancedSection")}
          </p>
          {isPremium ? (
            <NavItem
              icon={BarChart2}
              label={t("clientLayout.nav.advanced")}
              to="/client/dashboard"
              active={false}
              badge="★"
              onClick={onClose}
            />
          ) : (
            <button
              onClick={() => { onClose?.(); navigate("/pricing"); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium
                text-green-500 border border-dashed border-green-700 hover:border-accent-500/50
                hover:text-accent-400 transition-all"
            >
              <Zap className="w-4 h-4 shrink-0" />
              <span className="truncate">{t("clientLayout.nav.upgradeToPremium")}</span>
            </button>
          )}
        </div>
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-white/10 shrink-0">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium
            text-green-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>{t("clientDashboard.logout")}</span>
        </button>
      </div>
    </aside>
  );
};

export default ClientSidebar;
