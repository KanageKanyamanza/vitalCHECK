import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { TrendingUp, BarChart2, Lock, Zap } from "lucide-react";
import { useClientAuth } from "../../context/ClientAuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import { API_BASE_URL as API_URL } from "../../services/api";
import ClientLayout from "../../components/client/ClientLayout";
import ScoreEvolutionChart from "../../components/premium/ScoreEvolutionChart";
import DiagnosticComparator from "../../components/premium/DiagnosticComparator";
import PremiumExportButton from "../../components/premium/PremiumExportButton";

const PAID_PLANS = ["standard", "premium", "diagnostic"];

const ClientAnalyticsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useClientAuth();

  const [premiumHistory, setPremiumHistory] = useState([]);
  const [comparatorA, setComparatorA] = useState(null);
  const [comparatorB, setComparatorB] = useState(null);
  const [loading, setLoading] = useState(true);

  const isPaidPlan =
    user?.subscription?.status === "active" &&
    PAID_PLANS.includes(user?.subscription?.plan);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    } else if (user) {
      loadHistory();
    }
  }, [user, authLoading, navigate]);

  const loadHistory = async () => {
    try {
      setLoading(true);
      if (!isPaidPlan) return;
      const token = localStorage.getItem("clientToken");
      const res = await axios.get(`${API_URL}/premium-dashboard/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPremiumHistory(res.data.assessments || []);
    } catch (err) {
      if (err.response?.status !== 403) {
        toast.error("Erreur lors du chargement de l'analyse");
      }
    } finally {
      setLoading(false);
    }
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

  // ── Non-premium upsell ────────────────────────────────────────────────────────
  if (!isPaidPlan) {
    return (
      <ClientLayout>
        <div className="p-5 md:p-7 max-w-2xl mx-auto mt-10">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-primary-900 via-primary-700 to-accent-500" />
            <div className="p-10 flex flex-col items-center text-center gap-5">
              <div className="w-16 h-16 rounded-xl bg-primary-50 flex items-center justify-center">
                <Lock className="w-7 h-7 text-primary-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-2">
                  {t("clientLayout.premiumUpsell.title")}
                </h2>
                <p className="text-sm text-gray-500 max-w-sm">
                  {t("clientLayout.premiumUpsell.description")}
                </p>
              </div>
              <button
                onClick={() => navigate("/pricing")}
                className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors shadow-sm"
              >
                <Zap className="w-4 h-4 text-accent-400" />
                {t("clientLayout.premiumUpsell.cta")}
              </button>
            </div>
          </div>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <div className="p-5 md:p-7 space-y-6 max-w-7xl mx-auto">

        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-900 to-primary-700 flex items-center justify-center shadow-sm">
              <BarChart2 className="w-5 h-5 text-accent-500" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {t("premiumDashboard.title")}
              </h1>
              <p className="text-xs text-gray-500">{t("premiumDashboard.subtitle")}</p>
            </div>
          </div>
          <PremiumExportButton t={t} />
        </motion.div>

        {/* No data state */}
        {premiumHistory.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <BarChart2 className="w-14 h-14 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 text-sm">
              {t("premiumDashboard.evolution.noData")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Score evolution */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h2 className="text-sm font-semibold text-gray-800 mb-5 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary-500" />
                {t("premiumDashboard.evolution.title")}
              </h2>
              <ScoreEvolutionChart assessments={premiumHistory} t={t} />
            </motion.div>

            {/* Comparator */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h2 className="text-sm font-semibold text-gray-800 mb-5 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-primary-500" />
                {t("premiumDashboard.comparator.title")}
              </h2>
              <DiagnosticComparator
                assessments={premiumHistory}
                selectedA={comparatorA}
                selectedB={comparatorB}
                onSelectA={setComparatorA}
                onSelectB={setComparatorB}
                t={t}
              />
            </motion.div>
          </div>
        )}

      </div>
    </ClientLayout>
  );
};

export default ClientAnalyticsPage;
