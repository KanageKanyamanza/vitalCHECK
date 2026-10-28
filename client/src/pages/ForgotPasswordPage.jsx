import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CheckCircle2 } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { AuthLayout, Button, FormField } from "../components/ui/ds";

import { API_BASE_URL } from "../services/api";

const ForgotPasswordPage = () => {
	const { t } = useTranslation();
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const [emailSent, setEmailSent] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			await axios.post(`${API_BASE_URL}/client-auth/forgot-password`, {
				email,
			});
			setEmailSent(true);
			toast.success(t("auth.forgot.sentToast"));
		} catch (err) {
			setError(err.response?.data?.message || t("auth.forgot.error"));
		} finally {
			setLoading(false);
		}
	};

	const backToLogin = (
		<Link
			to="/login"
			className="ubb-focus inline-flex min-h-[44px] items-center rounded font-text text-sm font-semibold text-ubb-brand-900 underline underline-offset-4"
		>
			{t("auth.forgot.backToLogin")}
		</Link>
	);

	return (
		<AuthLayout
			scene="recovery"
			title={emailSent ? t("auth.forgot.sentTitle") : t("auth.forgot.title")}
			subtitle={emailSent ? undefined : t("auth.forgot.subtitle")}
			panelTitle={t("auth.forgot.panelTitle")}
			panelText={t("auth.forgot.panelText")}
		>
			{emailSent ? (
				<div role="status">
					<span className="flex h-14 w-14 items-center justify-center rounded-full bg-ubb-brand-50 text-ubb-brand-900">
						<CheckCircle2 className="h-8 w-8" aria-hidden="true" />
					</span>
					<p className="mt-5 font-text text-ubb-body text-ubb-ink">
						{t("auth.forgot.sentText", { email })}
					</p>
					<p className="mt-2 font-text text-ubb-small text-ubb-ink-muted">{t("auth.forgot.sentHint")}</p>
					<div className="mt-6">{backToLogin}</div>
				</div>
			) : (
				<form onSubmit={handleSubmit} className="space-y-5" noValidate>
					{error && (
						<p role="alert" className="rounded-ubb-field border border-red-200 bg-red-50 px-4 py-3 font-text text-sm font-medium text-red-800">
							{error}
						</p>
					)}
					<FormField id="forgot-email" label={t("auth.common.email")}>
						<input
							id="forgot-email"
							type="email"
							autoComplete="email"
							inputMode="email"
							required
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="ubb-input"
							placeholder={t("auth.common.emailPlaceholder")}
						/>
					</FormField>
					<Button type="submit" size="lg" disabled={loading || !email.trim()} className="w-full">
						{loading ? t("auth.forgot.loading") : t("auth.forgot.submit")}
					</Button>
					<div>{backToLogin}</div>
				</form>
			)}
		</AuthLayout>
	);
};

export default ForgotPasswordPage;
