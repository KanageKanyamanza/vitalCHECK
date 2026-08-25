import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const PILLAR_COLORS = ["#00751B", "#F59E0B", "#3B82F6", "#EC4899", "#8B5CF6"];

const ScoreEvolutionChart = ({ assessments, t }) => {
  const { chartData, pillarNames } = useMemo(() => {
    if (!assessments || assessments.length === 0) return { chartData: [], pillarNames: [] };

    // Collect all unique pillar names across all assessments
    const allPillarNames = [];
    assessments.forEach((a) => {
      (a.pillarScores || []).forEach((p) => {
        if (p.pillarName && !allPillarNames.includes(p.pillarName)) {
          allPillarNames.push(p.pillarName);
        }
      });
    });

    const data = assessments.map((a, i) => {
      const point = {
        name:
          assessments.length === 1
            ? new Date(a.completedAt).toLocaleDateString("fr-FR")
            : i === 0
            ? new Date(a.completedAt).toLocaleDateString("fr-FR")
            : `#${i + 1}`,
        date: new Date(a.completedAt).toLocaleDateString("fr-FR"),
        global: Math.round(a.overallScore || 0),
      };
      allPillarNames.forEach((name) => {
        const p = (a.pillarScores || []).find((ps) => ps.pillarName === name);
        point[name] = p ? Math.round(p.score) : null;
      });
      return point;
    });

    return { chartData: data, pillarNames: allPillarNames };
  }, [assessments]);

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
        {t("premiumDashboard.evolution.noData")}
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    const item = payload[0]?.payload;
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg text-xs">
        <p className="font-semibold text-gray-700 mb-1">{item?.date}</p>
        {payload.map((entry) => (
          <p key={entry.dataKey} style={{ color: entry.color }}>
            {entry.name}: <span className="font-bold">{entry.value}/100</span>
          </p>
        ))}
      </div>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData} margin={{ top: 8, right: 16, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
        <Tooltip content={<CustomTooltip />} />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        <Line
          type="monotone"
          dataKey="global"
          name={t("premiumDashboard.evolution.globalScore")}
          stroke="#00751B"
          strokeWidth={2.5}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
        {pillarNames.map((name, i) => (
          <Line
            key={name}
            type="monotone"
            dataKey={name}
            name={name}
            stroke={PILLAR_COLORS[i % PILLAR_COLORS.length]}
            strokeWidth={1.5}
            strokeDasharray="4 2"
            dot={{ r: 3 }}
            connectNulls
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ScoreEvolutionChart;
