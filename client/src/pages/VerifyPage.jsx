import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  ShieldCheck, ShieldOff, AlertTriangle, Shield,
  Building2, CalendarDays, BarChart2, ExternalLink,
} from "lucide-react";
import axios from "axios";
import { API_BASE_URL as API_URL } from "../services/api";
import SEOHead from "../components/seo/SEOHead";
import logoIcon from "/android-icon-96x96.png";

const DARK_GREEN = "#14532d";
const YELLOW = "#F4C542";

const STATUS_UI = {
  valid: {
    Icon: ShieldCheck,
    iconColor: "#22c55e",
    bg: "bg-green-50",
    border: "border-green-200",
    titleKey: "verify.status.valid",
    descKey: "verify.status.validDesc",
  },
  outdated: {
    Icon: AlertTriangle,
    iconColor: "#f59e0b",
    bg: "bg-amber-50",
    border: "border-amber-200",
    titleKey: "verify.status.outdated",
    descKey: "verify.status.outdatedDesc",
  },
  expired: {
    Icon: ShieldOff,
    iconColor: "#f87171",
    bg: "bg-red-50",
    border: "border-red-200",
    titleKey: "verify.status.expired",
    descKey: "verify.status.expiredDesc",
  },
  revoked: {
    Icon: ShieldOff,
    iconColor: "#9ca3af",
    bg: "bg-gray-50",
    border: "border-gray-200",
    titleKey: "verify.status.revoked",
    descKey: "verify.status.revokedDesc",
  },
  not_found: {
    Icon: Shield,
    iconColor: "#9ca3af",
    bg: "bg-gray-50",
    border: "border-gray-200",
    titleKey: "verify.status.notFound",
    descKey: "verify.status.notFoundDesc",
  },
};

const LEVEL_LABELS_FR = {
  critique: "Critique",
  vulnerable: "Vulnérable",
  stable: "Stable",
  pret: "Prêt",
  haute_performance: "Haute performance",
};

const VerifyPage = () => {
  const { token } = useParams();
  const { t, i18n } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [publicBadges, setPublicBadges] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`${API_URL}/verify/${token}`);
        setData(res.data);
      } catch (err) {
        setData({ found: false, status: "not_found" });
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [token]);

  useEffect(() => {
    axios.get(`${API_URL}/verify/public`)
      .then((r) => setPublicBadges(r.data?.companies || []))
      .catch(() => {});
  }, []);

  const status = data?.found === false ? "not_found" : data?.status || "not_found";
  const ui = STATUS_UI[status] || STATUS_UI.not_found;
  const { Icon } = ui;

  const lang = i18n.language?.substring(0, 2) || "fr";
  const levelLabel = data?.score?.level
    ? (lang === "fr" ? LEVEL_LABELS_FR[data.score.level] : data.score.level)
    : null;

  return (
    <>
      <SEOHead
        title={`${t("verify.title")} — VitalCHECK`}
        description={t("verify.subtitle")}
        noIndex={true}
      />

      <div className="min-h-screen flex flex-col" style={{ background: "#f4f6fa" }}>
        {/* Header bar */}
        <header
          style={{ background: DARK_GREEN }}
          className="px-6 py-4 flex items-center justify-between"
        >
          <Link to="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
            <img src={logoIcon} alt="VitalCHECK" className="w-8 h-8 rounded-md" />
            <div className="leading-none">
              <span className="font-bold text-white text-sm tracking-wide">VitalCHECK</span>
              <br />
              <span className="text-[10px] font-medium uppercase tracking-widest" style={{ color: YELLOW }}>
                Enterprise Health
              </span>
            </div>
          </Link>
          <span className="text-xs text-white/50">{t("verify.poweredBy")}</span>
        </header>

        {/* Content */}
        <main className="flex-1 flex items-start justify-center px-4 py-12">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500" />
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-lg"
            >
              {/* Main card */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* Top accent */}
                <div className="h-1.5" style={{ background: `linear-gradient(to right, ${DARK_GREEN}, ${YELLOW})` }} />

                <div className="p-8">
                  {/* Status badge */}
                  <div className={`inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl border mb-6 ${ui.bg} ${ui.border}`}>
                    <Icon style={{ width: 20, height: 20, color: ui.iconColor }} />
                    <div>
                      <p className="text-sm font-bold text-gray-900">{t(ui.titleKey)}</p>
                      <p className="text-xs text-gray-500">{t(ui.descKey)}</p>
                    </div>
                  </div>

                  {/* Company info — only shown when badge was found */}
                  {data?.found && data?.companyName && (
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                          style={{ background: `${DARK_GREEN}12` }}
                        >
                          <Building2 style={{ width: 20, height: 20, color: DARK_GREEN }} />
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">{t("verify.company")}</p>
                          <p className="text-lg font-bold text-gray-900">{data.companyName}</p>
                          {data.sector && (
                            <p className="text-xs text-gray-500 capitalize mt-0.5">{data.sector}</p>
                          )}
                        </div>
                      </div>

                      {data.completedAt && (
                        <div className="flex items-start gap-3">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                            style={{ background: `${DARK_GREEN}12` }}
                          >
                            <CalendarDays style={{ width: 20, height: 20, color: DARK_GREEN }} />
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">{t("verify.date")}</p>
                            <p className="text-base font-semibold text-gray-900">
                              {new Date(data.completedAt).toLocaleDateString(
                                lang === "fr" ? "fr-FR" : "en-US",
                                { day: "numeric", month: "long", year: "numeric" }
                              )}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Score — only if company opted in */}
                      {data.score && (
                        <div className="flex items-start gap-3">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                            style={{ background: `${YELLOW}22` }}
                          >
                            <BarChart2 style={{ width: 20, height: 20, color: YELLOW }} />
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">{t("verify.score")}</p>
                            <p className="text-2xl font-bold text-gray-900">
                              {data.score.overall?.toFixed(0)}
                              <span className="text-sm text-gray-400 font-normal">/100</span>
                            </p>
                            {levelLabel && (
                              <p className="text-xs text-gray-500 mt-0.5">{levelLabel}</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Divider */}
                  <div className="mt-6 pt-5 border-t border-gray-100 flex items-center justify-between gap-4">
                    <p className="text-xs text-gray-400">{t("verify.subtitle")}</p>
                    <Link
                      to="/"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors hover:opacity-80"
                      style={{ background: DARK_GREEN, color: "#fff" }}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      {t("verify.visitSite")}
                    </Link>
                  </div>
                </div>
              </div>

              {/* VitalCHECK branding below */}
              <p className="text-center text-xs text-gray-400 mt-6">
                {t("verify.poweredBy")} · vitalcheck.co
              </p>
            </motion.div>
          )}
        </main>

        {/* Public badge showcase */}
        {publicBadges.length > 0 && (
          <section className="px-4 py-10 border-t border-gray-200" style={{ background: "#f4f6fa" }}>
            <div className="max-w-3xl mx-auto">
              <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 text-center mb-6">
                {t("verify.showcase.title")}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {publicBadges.map((c) => (
                  <a
                    key={c.token}
                    href={`/verify/${c.token}`}
                    className="group bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:border-green-300 hover:shadow-md transition-all flex flex-col gap-1.5"
                  >
                    {/* Mini shield + name */}
                    <div className="flex items-center gap-2">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: `${DARK_GREEN}12` }}
                      >
                        <ShieldCheck style={{ width: 14, height: 14, color: DARK_GREEN }} />
                      </div>
                      <span className="text-xs font-bold text-gray-900 truncate group-hover:text-green-800 transition-colors">
                        {c.companyName}
                      </span>
                    </div>
                    {/* Sector */}
                    {c.sector && (
                      <p className="text-[10px] text-gray-400 capitalize ml-9 truncate">{c.sector}</p>
                    )}
                    {/* Score pill if opted in */}
                    {c.score?.overall != null && (
                      <div
                        className="self-start ml-9 text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: `${YELLOW}30`, color: "#92610a" }}
                      >
                        {Math.round(c.score.overall)}/100
                      </div>
                    )}
                    {/* Date */}
                    {c.completedAt && (
                      <p className="text-[9px] text-gray-300 ml-9">
                        {new Date(c.completedAt).toLocaleDateString(
                          lang === "fr" ? "fr-FR" : "en-US",
                          { month: "short", year: "numeric" }
                        )}
                      </p>
                    )}
                  </a>
                ))}
              </div>
              <p className="text-center text-[10px] text-gray-300 mt-6">
                {t("verify.showcase.cta")}
              </p>
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default VerifyPage;
