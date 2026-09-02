import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Users, ShieldCheck, AlertTriangle, LogIn, UserPlus } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { API_BASE_URL as API_URL } from "../services/api";
import { useClientAuth } from "../context/ClientAuthContext";
import logoIcon from "/android-icon-96x96.png";

const JoinTeamPage = () => {
  const { token } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, token: authToken, login, setToken, setUser } = useClientAuth();

  const [invite, setInvite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  // Login form state
  const [mode, setMode] = useState("login"); // 'login' | 'register'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companySize, setCompanySize] = useState("sme");
  const [authLoading, setAuthLoading] = useState(false);

  // 1. Load invite info
  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`${API_URL}/teams/invite/${token}`);
        setInvite(res.data);
        if (res.data.email) setEmail(res.data.email);
      } catch {
        setInvite({ valid: false, reason: "server_error" });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token]);

  // 2. If user is already logged in, auto-join
  useEffect(() => {
    if (user && invite?.valid && authToken) {
      handleJoin(authToken);
    }
  }, [user, invite]);

  const handleJoin = async (jwt) => {
    setJoining(true);
    try {
      const res = await axios.post(
        `${API_URL}/teams/join/${token}`,
        {},
        { headers: { Authorization: `Bearer ${jwt}` } }
      );
      toast.success(res.data.message || t("team.joinSuccess"));
      navigate("/client/team");
    } catch (err) {
      const msg = err.response?.data?.message || t("team.joinError");
      toast.error(msg);
      navigate("/client/dashboard");
    } finally {
      setJoining(false);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      let jwt;
      if (mode === "login") {
        // Use context login — handles token storage + state correctly
        const result = await login(email, password);
        if (!result.success) throw new Error(result.error || t("common.error"));
        jwt = localStorage.getItem("clientToken");
      } else {
        const res = await axios.post(`${API_URL}/client-auth/register`, {
          email,
          password,
          firstName,
          lastName,
          companyName,
          companySize,
          sector: "other",
        });
        jwt = res.data.token;
        // Properly store auth state via context setters
        localStorage.setItem("clientToken", jwt);
        setToken(jwt);
        setUser(res.data.user);
      }
      await handleJoin(jwt);
    } catch (err) {
      const msg = err.response?.data?.message || t("common.error");
      toast.error(msg);
    } finally {
      setAuthLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500" />
      </div>
    );
  }

  const invalidReason = {
    not_found: t("team.invite.notFound"),
    already_used: t("team.invite.alreadyUsed"),
    expired: t("team.invite.expired"),
    server_error: t("common.error"),
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="px-6 py-4 bg-primary-900 flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2.5 hover:opacity-90">
          <img src={logoIcon} alt="VitalCHECK" className="w-8 h-8 rounded-md" />
          <span className="font-bold text-white text-sm tracking-wide">VitalCHECK</span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {!invite?.valid ? (
            /* ── Invalid invite ── */
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
              <h1 className="text-xl font-bold text-gray-900 mb-2">{t("team.invite.invalid")}</h1>
              <p className="text-gray-500 text-sm mb-6">
                {invalidReason[invite?.reason] || t("team.invite.invalidDesc")}
              </p>
              <Link to="/" className="text-primary-600 text-sm font-medium hover:underline">
                {t("common.goHome")}
              </Link>
            </div>
          ) : joining ? (
            /* ── Joining… ── */
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500 mx-auto mb-4" />
              <p className="text-gray-600">{t("team.joining")}</p>
            </div>
          ) : (
            /* ── Auth form ── */
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-primary-900 to-accent-500" />
              <div className="p-8">
                {/* Invite info */}
                <div className="flex items-center gap-3 mb-6 p-4 bg-green-50 rounded-xl border border-green-200">
                  <div className="w-10 h-10 rounded-full bg-primary-900 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
                      {t("team.invite.from")}
                    </p>
                    <p className="text-sm font-bold text-gray-900">{invite.inviterName}</p>
                    <p className="text-xs text-gray-500">
                      {t("team.invite.toJoin")} <strong>{invite.teamName}</strong>
                    </p>
                  </div>
                </div>

                {/* Mode tabs */}
                <div className="flex rounded-lg overflow-hidden border border-gray-200 mb-6">
                  <button
                    onClick={() => setMode("login")}
                    className={`flex-1 py-2 text-sm font-medium flex items-center justify-center gap-1.5 transition-colors ${
                      mode === "login" ? "bg-primary-900 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <LogIn className="w-4 h-4" /> {t("team.invite.haveAccount")}
                  </button>
                  <button
                    onClick={() => setMode("register")}
                    className={`flex-1 py-2 text-sm font-medium flex items-center justify-center gap-1.5 transition-colors ${
                      mode === "register" ? "bg-primary-900 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <UserPlus className="w-4 h-4" /> {t("team.invite.noAccount")}
                  </button>
                </div>

                <form onSubmit={handleAuth} className="space-y-4">
                  {mode === "register" && (
                    <>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">{t("team.invite.firstName")}</label>
                          <input
                            type="text"
                            value={firstName}
                            onChange={e => setFirstName(e.target.value)}
                            required
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-600 mb-1">{t("team.invite.lastName")}</label>
                          <input
                            type="text"
                            value={lastName}
                            onChange={e => setLastName(e.target.value)}
                            required
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">{t("team.invite.companyName")}</label>
                        <input
                          type="text"
                          value={companyName}
                          onChange={e => setCompanyName(e.target.value)}
                          required
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      {t("team.invite.password")}
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full py-2.5 rounded-lg bg-primary-500 hover:bg-primary-600 text-white font-semibold text-sm transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {authLoading ? (
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    ) : (
                      <ShieldCheck className="w-4 h-4" />
                    )}
                    {mode === "login" ? t("team.invite.loginAndJoin") : t("team.invite.registerAndJoin")}
                  </button>
                </form>
              </div>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default JoinTeamPage;
