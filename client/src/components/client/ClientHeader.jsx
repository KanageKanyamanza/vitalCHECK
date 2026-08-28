import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu, Plus, Settings, ChevronRight } from "lucide-react";
import { useClientAuth } from "../../context/ClientAuthContext";
import { useAssessment } from "../../context/AssessmentContext";

const BREADCRUMBS = {
  "/client/dashboard": ["clientLayout.nav.dashboard"],
  "/client/history":   ["clientLayout.nav.dashboard", "clientLayout.nav.history"],
  "/client/analytics": ["clientLayout.nav.dashboard", "clientLayout.nav.advanced"],
  "/client/badge":     ["clientLayout.nav.dashboard", "clientLayout.nav.badge"],
  "/client/profile":   ["clientLayout.nav.dashboard", "clientLayout.nav.profile"],
};

const PLAN_BADGES = {
  free:       { label: "GRATUIT",    cls: "bg-gray-100 text-gray-600" },
  standard:   { label: "STANDARD",   cls: "bg-primary-100 text-primary-700" },
  premium:    { label: "PREMIUM",    cls: "bg-accent-100 text-accent-700" },
  diagnostic: { label: "DIAGNOSTIC", cls: "bg-secondary-100 text-secondary-700" },
};

const ClientHeader = ({ onMenuToggle }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useClientAuth();
  const { dispatch: assessmentDispatch } = useAssessment();

  const plan  = user?.subscription?.plan || "free";
  const badge = PLAN_BADGES[plan] || PLAN_BADGES.free;
  const crumbs = BREADCRUMBS[location.pathname] || ["clientLayout.nav.dashboard"];

  const handleNewAssessment = () => {
    assessmentDispatch({ type: "CLEAR_STORAGE" });
    navigate("/diagnostic");
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 gap-4 shrink-0 shadow-sm">
      {/* Hamburger - mobile only */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm min-w-0 flex-1">
        {crumbs.map((key, i) => (
          <React.Fragment key={key}>
            {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />}
            <span
              className={
                i === crumbs.length - 1
                  ? "font-semibold text-gray-900 truncate"
                  : "text-gray-400 truncate"
              }
            >
              {t(key)}
            </span>
          </React.Fragment>
        ))}
      </nav>

      {/* Right side */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Plan badge */}
        <span className={`hidden sm:inline-flex text-[11px] font-bold px-2.5 py-1 rounded-full ${badge.cls}`}>
          {badge.label}
        </span>

        {/* Settings */}
        <button
          onClick={() => navigate("/client/profile")}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          title={t("clientDashboard.settings")}
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* New diagnostic CTA */}
        <button
          onClick={handleNewAssessment}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">{t("clientLayout.newDiagnostic")}</span>
        </button>
      </div>
    </header>
  );
};

export default ClientHeader;
