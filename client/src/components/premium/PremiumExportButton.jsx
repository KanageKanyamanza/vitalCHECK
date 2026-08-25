import React, { useState } from "react";
import { Download } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { API_BASE_URL as API_URL } from "../../services/api";

const PremiumExportButton = ({ t }) => {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("clientToken");
      const response = await axios.get(`${API_URL}/premium-dashboard/export`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `vitalCHECK-diagnostics-${new Date().toISOString().split("T")[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(t("premiumDashboard.export.success"));
    } catch (err) {
      console.error("[PremiumExportButton] export error:", err);
      const status = err.response?.status;
      if (status === 401 || status === 403) {
        toast.error(t("premiumDashboard.export.accessDenied"));
      } else {
        toast.error(t("premiumDashboard.export.error"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        <Download className="w-4 h-4" />
      )}
      {loading ? t("premiumDashboard.export.loading") : t("premiumDashboard.export.button")}
    </button>
  );
};

export default PremiumExportButton;
