import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
	Download,
	FileText,
	CheckCircle,
	Loader,
	AlertCircle,
} from "lucide-react";
import axios from "axios";
import { API_BASE_URL } from "../services/api";

const ReportDownloadPage = () => {
	const { t } = useTranslation();
	const { assessmentId } = useParams();
	const [loading, setLoading] = useState(true);
	const [downloading, setDownloading] = useState(false);
	const [assessment, setAssessment] = useState(null);
	const [error, setError] = useState(null);

	const getApiBaseUrl = () => API_BASE_URL;

	useEffect(() => {
		fetchAssessment();
	}, [assessmentId]);

	const fetchAssessment = async () => {
		try {
			setLoading(true);
			const response = await axios.get(
				`${getApiBaseUrl()}/assessments/${assessmentId}`,
			);
			setAssessment(response.data.assessment);
		} catch (err) {
			setError(
				err.response?.data?.message || "Erreur lors du chargement du rapport",
			);
		} finally {
			setLoading(false);
		}
	};

	const handleDownload = async () => {
		try {
			setDownloading(true);
			const response = await axios.get(
				`${getApiBaseUrl()}/reports/download/${assessmentId}`,
				{
					responseType: "blob",
				},
			);

			const blob = response.data;
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = `vitalCHECK-Report-${assessmentId}.pdf`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			window.URL.revokeObjectURL(url);
		} catch (err) {
			setError(
				err.response?.data?.message || "Erreur lors du téléchargement du PDF",
			);
		} finally {
			setDownloading(false);
		}
	};

	const getStatusColor = (status) => {
		switch (status) {
			case "excellent":
				return "text-green-600 bg-green-100";
			case "good":
				return "text-blue-600 bg-blue-100";
			case "average":
				return "text-yellow-600 bg-yellow-100";
			case "amber":
				return "text-orange-600 bg-orange-100";
			case "poor":
				return "text-orange-600 bg-orange-100";
			case "critical":
				return "text-red-600 bg-red-100";
			default:
				return "text-gray-600 bg-gray-100";
		}
	};

	const getScoreColor = (score) => {
		if (score >= 80) return "text-green-600";
		if (score >= 60) return "text-blue-600";
		if (score >= 40) return "text-yellow-600";
		if (score >= 20) return "text-orange-600";
		return "text-red-600";
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center">
				<div className="text-center">
					<Loader className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
					<p className="text-gray-600">{t("common.loading")}</p>
				</div>
			</div>
		);
	}

	if (error || !assessment) {
		return (
			<div className="min-h-screen py-[50px] bg-gradient-to-br from-primary-50 to-white flex items-center justify-center p-4">
				<div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
					<AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
					<h2 className="text-2xl font-bold text-gray-900 mb-4">
						{t("reportDownload.error")}
					</h2>
					<p className="text-gray-600 mb-6">
						{error || t("reportDownload.notFound")}
					</p>
					<button
						onClick={() => (window.location.href = "/")}
						className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
					>
						{t("common.goHome")}
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen py-[50px] bg-gradient-to-br from-primary-50 via-white to-secondary-50 px-4">
			<div className="max-w-4xl mx-auto">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="bg-white rounded-2xl shadow-2xl overflow-hidden"
				>
					{/* Header */}
					<div className="bg-primary-600 p-3 md:p-8 text-white">
						<div className="flex items-center justify-center mb-4">
							<FileText className="w-16 h-16" />
						</div>
						<h1 className="text-3xl md:text-4xl font-bold text-center mb-2">
							{t("reportDownload.title")}
						</h1>
						<p className="text-center text-primary-100">
							{t("reportDownload.subtitle")}
						</p>
					</div>

					{/* Content */}
					<div className="p-8">
						{/* Company Info */}
						<div className="mb-8 text-center">
							<h2 className="text-2xl font-bold text-gray-900 mb-2">
								{assessment.user?.companyName || "N/A"}
							</h2>
							<p className="text-gray-600">{assessment.user?.email}</p>
						</div>

						{/* Score Display */}
						<div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 mb-8">
							<div className="text-center mb-6">
								<p className="text-gray-600 mb-2">
									{t("reportDownload.overallScore")}
								</p>
								<div
									className={`text-6xl font-bold ${getScoreColor(assessment.overallScore)}`}
								>
									{assessment.overallScore}%
								</div>
							</div>

							<div className="flex justify-center">
								<span
									className={`inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold ${getStatusColor(assessment.overallStatus)}`}
								>
									<CheckCircle className="w-5 h-5 mr-2" />
									{t(`results.status.${assessment.overallStatus}`)}
								</span>
							</div>
						</div>

						{/* Assessment Info */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
							<div className="bg-blue-50 rounded-lg p-4">
								<p className="text-sm text-blue-600 font-medium mb-1">
									{t("reportDownload.assessmentDate")}
								</p>
								<p className="text-lg font-semibold text-gray-900">
									{new Date(assessment.completedAt).toLocaleDateString()}
								</p>
							</div>
							<div className="bg-purple-50 rounded-lg p-4">
								<p className="text-sm text-purple-600 font-medium mb-1">
									{t("reportDownload.reportGenerated")}
								</p>
								<p className="text-lg font-semibold text-gray-900">
									{assessment.pdfGeneratedAt ?
										new Date(assessment.pdfGeneratedAt).toLocaleDateString()
									:	"N/A"}
								</p>
							</div>
						</div>

						{/* Download Button */}
						<div className="text-center">
							<button
								onClick={handleDownload}
								disabled={downloading}
								className="inline-flex items-center px-8 py-4 bg-primary-600 text-white text-lg font-semibold rounded-xl hover:bg-primary-700 transform hover:scale-105 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{downloading ?
									<>
										<Loader className="w-6 h-6 mr-3 animate-spin" />
										{t("reportDownload.downloading")}
									</>
								:	<>
										<Download className="w-6 h-6 mr-3" />
										{t("reportDownload.downloadButton")}
									</>
								}
							</button>
							<p className="text-sm text-gray-500 mt-4">
								{t("reportDownload.downloadHint")}
							</p>
						</div>
					</div>

					{/* Footer */}
					<div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
						<div className="flex flex-col md:flex-row items-center justify-between gap-4">
							<p className="text-sm text-gray-600">
								{t("reportDownload.needHelp")}
							</p>
							<div className="flex gap-4">
								<button
									onClick={() => (window.location.href = "/contact")}
									className="text-sm text-primary-600 hover:text-primary-700 font-medium"
								>
									{t("navigation.contact")}
								</button>
								<button
									onClick={() => (window.location.href = "/")}
									className="text-sm text-primary-600 hover:text-primary-700 font-medium"
								>
									{t("common.goHome")}
								</button>
							</div>
						</div>
					</div>
				</motion.div>
			</div>
		</div>
	);
};

export default ReportDownloadPage;
