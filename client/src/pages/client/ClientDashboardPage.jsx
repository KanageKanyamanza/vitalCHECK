import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  FileText,
  Download,
  TrendingUp,
  Calendar,
  CreditCard,
  LayoutDashboard,
  BarChart2,
  Plus,
  Lock,
  Zap,
} from "lucide-react";
import { useClientAuth } from "../../context/ClientAuthContext";
import { useAssessment } from "../../context/AssessmentContext";
import axios from "axios";
import toast from "react-hot-toast";

import { API_BASE_URL as API_URL } from "../../services/api";
import ClientLayout from "../../components/client/ClientLayout";
import KPICard from "../../components/client/KPICard";
import ScoreEvolutionChart from "../../components/premium/ScoreEvolutionChart";
import DiagnosticComparator from "../../components/premium/DiagnosticComparator";
import PremiumExportButton from "../../components/premium/PremiumExportButton";

const PAID_PLANS = ["standard", "premium", "diagnostic"];

// ─── Fade-in wrapper ───────────────────────────────────────────────────────────
const FadeIn = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay }}
  >
    {children}
  </motion.div>
);

// ─── Main component ────────────────────────────────────────────────────────────
const ClientDashboardPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, logout, loading: authLoading } = useClientAuth();
  const { dispatch: assessmentDispatch } = useAssessment();

  const [assessments, setAssessments] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [downloadingReport, setDownloadingReport] = useState(null);

  // Premium dashboard state
  const [premiumHistory, setPremiumHistory] = useState([]);
  const [comparatorA, setComparatorA] = useState(null);
  const [comparatorB, setComparatorB] = useState(null);

  const isPaidPlan =
    user?.subscription?.status === "active" &&
    PAID_PLANS.includes(user?.subscription?.plan);

  // ── Filtered & stats ─────────────────────────────────────────────────────────
  const filteredPayments = payments.filter((p) => {
    if (paymentFilter === "all") return true;
    if (paymentFilter === "active") return p.status === "pending";
    if (paymentFilter === "completed")
      return p.status === "completed" || p.status === "processed";
    return true;
  });

  const paymentStats = {
    total: payments.length,
    active: payments.filter((p) => p.status === "pending").length,
    completed: payments.filter(
      (p) => p.status === "completed" || p.status === "processed"
    ).length,
    failed: payments.filter((p) => p.status === "failed").length,
    totalAmount: payments.reduce((sum, p) => sum + (p.amount || 0), 0),
  };

  // ── Data loading ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    } else if (user) {
      loadDashboardData();
    }
  }, [user, authLoading, navigate]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("clientToken");

      if (!user?.id) {
        toast.error("Erreur: ID utilisateur manquant");
        return;
      }

      const [assessmentsRes, paymentsRes] = await Promise.all([
        axios.get(`${API_URL}/assessments/user/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/client-auth/payments`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setAssessments(assessmentsRes.data.assessments || []);
      setPayments(paymentsRes.data.payments || []);

      // Load premium history if paid plan
      if (user?.subscription?.plan && user.subscription.plan !== "free") {
        try {
          const premiumRes = await axios.get(
            `${API_URL}/premium-dashboard/history`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setPremiumHistory(premiumRes.data.assessments || []);
        } catch {
          // 403 = subscription not yet active, silently ignore
        }
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      toast.error("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  const handleNewAssessment = () => {
    assessmentDispatch({ type: "CLEAR_STORAGE" });
    navigate("/diagnostic");
  };

  const handleDownloadReport = async (assessmentId) => {
    setDownloadingReport(assessmentId);
    try {
      const token = localStorage.getItem("clientToken");
      const response = await axios.get(
        `${API_URL}/reports/download/${assessmentId}`,
        { headers: { Authorization: `Bearer ${token}` }, responseType: "blob" }
      );
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `vitalCHECK-Report-${new Date().toISOString().split("T")[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Rapport téléchargé avec succès !");
    } catch {
      toast.error("Erreur lors du téléchargement du rapport");
    } finally {
      setDownloadingReport(null);
    }
  };

  // ── Loading state ─────────────────────────────────────────────────────────────
  if (authLoading || loading) {
    return (
      <ClientLayout>
        <div className="flex items-center justify-center h-full min-h-[60vh]">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#13294B]" />
        </div>
      </ClientLayout>
    );
  }

  // ── Subscription badge config ─────────────────────────────────────────────────
  const plan = user?.subscription?.plan || "free";

  return (
    <ClientLayout>
      <div className="p-5 md:p-7 space-y-7 max-w-7xl mx-auto">

        {/* ── KPI Cards ──────────────────────────────────────────────────────── */}
        <FadeIn delay={0}>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {/* Subscription */}
            <KPICard
              icon={CreditCard}
              label={t("clientDashboard.subscription.title")}
              value={plan.toUpperCase()}
              subLabel={
                user?.subscription?.status === "active"
                  ? t("clientDashboard.subscription.active")
                  : t("clientDashboard.subscription.inactive")
              }
              accentClass="border-l-[#13294B]"
              action={
                plan !== "free" ? (
                  <button
                    onClick={() => navigate("/pricing")}
                    className="text-xs text-[#13294B] hover:text-[#1a3a66] font-medium"
                  >
                    {t("clientDashboard.subscription.manage")} →
                  </button>
                ) : (
                  <button
                    onClick={() => navigate("/pricing")}
                    className="text-xs text-[#F5A83C] hover:text-amber-600 font-semibold"
                  >
                    {t("clientLayout.upgradeCTA")} →
                  </button>
                )
              }
            />

            {/* Diagnostics */}
            <KPICard
              icon={FileText}
              label={t("clientDashboard.assessments.title")}
              value={assessments.length}
              subLabel={t("clientDashboard.assessments.total")}
              accentClass="border-l-blue-500"
              action={
                <button
                  onClick={handleNewAssessment}
                  className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  <Plus className="w-3 h-3" />
                  {t("clientDashboard.assessments.new")}
                </button>
              }
            />

            {/* Payments */}
            <KPICard
              icon={TrendingUp}
              label={t("clientDashboard.payments.title")}
              value={payments.length}
              subLabel={t("clientDashboard.payments.total")}
              accentClass="border-l-emerald-500"
            />
          </div>
        </FadeIn>

        {/* ── Premium section (active subscribers with data) ─────────────────── */}
        {isPaidPlan && premiumHistory.length > 0 && (
          <FadeIn delay={0.08}>
            <div>
              {/* Section header */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#13294B] to-[#1a3a66] flex items-center justify-center shadow-sm">
                    <BarChart2 className="w-4 h-4 text-[#F5A83C]" />
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900">
                      {t("premiumDashboard.title")}
                    </h2>
                    <p className="text-xs text-gray-500">
                      {t("premiumDashboard.subtitle")}
                    </p>
                  </div>
                </div>
                <PremiumExportButton t={t} />
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Score evolution */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    {t("premiumDashboard.evolution.title")}
                  </h3>
                  <ScoreEvolutionChart assessments={premiumHistory} t={t} />
                </div>

                {/* Diagnostic comparator */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <BarChart2 className="w-4 h-4 text-blue-600" />
                    {t("premiumDashboard.comparator.title")}
                  </h3>
                  <DiagnosticComparator
                    assessments={premiumHistory}
                    selectedA={comparatorA}
                    selectedB={comparatorB}
                    onSelectA={setComparatorA}
                    onSelectB={setComparatorB}
                    t={t}
                  />
                </div>
              </div>
            </div>
          </FadeIn>
        )}

        {/* ── Premium upsell (free users) ────────────────────────────────────── */}
        {!isPaidPlan && (
          <FadeIn delay={0.08}>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-[#13294B] via-[#1a3a66] to-[#F5A83C]" />
              <div className="p-8 flex flex-col sm:flex-row items-center gap-6">
                <div className="w-14 h-14 rounded-xl bg-[#13294B]/8 flex items-center justify-center shrink-0">
                  <Lock className="w-6 h-6 text-[#13294B]/60" />
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="font-bold text-gray-900 mb-1">
                    {t("clientLayout.premiumUpsell.title")}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4 max-w-md">
                    {t("clientLayout.premiumUpsell.description")}
                  </p>
                  <button
                    onClick={() => navigate("/pricing")}
                    className="inline-flex items-center gap-2 bg-[#13294B] hover:bg-[#1a3a66] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
                  >
                    <Zap className="w-4 h-4 text-[#F5A83C]" />
                    {t("clientLayout.premiumUpsell.cta")}
                  </button>
                </div>
              </div>
            </div>
          </FadeIn>
        )}

        {/* ── Historique diagnostics + paiements (en dernier) ────────────────── */}
        <FadeIn delay={0.15}>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

            {/* Assessments history */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#13294B]" />
                <h2 className="font-semibold text-gray-900">
                  {t("clientDashboard.history.title")}
                </h2>
                <span className="ml-auto text-sm font-bold text-gray-500 tabular-nums">
                  {assessments.length}
                </span>
              </div>

              <div className="p-6">
                {assessments.length === 0 ? (
                  <div className="text-center py-10">
                    <FileText className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm mb-4">
                      {t("clientDashboard.history.noAssessments")}
                    </p>
                    <button
                      onClick={handleNewAssessment}
                      className="bg-[#13294B] hover:bg-[#1a3a66] text-white px-5 py-2 rounded-lg text-sm transition-colors"
                    >
                      {t("clientDashboard.history.startFirst")}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                    {assessments.map((assessment, idx) => (
                      <motion.div
                        key={assessment._id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.04 }}
                        className="border border-gray-100 rounded-lg p-4 hover:shadow-sm transition-shadow"
                      >
                        <div className="flex flex-wrap items-center gap-3 justify-between">
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 text-sm truncate">
                              {t("clientDashboard.history.evaluation")} —{" "}
                              {new Date(
                                assessment.completedAt || assessment.startedAt
                              ).toLocaleDateString("fr-FR")}
                            </p>
                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(
                                  assessment.completedAt || assessment.startedAt
                                ).toLocaleDateString("fr-FR")}
                              </span>
                              <span className="font-semibold text-[#13294B]">
                                {t("clientDashboard.history.score")}:{" "}
                                {assessment.overallScore?.toFixed(0) ?? "N/A"}/100
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2 shrink-0">
                            <button
                              onClick={() =>
                                navigate(`/results?id=${assessment._id}`)
                              }
                              className="flex items-center gap-1 px-3 py-1.5 text-xs text-[#13294B] border border-[#13294B] hover:bg-[#13294B]/5 rounded-lg transition-colors"
                            >
                              <FileText className="w-3 h-3" />
                              {t("clientDashboard.history.viewReport")}
                            </button>
                            <button
                              onClick={() =>
                                handleDownloadReport(assessment._id)
                              }
                              disabled={downloadingReport === assessment._id}
                              className="flex items-center gap-1 px-3 py-1.5 text-xs text-emerald-600 border border-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors disabled:opacity-50"
                            >
                              {downloadingReport === assessment._id ? (
                                <div className="w-3 h-3 border border-emerald-600 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Download className="w-3 h-3" />
                              )}
                              {downloadingReport === assessment._id
                                ? t("clientDashboard.history.downloading")
                                : t("clientDashboard.history.downloadPDF")}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Payments history */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <div className="flex flex-wrap items-center gap-3 justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-emerald-600" />
                    <h2 className="font-semibold text-gray-900">
                      {t("clientDashboard.paymentsHistory.title")}
                    </h2>
                  </div>
                  {/* Filter pills */}
                  <div className="flex gap-1.5 text-xs">
                    {[
                      { key: "all", label: t("clientDashboard.paymentsHistory.all"), count: paymentStats.total },
                      { key: "active", label: t("clientDashboard.paymentsHistory.active"), count: paymentStats.active },
                      { key: "completed", label: t("clientDashboard.paymentsHistory.completed"), count: paymentStats.completed },
                    ].map(({ key, label, count }) => (
                      <button
                        key={key}
                        onClick={() => setPaymentFilter(key)}
                        className={`px-2.5 py-1 rounded-full transition-colors whitespace-nowrap ${
                          paymentFilter === key
                            ? "bg-[#13294B] text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {label} ({count})
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stats mini-row */}
                {payments.length > 0 && (
                  <div className="mt-3 grid grid-cols-4 gap-2">
                    {[
                      { label: t("clientDashboard.paymentsHistory.stats.total"), value: paymentStats.total, cls: "text-blue-700 bg-blue-50" },
                      { label: t("clientDashboard.paymentsHistory.stats.active"), value: paymentStats.active, cls: "text-amber-700 bg-amber-50" },
                      { label: t("clientDashboard.paymentsHistory.stats.completed"), value: paymentStats.completed, cls: "text-emerald-700 bg-emerald-50" },
                      { label: t("clientDashboard.paymentsHistory.stats.totalAmount"), value: `$${paymentStats.totalAmount}`, cls: "text-purple-700 bg-purple-50" },
                    ].map(({ label, value, cls }) => (
                      <div key={label} className={`rounded-lg p-2 text-center ${cls}`}>
                        <div className="text-xs font-medium leading-none mb-0.5 truncate">{label}</div>
                        <div className="font-bold text-sm tabular-nums">{value}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-6">
                {payments.length === 0 ? (
                  <div className="text-center py-10">
                    <CreditCard className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm mb-4">Aucun paiement</p>
                    <button
                      onClick={() => navigate("/pricing")}
                      className="bg-[#13294B] hover:bg-[#1a3a66] text-white px-5 py-2 rounded-lg text-sm transition-colors"
                    >
                      Voir nos offres
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto max-h-[360px] overflow-y-auto">
                    <table className="min-w-full text-sm">
                      <thead className="sticky top-0 bg-white">
                        <tr className="text-left border-b border-gray-100">
                          <th className="pb-2 pr-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                            {t("clientDashboard.paymentsHistory.date")}
                          </th>
                          <th className="pb-2 pr-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                            {t("clientDashboard.paymentsHistory.plan")}
                          </th>
                          <th className="pb-2 pr-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                            {t("clientDashboard.paymentsHistory.amount")}
                          </th>
                          <th className="pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                            {t("clientDashboard.paymentsHistory.status")}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {filteredPayments.length > 0 ? (
                          filteredPayments.map((payment) => (
                            <tr key={payment._id} className="hover:bg-gray-50 transition-colors">
                              <td className="py-2.5 pr-4 text-gray-600">
                                {new Date(payment.createdAt).toLocaleDateString("fr-FR")}
                              </td>
                              <td className="py-2.5 pr-4 font-medium text-gray-900">
                                {payment.planName}
                              </td>
                              <td className="py-2.5 pr-4 tabular-nums text-gray-600">
                                ${payment.amount} {payment.currency}
                              </td>
                              <td className="py-2.5">
                                <span
                                  className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${
                                    payment.status === "completed" ||
                                    payment.status === "processed"
                                      ? "bg-emerald-100 text-emerald-700"
                                      : payment.status === "pending"
                                      ? "bg-amber-100 text-amber-700"
                                      : "bg-red-100 text-red-700"
                                  }`}
                                >
                                  {payment.status === "completed" ||
                                  payment.status === "processed"
                                    ? t("clientDashboard.paymentsHistory.completed")
                                    : payment.status === "pending"
                                    ? t("clientDashboard.paymentsHistory.pending")
                                    : t("clientDashboard.paymentsHistory.failed")}
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="py-8 text-center text-gray-400">
                              {t("clientDashboard.paymentsHistory.noPayments")}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </FadeIn>


      </div>
    </ClientLayout>
  );
};

export default ClientDashboardPage;
