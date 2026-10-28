import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Users, AlertTriangle } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { API_BASE_URL as API_URL } from "../services/api";
import { useClientAuth } from "../context/ClientAuthContext";
import { AuthLayout, Button, FormField, PasswordInput } from "../components/ui/ds";

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

  const panel = {
    scene: "team",
    panelTitle: t("team.invite.panelTitle"),
    panelText: t("team.invite.panelText"),
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-label={t("team.joining")}>
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-ubb-brand-900 border-t-transparent" />
      </div>
    );
  }

  const invalidReason = {
    not_found: t("team.invite.notFound"),
    already_used: t("team.invite.alreadyUsed"),
    expired: t("team.invite.expired"),
    server_error: t("common.error"),
  };

  if (!invite?.valid) {
    return (
      <AuthLayout {...panel} title={t("team.invite.invalid")}>
        <div role="alert">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-ubb-accent-100 text-ubb-accent-ink">
            <AlertTriangle className="h-7 w-7" aria-hidden="true" />
          </span>
          <p className="mt-5 font-text text-ubb-body text-ubb-ink-muted">
            {invalidReason[invite?.reason] || t("team.invite.invalidDesc")}
          </p>
          <Button to="/" className="mt-6 w-full">{t("common.goHome")}</Button>
        </div>
      </AuthLayout>
    );
  }

  if (joining) {
    return (
      <AuthLayout {...panel} title={t("team.joining")}>
        <div role="status" className="flex items-center gap-3 font-text text-ubb-body text-ubb-ink-muted">
          <span className="h-6 w-6 animate-spin rounded-full border-4 border-ubb-brand-900 border-t-transparent" aria-hidden="true" />
          {t("team.joining")}
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      {...panel}
      title={mode === "login" ? t("team.invite.loginAndJoin") : t("team.invite.registerAndJoin")}
    >
      {/* Qui invite */}
      <div className="flex items-center gap-3 rounded-ubb-card bg-ubb-brand-50 p-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ubb-brand-900 text-white">
          <Users className="h-5 w-5" aria-hidden="true" />
        </span>
        <p className="font-text text-ubb-small text-ubb-ink-muted">
          {t("team.invite.from")} <strong className="text-ubb-ink">{invite.inviterName}</strong>
          <br />
          {t("team.invite.toJoin")} <strong className="text-ubb-ink">{invite.teamName}</strong>
        </p>
      </div>

      {/* Compte existant ou nouveau compte */}
      <div role="radiogroup" aria-label={t("team.invite.modeLabel")} className="mt-6 grid grid-cols-2 gap-1 rounded-full bg-ubb-brand-50 p-1">
        {[
          ["login", t("team.invite.haveAccount")],
          ["register", t("team.invite.noAccount")],
        ].map(([value, label]) => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={mode === value}
            onClick={() => setMode(value)}
            className={`ubb-focus min-h-[44px] rounded-full px-3 font-text text-sm font-semibold transition-colors ${
              mode === value ? "bg-ubb-brand-900 text-white" : "text-ubb-ink hover:bg-white"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <form onSubmit={handleAuth} className="mt-6 space-y-5">
        {mode === "register" && (
          <>
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField id="join-firstName" label={t("team.invite.firstName")}>
                <input id="join-firstName" type="text" autoComplete="given-name" required value={firstName} onChange={(e) => setFirstName(e.target.value)} className="ubb-input" />
              </FormField>
              <FormField id="join-lastName" label={t("team.invite.lastName")}>
                <input id="join-lastName" type="text" autoComplete="family-name" required value={lastName} onChange={(e) => setLastName(e.target.value)} className="ubb-input" />
              </FormField>
            </div>
            <FormField id="join-companyName" label={t("team.invite.companyName")}>
              <input id="join-companyName" type="text" autoComplete="organization" required value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="ubb-input" />
            </FormField>
          </>
        )}

        <FormField id="join-email" label={t("auth.common.email")}>
          <input id="join-email" type="email" autoComplete="email" inputMode="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="ubb-input" />
        </FormField>

        <FormField id="join-password" label={t("team.invite.password")}>
          <PasswordInput id="join-password" autoComplete={mode === "login" ? "current-password" : "new-password"} required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
        </FormField>

        <Button type="submit" size="lg" disabled={authLoading} className="w-full">
          {mode === "login" ? t("team.invite.loginAndJoin") : t("team.invite.registerAndJoin")}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default JoinTeamPage;
