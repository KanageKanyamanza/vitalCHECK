import React, { useMemo } from "react";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const DiagnosticComparator = ({ assessments, selectedA, selectedB, onSelectA, onSelectB, t }) => {
  const labelFor = (a) => {
    if (!a) return "";
    return new Date(a.completedAt).toLocaleDateString("fr-FR") + ` (${Math.round(a.overallScore || 0)}/100)`;
  };

  const radarData = useMemo(() => {
    const diagA = assessments.find((a) => a._id === selectedA);
    const diagB = assessments.find((a) => a._id === selectedB);
    if (!diagA && !diagB) return [];

    const allNames = [];
    [diagA, diagB].forEach((d) => {
      if (!d) return;
      (d.pillarScores || []).forEach((p) => {
        if (p.pillarName && !allNames.includes(p.pillarName)) allNames.push(p.pillarName);
      });
    });

    return allNames.map((name) => {
      const pA = diagA ? (diagA.pillarScores || []).find((p) => p.pillarName === name) : null;
      const pB = diagB ? (diagB.pillarScores || []).find((p) => p.pillarName === name) : null;
      return {
        pillar: name.length > 16 ? name.slice(0, 14) + "…" : name,
        fullName: name,
        A: pA ? Math.round(pA.score) : 0,
        B: pB ? Math.round(pB.score) : 0,
      };
    });
  }, [assessments, selectedA, selectedB]);

  const diagA = assessments.find((a) => a._id === selectedA);
  const diagB = assessments.find((a) => a._id === selectedB);

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const item = payload[0]?.payload;
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg text-xs">
        <p className="font-semibold text-gray-700 mb-1">{item?.fullName}</p>
        {diagA && <p className="text-blue-600">Diag A: <span className="font-bold">{item?.A}/100</span></p>}
        {diagB && <p className="text-orange-500">Diag B: <span className="font-bold">{item?.B}/100</span></p>}
      </div>
    );
  };

  return (
    <div>
      {/* Selectors */}
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex-1 min-w-[180px]">
          <label className="block text-xs font-medium text-blue-700 mb-1">
            {t("premiumDashboard.comparator.diagA")}
          </label>
          <select
            value={selectedA || ""}
            onChange={(e) => onSelectA(e.target.value || null)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">{t("premiumDashboard.comparator.choose")}</option>
            {assessments.map((a) => (
              <option key={a._id} value={a._id} disabled={a._id === selectedB}>
                {labelFor(a)}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1 min-w-[180px]">
          <label className="block text-xs font-medium text-orange-600 mb-1">
            {t("premiumDashboard.comparator.diagB")}
          </label>
          <select
            value={selectedB || ""}
            onChange={(e) => onSelectB(e.target.value || null)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">{t("premiumDashboard.comparator.choose")}</option>
            {assessments.map((a) => (
              <option key={a._id} value={a._id} disabled={a._id === selectedA}>
                {labelFor(a)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Chart or placeholder */}
      {radarData.length > 0 && (selectedA || selectedB) ? (
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="pillar" tick={{ fontSize: 10 }} />
            <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 9 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            {diagA && (
              <Radar
                name={t("premiumDashboard.comparator.diagA")}
                dataKey="A"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.2}
              />
            )}
            {diagB && (
              <Radar
                name={t("premiumDashboard.comparator.diagB")}
                dataKey="B"
                stroke="#F97316"
                fill="#F97316"
                fillOpacity={0.2}
              />
            )}
          </RadarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
          {t("premiumDashboard.comparator.selectTwo")}
        </div>
      )}

      {/* Score summary */}
      {(diagA || diagB) && (
        <div className="mt-4 grid grid-cols-2 gap-4">
          {diagA && (
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <div className="text-xs text-blue-600 font-medium mb-1">{t("premiumDashboard.comparator.diagA")}</div>
              <div className="text-2xl font-bold text-blue-800">{Math.round(diagA.overallScore || 0)}/100</div>
              <div className="text-xs text-blue-500">{new Date(diagA.completedAt).toLocaleDateString("fr-FR")}</div>
            </div>
          )}
          {diagB && (
            <div className="bg-orange-50 rounded-lg p-3 text-center">
              <div className="text-xs text-orange-600 font-medium mb-1">{t("premiumDashboard.comparator.diagB")}</div>
              <div className="text-2xl font-bold text-orange-700">{Math.round(diagB.overallScore || 0)}/100</div>
              <div className="text-xs text-orange-400">{new Date(diagB.completedAt).toLocaleDateString("fr-FR")}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DiagnosticComparator;
