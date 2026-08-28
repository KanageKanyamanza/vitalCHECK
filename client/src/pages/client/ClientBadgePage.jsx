import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  Shield, ShieldCheck, ShieldOff, Copy, ExternalLink,
  Lock, Zap, ToggleLeft, ToggleRight, AlertTriangle,
} from "lucide-react";
import { useClientAuth } from "../../context/ClientAuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import { API_BASE_URL as API_URL } from "../../services/api";
import ClientLayout from "../../components/client/ClientLayout";
import { BadgeDownloader } from "../../components/badge/BadgeCard";

const PAID_PLANS = ["standard", "premium", "diagnostic"];

const STATUS_CONFIG = {
  valid:    { icon: ShieldCheck, cls: "text-green-500",  bg: "bg-green-50",  border: "border-green-200" },
  outdated: { icon: AlertTriangle, cls: "text-amber-500", bg: "bg-amber-50",  border: "border-amber-200" },
  expired:  { icon: ShieldOff,  cls: "text-red-400",    bg: "bg-red-50",    border: "border-red-200"   },
  revoked:  { icon: ShieldOff,  cls: "text-gray-400",   bg: "bg-gray-50",   border: "border-gray-200"  },
  inactive: { icon: Shield,     cls: "text-gray-300",   bg: "bg-gray-50",   border: "border-gray-100"  },
};

const ClientBadgePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useClientAuth();

  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState(null);
  const [revoking, setRevoking] = useState(null);
  const [toggling, setToggling] = useState(null);
  const [selected, setSelected] = useState(null); // id of assessment whose badge preview is shown

  const isPaidPlan =
    user?.subscription?.status === "active" &&
    PAID_PLANS.includes(user?.subscription?.plan);

  useEffect(() => {
    if (!authLoading && !user) navigate("/login");
    else if (user) loadAssessments();
  }, [user, authLoading]);

  const token = () => localStorage.getItem("clientToken");
  const headers = () => ({ Authorization: `Bearer ${token()}` });

  const loadAssessments = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/badge/list`, { headers: headers() });
      setAssessments(res.data.assessments || []);
    } catch {
      toast.error("Erreur de chargement des diagnostics");
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async (assessmentId) => {
    setActivating(assessmentId);
    try {
      await axios.post(
        `${API_URL}/badge/activate`,
        { assessmentId, showScore: false },
        { headers: headers() }
      );
      toast.success(t("badge.activated"));
      await loadAssessments();
      setSelected(assessmentId);
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur activation badge");
    } finally {
      setActivating(null);
    }
  };

  const handleRevoke = async (assessmentId) => {
    if (!window.confirm(t("badge.revokeConfirm"))) return;
    setRevoking(assessmentId);
    try {
      await axios.delete(`${API_URL}/badge/${assessmentId}/revoke`, { headers: headers() });
      toast.success(t("badge.revoked"));
      await loadAssessments();
      setSelected(null);
    } catch {
      toast.error("Erreur révocation badge");
    } finally {
      setRevoking(null);
    }
  };

  const handleToggleScore = async (assessmentId, currentShowScore) => {
    setToggling(assessmentId);
    try {
      await axios.patch(
        `${API_URL}/badge/${assessmentId}/settings`,
        { showScore: !currentShowScore },
        { headers: headers() }
      );
      await loadAssessments();
    } catch {
      toast.error("Erreur mise à jour paramètre");
    } finally {
      setToggling(null);
    }
  };

  const handleCopyLink = (verifyUrl) => {
    navigator.clipboard.writeText(`${window.location.origin}${verifyUrl}`);
    toast.success(t("badge.linkCopied"));
  };

  if (authLoading || loading) {
    return (
      <ClientLayout>
        <div className="flex items-center justify-center h-full min-h-[60vh]">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500" />
        </div>
      </ClientLayout>
    );
  }

  // ── Non-premium upsell ───────────────────────────────────────────────────────
  if (!isPaidPlan) {
    return (
      <ClientLayout>
        <div className="p-5 md:p-7 max-w-xl mx-auto mt-10">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-primary-900 via-primary-700 to-accent-500" />
            <div className="p-10 flex flex-col items-center text-center gap-5">
              <div className="w-16 h-16 rounded-xl bg-primary-50 flex items-center justify-center">
                <Lock className="w-7 h-7 text-primary-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-2">{t("badge.upsell.title")}</h2>
                <p className="text-sm text-gray-500 max-w-sm">{t("badge.upsell.desc")}</p>
              </div>
              <button
                onClick={() => navigate("/pricing")}
                className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors shadow-sm"
              >
                <Zap className="w-4 h-4 text-accent-400" />
                {t("badge.upsell.cta")}
              </button>
            </div>
          </div>
        </div>
      </ClientLayout>
    );
  }

  const selectedAssessment = assessments.find((a) => a.id === selected);

  return (
    <ClientLayout>
      <div className="p-5 md:p-7 space-y-6 max-w-5xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-900 to-primary-700 flex items-center justify-center shadow-sm">
            <Shield className="w-5 h-5 text-accent-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{t("badge.pageTitle")}</h1>
            <p className="text-xs text-gray-500">{t("badge.pageSubtitle")}</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

          {/* ── Left: assessment list ─────────────────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-800">Vos diagnostics</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {assessments.length === 0 && (
                <p className="text-sm text-gray-400 p-6">{t("badge.noBadgeDesc")}</p>
              )}
              {assessments.map((a) => {
                const cfg = STATUS_CONFIG[a.badgeStatus] || STATUS_CONFIG.inactive;
                const StatusIcon = cfg.icon;
                const isActive = a.badge?.active && !a.badge?.revokedAt;
                const isSelected = selected === a.id;

                return (
                  <div
                    key={a.id}
                    onClick={() => isActive && setSelected(isSelected ? null : a.id)}
                    className={`p-4 transition-colors ${isActive ? "cursor-pointer hover:bg-gray-50" : ""} ${isSelected ? "bg-primary-50" : ""}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${cfg.bg} border ${cfg.border}`}>
                          <StatusIcon className={`w-4 h-4 ${cfg.cls}`} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {a.companyName}
                          </p>
                          <p className="text-xs text-gray-400">
                            {a.completedAt
                              ? new Date(a.completedAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })
                              : "—"}
                            {a.overallScore != null && ` · ${a.overallScore.toFixed(0)}/100`}
                          </p>
                          <span className={`text-[10px] font-bold uppercase tracking-wide ${cfg.cls}`}>
                            {t(`badge.status.${a.badgeStatus}`)}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        {!isActive ? (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleActivate(a.id); }}
                            disabled={activating === a.id}
                            className="text-xs px-3 py-1.5 rounded-lg bg-primary-500 hover:bg-primary-600 text-white font-medium transition-colors disabled:opacity-50"
                          >
                            {activating === a.id ? "..." : t("badge.activate")}
                          </button>
                        ) : (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleRevoke(a.id); }}
                            disabled={revoking === a.id}
                            className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 font-medium transition-colors disabled:opacity-50"
                          >
                            {revoking === a.id ? "..." : t("badge.revoke")}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Settings when active and selected */}
                    {isActive && isSelected && (
                      <div className="mt-3 pt-3 border-t border-gray-100 space-y-3">
                        {/* showScore toggle */}
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-gray-700">{t("badge.showScore")}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">{t("badge.showScoreHint")}</p>
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleToggleScore(a.id, a.badge?.showScore); }}
                            disabled={toggling === a.id}
                            className="shrink-0 transition-colors"
                          >
                            {a.badge?.showScore
                              ? <ToggleRight className="w-8 h-8 text-primary-500" />
                              : <ToggleLeft className="w-8 h-8 text-gray-300" />}
                          </button>
                        </div>

                        {/* Link actions */}
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleCopyLink(a.verifyUrl); }}
                            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            {t("badge.copyLink")}
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); window.open(a.verifyUrl, "_blank"); }}
                            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            {t("badge.verifyPage")}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* ── Right: badge preview + download ──────────────────────────────── */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="bg-white rounded-xl shadow-sm flex flex-col items-center justify-center p-8 min-h-[320px]">
            {selectedAssessment ? (
              <BadgeDownloader
                companyName={selectedAssessment.companyName}
                year={selectedAssessment.completedAt
                  ? new Date(selectedAssessment.completedAt).getFullYear()
                  : new Date().getFullYear()}
                verifyUrl={selectedAssessment.verifyUrl}
              />
            ) : (
              <div className="text-center text-gray-400">
                <Shield className="w-14 h-14 mx-auto mb-3 text-gray-200" />
                <p className="text-sm">{t("badge.noBadgeYet")}</p>
                <p className="text-xs mt-1">{t("badge.noBadgeDesc")}</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </ClientLayout>
  );
};

export default ClientBadgePage;
