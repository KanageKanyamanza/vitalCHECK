import React from "react";

const KPICard = ({ icon: Icon, label, value, subLabel, accentClass = "border-navy", action, delay = 0 }) => (
  <div
    className={`bg-white rounded-xl shadow-sm border-l-4 ${accentClass} p-5 flex flex-col gap-3 transition-shadow hover:shadow-md`}
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">{label}</p>
        <div className="mt-1 text-3xl font-bold text-gray-900 leading-tight">{value}</div>
        {subLabel && <p className="mt-1 text-sm text-gray-500">{subLabel}</p>}
      </div>
      {Icon && (
        <div className="shrink-0 w-11 h-11 rounded-lg bg-gray-50 flex items-center justify-center">
          <Icon className="w-5 h-5 text-gray-500" />
        </div>
      )}
    </div>
    {action && <div className="pt-1 border-t border-gray-100">{action}</div>}
  </div>
);

export default KPICard;
