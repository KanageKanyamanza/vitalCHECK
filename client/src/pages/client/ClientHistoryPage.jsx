import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FileText, Download, Calendar, Plus } from "lucide-react";
import { useClientAuth } from "../../context/ClientAuthContext";
import { useAssessment } from "../../context/AssessmentContext";
import axios from "axios";
import toast from "react-hot-toast";
import { API_BASE_URL as API_URL } from "../../services/api";
import ClientLayout from "../../components/client/ClientLayout";

const ClientHistoryPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useClientAuth();
  const { dispatch: assessmentDispatch } = useAssessment();

  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingReport, setDownloadingReport] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    } else if (user) {
      loadAssessments();
    }
  }, [user, authLoading, navigate]);

  const loadAssessments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("clientToken");
      if (!user?.id) return;
      const res = await axios.get(`${API_URL}/assessments/user/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAssessments(res.data.assessments || []);
    } catch {
      toast.error("Erreur lors du chargement des évaluations");
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

  if (authLoading || loading) {
    return (
      <ClientLayout>
        <div className="flex items-center justify-center h-full min-h-[60vh]">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500" />
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <div className="p-5 md:p-7 max-w-4xl mx-auto">
        {/* Page header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {t("clientLayout.nav.history")}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {assessments.length} {t("clientDashboard.assessments.total")}
            </p>
          </div>
          <button
            onClick={handleNewAssessment}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            {t("clientDashboard.assessments.new")}
          </button>
        </div>

        {/* List */}
        {assessments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <FileText className="w-14 h-14 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 mb-5">
              {t("clientDashboard.history.noAssessments")}
            </p>
            <button
              onClick={handleNewAssessment}
              className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2.5 rounded-lg text-sm transition-colors"
            >
              {t("clientDashboard.history.startFirst")}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {assessments.map((assessment, idx) => (
              <motion.div
                key={assessment._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-wrap items-center gap-4 justify-between">
                  {/* Info */}
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900">
                      {t("clientDashboard.history.evaluation")} —{" "}
                      {new Date(
                        assessment.completedAt || assessment.startedAt
                      ).toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </h3>
                    <div className="flex flex-wrap gap-4 mt-1.5 text-sm">
                      <span className="flex items-center gap-1 text-gray-400">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(
                          assessment.completedAt || assessment.startedAt
                        ).toLocaleDateString("fr-FR")}
                      </span>
                      <span className="font-bold text-primary-600">
                        {t("clientDashboard.history.score")}:{" "}
                        {assessment.overallScore != null
                          ? `${assessment.overallScore.toFixed(0)}/100`
                          : "N/A"}
                      </span>
                      {assessment.sector && (
                        <span className="text-gray-400 capitalize">
                          {assessment.sector}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => navigate(`/results?id=${assessment._id}`)}
                      className="flex items-center gap-1.5 px-4 py-2 text-sm text-primary-600 border border-primary-500 hover:bg-primary-50 rounded-lg transition-colors"
                    >
                      <FileText className="w-4 h-4" />
                      {t("clientDashboard.history.viewReport")}
                    </button>
                    <button
                      onClick={() => handleDownloadReport(assessment._id)}
                      disabled={downloadingReport === assessment._id}
                      className="flex items-center gap-1.5 px-4 py-2 text-sm text-emerald-600 border border-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {downloadingReport === assessment._id ? (
                        <div className="w-4 h-4 border border-emerald-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Download className="w-4 h-4" />
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
    </ClientLayout>
  );
};

export default ClientHistoryPage;
