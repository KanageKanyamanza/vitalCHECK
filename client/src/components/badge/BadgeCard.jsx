import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Shield, Download } from "lucide-react";
import logoIcon from "/android-icon-96x96.png";

// Colors matching UBB identity
const NAVY = "#13294B";
const GOLD = "#F5A83C";

/**
 * Renders the badge visual.
 * The parent wraps this in a div with id="badge-export-target" to capture via html2canvas.
 */
const BadgeCard = ({ companyName, year, verifyUrl }) => {
  const { t } = useTranslation();
  const fullUrl = `${window.location.origin}${verifyUrl}`;

  return (
    <div
      id="badge-export-target"
      style={{
        background: NAVY,
        borderRadius: 16,
        padding: "28px 32px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 14,
        width: 320,
        fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
        color: "#fff",
        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
      }}
    >
      {/* Top row: logo + brand */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <img src={logoIcon} alt="VitalCHECK" style={{ width: 36, height: 36, borderRadius: 8 }} />
        <div style={{ lineHeight: 1.15 }}>
          <div style={{ fontWeight: 800, fontSize: 15, letterSpacing: 1, color: "#fff" }}>
            VitalCHECK
          </div>
          <div style={{ fontSize: 10, color: GOLD, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1.5 }}>
            Enterprise Health
          </div>
        </div>
      </div>

      {/* Gold divider */}
      <div style={{ width: "100%", height: 2, background: GOLD, borderRadius: 2 }} />

      {/* Shield icon */}
      <div style={{
        width: 56, height: 56, borderRadius: "50%",
        background: `${GOLD}22`,
        border: `2px solid ${GOLD}`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Shield style={{ width: 28, height: 28, color: GOLD }} />
      </div>

      {/* Label */}
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 11, color: GOLD, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 }}>
          {t("badge.generatedBy")}
        </div>
        <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", lineHeight: 1.2 }}>
          {companyName}
        </div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", marginTop: 4 }}>
          {t("badge.diagnosticOf")} {year}
        </div>
      </div>

      {/* Gold divider */}
      <div style={{ width: "60%", height: 1, background: `${GOLD}55` }} />

      {/* Verify URL */}
      <div style={{
        fontSize: 9, color: "rgba(255,255,255,0.5)",
        wordBreak: "break-all", textAlign: "center", lineHeight: 1.4,
      }}>
        {fullUrl}
      </div>
    </div>
  );
};

/**
 * Wrapper with download button — renders the badge + triggers html2canvas export.
 */
export const BadgeDownloader = ({ companyName, year, verifyUrl }) => {
  const { t } = useTranslation();
  const ref = useRef(null);

  const handleDownload = async () => {
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(ref.current, {
        backgroundColor: NAVY,
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const link = document.createElement("a");
      link.download = `vitalcheck-badge-${companyName.replace(/\s+/g, "-").toLowerCase()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Badge download failed:", err);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div ref={ref}>
        <BadgeCard companyName={companyName} year={year} verifyUrl={verifyUrl} />
      </div>
      <button
        onClick={handleDownload}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium transition-colors"
      >
        <Download className="w-4 h-4" />
        {t("badge.downloadBadge")}
      </button>
    </div>
  );
};

export default BadgeCard;
