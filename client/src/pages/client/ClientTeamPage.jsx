import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  Users, UserPlus, UserMinus, Crown, Mail, Calendar,
  BarChart2, FileText, Send, AlertCircle, CheckCircle,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { API_BASE_URL as API_URL } from "../../services/api";
import ClientLayout from "../../components/client/ClientLayout";

const PAID_PLANS = ["standard", "premium", "diagnostic"];

const ClientTeamPage = () => {
  const { t, i18n } = useTranslation();
  const token = localStorage.getItem("clientToken");
  const lang = i18n.language?.substring(0, 2) || "fr";

  const [team, setTeam] = useState(null);
  const [diagnostics, setDiagnostics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [removingId, setRemovingId] = useState(null);

  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load team first (auto-creates if missing), then diagnostics sequentially
      // so the user.team FK is committed before the diagnostics query reads it.
      const teamRes = await axios.get(`${API_URL}/teams/me`, authHeaders);
      setTeam(teamRes.data.team);

      try {
        const diagRes = await axios.get(`${API_URL}/teams/diagnostics`, authHeaders);
        setDiagnostics(diagRes.data.assessments || []);
      } catch {
        // Non-premium plan: diagnostics endpoint returns 403 — silently ignore
        setDiagnostics([]);
      }
    } catch (err) {
      toast.error(t("common.error"));
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    setInviting(true);
    try {
      const res = await axios.post(`${API_URL}/teams/invite`, { email: inviteEmail }, authHeaders);
      if (res.data.emailSent === false) {
        toast.error(t("team.inviteEmailFailed"));
      } else {
        toast.success(t("team.inviteSent"));
        setInviteEmail("");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || t("common.error"));
    } finally {
      setInviting(false);
    }
  };

  const handleRemove = async (userId, name) => {
    if (!window.confirm(t("team.confirmRemove", { name }))) return;
    setRemovingId(userId);
    try {
      await axios.delete(`${API_URL}/teams/members/${userId}`, authHeaders);
      toast.success(t("team.memberRemoved"));
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || t("common.error"));
    } finally {
      setRemovingId(null);
    }
  };

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", { day: "numeric", month: "short", year: "numeric" }) : "—";

  const LEVEL_LABELS = {
    critique: lang === "fr" ? "Critique" : "Critical",
    vulnerable: lang === "fr" ? "Vulnérable" : "Vulnerable",
    stable: "Stable",
    pret: lang === "fr" ? "Prêt" : "Ready",
    haute_performance: lang === "fr" ? "Haute performance" : "High performance",
  };

  if (loading) {
    return (
      <ClientLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500" />
        </div>
      </ClientLayout>
    );
  }

  if (!team) {
    return (
      <ClientLayout>
        <div className="max-w-lg mx-auto mt-16 text-center px-4">
          <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">{t("team.noTeam")}</p>
        </div>
      </ClientLayout>
    );
  }

  const memberCount = team.members.filter(m => m.role === "member").length;
  const spotsLeft = team.maxMembers - memberCount; // owner excluded from count
  const canInvite = team.isOwner && team.hasPremiumMulti && spotsLeft > 0;

  return (
    <ClientLayout>
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-primary-500" />
            {t("team.title")}
          </h1>
          <p className="text-gray-500 text-sm mt-1">{team.name}</p>
        </div>

        {/* Premium upsell — only if solo (standard/free) */}
        {!team.hasPremiumMulti && team.isOwner && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-800">{t("team.premiumRequired")}</p>
              <p className="text-xs text-amber-600 mt-0.5">{t("team.premiumRequiredDesc")}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left column: members ── */}
          <div className="lg:col-span-1 space-y-4">

            {/* Members list */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                  {t("team.members")}
                </h2>
                <span className="text-xs text-gray-400">
                  {memberCount}/{team.maxMembers} {t("team.members").toLowerCase()}
                </span>
              </div>

              <ul className="divide-y divide-gray-50">
                {team.members.map((m) => (
                  <li key={m._id} className="px-4 py-3 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-900 flex items-center justify-center shrink-0">
                      <span className="text-white text-xs font-bold">
                        {(m.name || m.email || "?").charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{m.name || m.email}</p>
                      <p className="text-xs text-gray-400 truncate">{m.email}</p>
                    </div>
                    {m.role === "owner" ? (
                      <Crown className="w-4 h-4 text-accent-500 shrink-0" title="Propriétaire" />
                    ) : team.isOwner ? (
                      <button
                        onClick={() => handleRemove(m._id, m.name || m.email)}
                        disabled={removingId === m._id}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                        title={t("team.removeMember")}
                      >
                        <UserMinus className="w-4 h-4" />
                      </button>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>

            {/* Invite form — owner + premium only */}
            {team.isOwner && team.hasPremiumMulti && (
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-primary-500" />
                  {t("team.inviteMember")}
                </h2>
                {spotsLeft > 0 ? (
                  <form onSubmit={handleInvite} className="space-y-2">
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder={t("team.inviteEmailPlaceholder")}
                      required
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    />
                    <button
                      type="submit"
                      disabled={inviting}
                      className="w-full py-2 rounded-lg bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
                    >
                      {inviting ? (
                        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      {t("team.sendInvite")}
                    </button>
                    <p className="text-xs text-gray-400 text-center">
                      {t("team.spotsLeft", { count: spotsLeft })}
                    </p>
                  </form>
                ) : (
                  <p className="text-sm text-gray-500 text-center">{t("team.maxMembersReached")}</p>
                )}
              </div>
            )}
          </div>

          {/* ── Right column: team diagnostics ── */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary-500" />
                <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                  {t("team.diagnostics")}
                </h2>
              </div>

              {diagnostics.length === 0 ? (
                <div className="px-4 py-12 text-center">
                  <BarChart2 className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                  <p className="text-sm text-gray-400">{t("team.noDiagnostics")}</p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-50">
                  {diagnostics.map((a) => (
                    <motion.li
                      key={a._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="px-4 py-4 flex items-center gap-4"
                    >
                      {/* Score circle */}
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 font-bold text-lg"
                        style={{
                          background: a.overallScore >= 70 ? "#dcfce7" : a.overallScore >= 40 ? "#fef9c3" : "#fee2e2",
                          color: a.overallScore >= 70 ? "#14532d" : a.overallScore >= 40 ? "#713f12" : "#991b1b",
                        }}
                      >
                        {Math.round(a.overallScore ?? 0)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {a.companyName || t("team.unknownCompany")}
                        </p>
                        {a.overallLevel && (
                          <p className="text-xs text-gray-500">{LEVEL_LABELS[a.overallLevel] || a.overallLevel}</p>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="w-3.5 h-3.5 text-gray-300" />
                          <span className="text-xs text-gray-400">{formatDate(a.completedAt)}</span>
                          {a.sector && (
                            <>
                              <span className="text-gray-200">·</span>
                              <span className="text-xs text-gray-400 capitalize">{a.sector}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <CheckCircle
                        className="w-5 h-5 shrink-0"
                        style={{ color: a.overallScore >= 70 ? "#22c55e" : a.overallScore >= 40 ? "#f59e0b" : "#ef4444" }}
                      />
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
};

export default ClientTeamPage;
