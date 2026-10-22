import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { AuthLayout, Button, FormField, PasswordInput } from "../components/ui/ds";

import { API_BASE_URL } from "../services/api";

const ResetPasswordPage = () => {
	const { t } = useTranslation();
	const { token } = useParams();
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		password: "",
		confirmPassword: "",
	});
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [tokenValid, setTokenValid] = useState(true);
	const [errors, setErrors] = useState({});

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
		if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const next = {};
		if (formData.password.length < 6) next.password = t("auth.reset.tooShort");
		if (formData.password !== formData.confirmPassword) next.confirmPassword = t("auth.reset.mismatch");
		setErrors(next);
		if (next.password || next.confirmPassword) {
			document.getElementById(next.password ? "reset-password" : "reset-confirmPassword")?.focus();
			return;
		}

		setLoading(true);

		try {
			await axios.post(`${API_BASE_URL}/client-auth/reset-password/${token}`, {
				password: formData.password,
			});
			setSuccess(true);
			toast.success(t("auth.reset.successToast"));

			// Rediriger vers la page de connexion après 3 secondes
			setTimeout(() => {
				navigate("/login");
			}, 3000);
		} catch (error) {
			if (error.response?.status === 400) {
				setTokenValid(false);
			} else {
				toast.error(error.response?.data?.message || t("auth.reset.error"));
			}
		} finally {
			setLoading(false);
		}
	};

	const panel = {
		scene: "recovery",
		panelTitle: t("auth.forgot.panelTitle"),
		panelText: t("auth.forgot.panelText"),
	};

	if (!tokenValid) {
		return (
			<AuthLayout {...panel} title={t("auth.reset.invalidTitle")}>
				<div role="alert">
					<span className="flex h-14 w-14 items-center justify-center rounded-full bg-ubb-accent-100 text-ubb-accent-ink">
						<AlertTriangle className="h-7 w-7" aria-hidden="true" />
					</span>
					<p className="mt-5 font-text text-ubb-body text-ubb-ink-muted">{t("auth.reset.invalidText")}</p>
					<Button to="/forgot-password" className="mt-6 w-full">
						{t("auth.reset.newLink")}
					</Button>
				</div>
			</AuthLayout>
		);
	}

	if (success) {
		return (
			<AuthLayout {...panel} title={t("auth.reset.successTitle")}>
				<div role="status">
					<span className="flex h-14 w-14 items-center justify-center rounded-full bg-ubb-brand-50 text-ubb-brand-900">
						<CheckCircle2 className="h-8 w-8" aria-hidden="true" />
					</span>
					<p className="mt-5 font-text text-ubb-body text-ubb-ink-muted">{t("auth.reset.successText")}</p>
					<Button to="/login" className="mt-6 w-full">
						{t("auth.reset.goToLogin")}
					</Button>
				</div>
			</AuthLayout>
		);
	}

	const field = (name) => ({
		id: `reset-${name}`,
		name,
		value: formData[name],
		onChange: handleChange,
		"aria-invalid": errors[name] ? "true" : "false",
		"aria-describedby": errors[name] ? `reset-${name}-error` : undefined,
	});

	return (
		<AuthLayout {...panel} title={t("auth.reset.title")} subtitle={t("auth.reset.subtitle")}>
			<form onSubmit={handleSubmit} className="space-y-5" noValidate>
				<FormField id="reset-password" label={t("auth.reset.newPassword")} error={errors.password} hint={t("auth.reset.hint")}>
					<PasswordInput autoComplete="new-password" required {...field("password")} />
				</FormField>
				<FormField id="reset-confirmPassword" label={t("auth.reset.confirm")} error={errors.confirmPassword}>
					<PasswordInput autoComplete="new-password" required {...field("confirmPassword")} />
				</FormField>
				<Button type="submit" size="lg" disabled={loading} className="w-full">
					{loading ? t("auth.reset.loading") : t("auth.reset.submit")}
				</Button>
				<Link
					to="/login"
					className="ubb-focus inline-flex min-h-[44px] items-center rounded font-text text-sm font-semibold text-ubb-brand-900 underline underline-offset-4"
				>
					{t("auth.forgot.backToLogin")}
				</Link>
			</form>
		</AuthLayout>
	);
};

export default ResetPasswordPage;
