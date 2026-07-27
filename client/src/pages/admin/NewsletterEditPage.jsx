import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
	ArrowLeft,
	Save,
	Eye,
	Send,
	Users,
	Mail,
	X,
	Upload,
	Trash2,
	Calendar,
} from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import SimpleTextEditor from "../../components/admin/SimpleTextEditor";
import toast from "react-hot-toast";
import axios from "axios";
import { parseMarkdown } from "../../utils/markdownParser";
import { uploadApiService } from "../../services/api";
import { API_BASE_URL } from "../../services/api";

const NewsletterEditPage = () => {
	const navigate = useNavigate();
	const { id } = useParams();
	const isEdit = Boolean(id);

	const [formData, setFormData] = useState({
		subject: "",
		previewText: "",
		content: "",
		imageUrl: "",
		scheduledAt: "",
		status: "draft",
		recipients: {
			type: "all",
			tags: [],
			customEmails: [],
		},
	});

	const [loading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);
	const [previewMode, setPreviewMode] = useState(false);
	const [previewHTML, setPreviewHTML] = useState("");
	const [recipientCount, setRecipientCount] = useState(0);
	const [customEmailInput, setCustomEmailInput] = useState("");
	const [showPreview, setShowPreview] = useState(false); // Aperçu en popup par défaut
	const [uploadingImage, setUploadingImage] = useState(false);
	const [emailSuggestions, setEmailSuggestions] = useState([]);
	const [showSuggestions, setShowSuggestions] = useState(false);
	const [loadingSuggestions, setLoadingSuggestions] = useState(false);
	const [allSubscribers, setAllSubscribers] = useState([]);
	const [loadingSubscribers, setLoadingSubscribers] = useState(false);
	const [selectedSubscriberEmails, setSelectedSubscriberEmails] = useState([]);
	const [subscriberSearchTerm, setSubscriberSearchTerm] = useState("");

	useEffect(() => {
		// Vérifier si des emails ont été sélectionnés depuis la page des abonnés
		const selectedEmails = localStorage.getItem("newsletterSelectedEmails");
		if (selectedEmails && !isEdit) {
			try {
				const emails = JSON.parse(selectedEmails);
				if (emails && emails.length > 0) {
					// Pré-remplir avec les emails sélectionnés
					setFormData((prev) => ({
						...prev,
						recipients: {
							type: "custom",
							tags: [],
							customEmails: emails,
						},
					}));
					// Mettre à jour le comptage
					setRecipientCount(emails.length);
					// Nettoyer le localStorage après utilisation
					localStorage.removeItem("newsletterSelectedEmails");
					toast.success(
						`${emails.length} email${emails.length > 1 ? "s" : ""} sélectionné${emails.length > 1 ? "s" : ""} depuis la liste des abonnés`,
					);
				}
			} catch (error) {
				console.error(
					"Erreur lors de la lecture des emails sélectionnés:",
					error,
				);
				localStorage.removeItem("newsletterSelectedEmails");
			}
		}

		if (isEdit && id) {
			fetchNewsletter();
		}
	}, [isEdit, id]);

	useEffect(() => {
		// Mettre à jour le comptage quand le type de destinataire change
		// Ne pas appeler si on est en train de charger une newsletter
		if (loading) return;

		if (formData.recipients?.type === "custom") {
			setRecipientCount(formData.recipients.customEmails?.length || 0);
		} else if (formData.recipients?.type) {
			fetchRecipientCount();
		}

		// Nettoyer les suggestions si on change de type
		if (formData.recipients?.type !== "custom") {
			setEmailSuggestions([]);
			setShowSuggestions(false);
			setCustomEmailInput("");
			setSelectedSubscriberEmails([]);
			setSubscriberSearchTerm("");
		}
	}, [formData.recipients?.type, formData.recipients?.tags, loading]);

	// Charger tous les abonnés quand on passe en mode custom
	useEffect(() => {
		if (
			formData.recipients?.type === "custom" &&
			allSubscribers.length === 0 &&
			!loadingSubscribers
		) {
			fetchAllSubscribers();
		}
	}, [formData.recipients?.type]);

	const fetchNewsletter = async () => {
		if (!id) return;

		try {
			setLoading(true);
			const token = localStorage.getItem("adminToken");
			const response = await axios.get(
				`${API_BASE_URL}/newsletters/admin/${id}`,
				{
					headers: { Authorization: `Bearer ${token}` },
				},
			);

			if (response.data.success) {
				const newsletter = response.data.newsletter;
				// datetime-local attend une date "locale" (sans timezone).
				// On convertit donc la date UTC stockée en "local ISO" pour éviter les décalages visuels.
				const scheduledAtValue =
					newsletter.scheduledAt ?
						(() => {
							const d = new Date(newsletter.scheduledAt);
							const local = new Date(
								d.getTime() - d.getTimezoneOffset() * 60000,
							);
							return local.toISOString().slice(0, 16);
						})()
					:	"";
				setFormData({
					subject: newsletter.subject || "",
					previewText: newsletter.previewText || "",
					content: newsletter.content || "",
					imageUrl: newsletter.imageUrl || "",
					scheduledAt: scheduledAtValue,
					status: newsletter.status || "draft",
					recipients: newsletter.recipients || {
						type: "all",
						tags: [],
						customEmails: [],
					},
				});
			}
		} catch (error) {
			console.error("Erreur lors du chargement de la newsletter:", error);
			toast.error("Erreur lors du chargement de la newsletter");
		} finally {
			setLoading(false);
		}
	};

	const fetchRecipientCount = async () => {
		try {
			// Ne pas appeler l'API si le type est custom (comptage côté client)
			if (formData.recipients.type === "custom") {
				setRecipientCount(formData.recipients.customEmails?.length || 0);
				return;
			}

			const token = localStorage.getItem("adminToken");
			const params = {
				type: formData.recipients.type,
			};

			if (
				formData.recipients.type === "tags" &&
				formData.recipients.tags?.length > 0
			) {
				params.tags = formData.recipients.tags.join(",");
			}

			const response = await axios.get(
				`${API_BASE_URL}/newsletters/admin/subscribers/count`,
				{
					headers: { Authorization: `Bearer ${token}` },
					params,
				},
			);

			if (response.data.success) {
				setRecipientCount(response.data.count || 0);
			}
		} catch (error) {
			console.error("Erreur lors du comptage des destinataires:", error);
			setRecipientCount(0);
		}
	};

	const handleSave = async () => {
		if (!formData.subject.trim()) {
			toast.error("Le sujet est requis");
			return;
		}

		if (!formData.content.trim()) {
			toast.error("Le contenu est requis");
			return;
		}

		try {
			setSaving(true);
			const token = localStorage.getItem("adminToken");

			if (isEdit) {
				await axios.put(`${API_BASE_URL}/newsletters/admin/${id}`, formData, {
					headers: { Authorization: `Bearer ${token}` },
				});
				toast.success("Newsletter mise à jour avec succès");
			} else {
				const response = await axios.post(
					`${API_BASE_URL}/newsletters/admin/create`,
					formData,
					{
						headers: { Authorization: `Bearer ${token}` },
					},
				);

				if (response.data.success && response.data.newsletter?._id) {
					toast.success("Newsletter créée avec succès");
					setTimeout(() => {
						navigate(
							`/admin/newsletters/edit/${response.data.newsletter._id}`,
							{ replace: true },
						);
					}, 300);
				} else {
					console.error("Réponse API invalide:", response.data);
					toast.error("Erreur: Newsletter créée mais ID non reçu");
				}
			}
		} catch (error) {
			console.error("Erreur lors de la sauvegarde:", error);
			toast.error(
				error.response?.data?.message || "Erreur lors de la sauvegarde",
			);
		} finally {
			setSaving(false);
		}
	};

	// Fonction pour convertir les classes Tailwind en styles inline pour l'email
	const convertToEmailHTML = (html) => {
		// Remplacer les classes Tailwind par des styles inline pour l'email
		let emailHTML = html
			// Adapter les images pour qu'elles s'ajustent à la largeur
			.replace(/<img([^>]*)>/gi, (match, attrs) => {
				// Ajouter max-width: 100% et height: auto si pas déjà présent
				if (!attrs.includes("style=")) {
					return `<img${attrs} style="max-width: 100%; height: auto;">`;
				}
				// Si style existe, ajouter max-width et height
				return match.replace(/style="([^"]*)"/i, (styleMatch, styleContent) => {
					if (!styleContent.includes("max-width")) {
						return `style="${styleContent}; max-width: 100%; height: auto;"`;
					}
					return styleMatch;
				});
			})
			// Adapter les tableaux pour qu'ils s'ajustent à la largeur
			.replace(/<table([^>]*)>/gi, (match, attrs) => {
				if (!attrs.includes("style=")) {
					return `<table${attrs} style="width: 100%; max-width: 100%; table-layout: auto;">`;
				}
				return match.replace(/style="([^"]*)"/i, (styleMatch, styleContent) => {
					if (!styleContent.includes("width")) {
						return `style="${styleContent}; width: 100%; max-width: 100%; table-layout: auto;"`;
					}
					return styleMatch;
				});
			})
			.replace(
				/class="[^"]*text-2xl[^"]*"/g,
				'style="font-size: 1.5em; font-weight: 700; margin-top: 1.5em; margin-bottom: 0.75em; color: #1a202c;"',
			)
			.replace(
				/class="[^"]*text-3xl[^"]*"/g,
				'style="font-size: 1.875em; font-weight: 700; margin-top: 1.5em; margin-bottom: 0.75em; color: #1a202c;"',
			)
			.replace(
				/class="[^"]*text-4xl[^"]*"/g,
				'style="font-size: 2.25em; font-weight: 700; margin-top: 1.5em; margin-bottom: 0.75em; color: #1a202c;"',
			)
			.replace(/class="[^"]*font-bold[^"]*"/g, 'style="font-weight: 700;"')
			.replace(/class="[^"]*italic[^"]*"/g, 'style="font-style: italic;"')
			.replace(/class="[^"]*text-gray-900[^"]*"/g, 'style="color: #1a202c;"')
			.replace(/class="[^"]*text-gray-700[^"]*"/g, 'style="color: #4a5568;"')
			.replace(/class="[^"]*text-gray-600[^"]*"/g, 'style="color: #4a5568;"')
			.replace(
				/class="[^"]*text-primary-600[^"]*"/g,
				'style="color: #00751B; text-decoration: underline;"',
			)
			.replace(/class="[^"]*mb-4[^"]*"/g, 'style="margin-bottom: 1em;"')
			.replace(
				/class="[^"]*leading-relaxed[^"]*"/g,
				'style="line-height: 1.7;"',
			)
			.replace(
				/class="[^"]*list-disc[^"]*"/g,
				'style="list-style-type: disc; padding-left: 1.5em; margin: 0.75em 0;"',
			)
			.replace(
				/class="[^"]*list-decimal[^"]*"/g,
				'style="list-style-type: decimal; padding-left: 1.5em; margin: 0.75em 0;"',
			)
			.replace(
				/class="[^"]*border-l-4[^"]*border-primary-500[^"]*"/g,
				'style="border-left: 4px solid #00751B; padding-left: 1em; margin: 1em 0; font-style: italic; color: #4a5568;"',
			)
			.replace(
				/class="[^"]*bg-gray-100[^"]*"/g,
				'style="background-color: #f3f4f6; padding: 0.2em 0.4em; border-radius: 4px;"',
			)
			.replace(
				/class="[^"]*font-mono[^"]*"/g,
				'style="font-family: monospace;"',
			)
			.replace(/class="[^"]*text-sm[^"]*"/g, 'style="font-size: 0.875em;"')
			.replace(
				/class="[^"]*px-2[^"]*py-1[^"]*"/g,
				'style="padding: 0.2em 0.4em;"',
			)
			.replace(/class="[^"]*rounded[^"]*"/g, 'style="border-radius: 4px;"')
			.replace(/class="[^"]*my-4[^"]*"/g, 'style="margin: 1em 0;"')
			.replace(/class="[^"]*my-8[^"]*"/g, 'style="margin: 2em 0;"')
			.replace(
				/class="[^"]*border-gray-300[^"]*"/g,
				'style="border-color: #d1d5db;"',
			)
			.replace(/class="[^"]*space-y-2[^"]*"/g, "")
			.replace(
				/class="[^"]*ml-6[^"]*mb-2[^"]*"/g,
				'style="margin-left: 1.5em; margin-bottom: 0.5em;"',
			)
			.replace(/class="[^"]*hover:[^"]*"/g, "")
			.replace(/class="[^"]*"/g, "");

		return emailHTML;
	};

	// Générer l'aperçu en temps réel
	const generatePreview = useMemo(() => {
		// Convertir le Markdown en HTML
		const htmlContent = parseMarkdown(formData.content);

		// Convertir pour l'email (styles inline)
		const emailContent = convertToEmailHTML(htmlContent);

		// Générer le HTML de la newsletter avec le template (similaire au serveur)
		const newsletterHTML = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${formData.subject || "Newsletter"} - vitalCHECK</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td {font-family: Arial, sans-serif !important;}
  </style>
  <![endif]-->
  <style type="text/css">
    /* Reset styles */
    body, table, td, p, a, li, blockquote {
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    table, td {
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    img {
      -ms-interpolation-mode: bicubic;
      border: 0;
      outline: none;
      text-decoration: none;
    }
    
    /* Responsive styles */
    @media only screen and (max-width: 600px) {
      .container {
        width: 100% !important;
        max-width: 100% !important;
        border-radius: 0 !important;
      }
      .header-padding {
        padding: 15px 10px !important;
      }
      .content-padding {
        padding: 15px 10px !important;
      }
      .footer-padding {
        padding: 15px 10px !important;
      }
      .logo-size {
        width: 50px !important;
        height: 50px !important;
      }
      .title-size {
        font-size: 22px !important;
        line-height: 1.2 !important;
      }
      .subtitle-size {
        font-size: 14px !important;
        line-height: 1.4 !important;
      }
      .text-size {
        font-size: 14px !important;
        line-height: 1.6 !important;
      }
      .footer-text {
        font-size: 11px !important;
        line-height: 1.5 !important;
      }
      .contact-text {
        font-size: 11px !important;
        word-break: break-word !important;
        line-height: 1.6 !important;
      }
      /* Table responsive */
      table[class="responsive-table"] {
        width: 100% !important;
      }
      td[width="50%"] {
        width: 100% !important;
        display: block !important;
        padding: 6px !important;
      }
    }
  </style>
  <!--[if mso]>
  <style type="text/css">
    .container { width: 600px !important; }
    td[width="50%"] { width: 50% !important; }
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="width: 100%; background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 10px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" class="container" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td class="header-padding" style="background: linear-gradient(135deg, #00751B 0%, #F4C542 100%); padding: 20px 15px; text-align: center;">
              <img src="https://www.checkmyenterprise.com/ms-icon-310x310.png" alt="vitalCHECK Logo" class="logo-size" style="width: 50px; height: 50px; max-width: 100%; border-radius: 8px; object-fit: contain; margin-bottom: 10px; background: rgba(255,255,255,0.1); padding: 6px; border-radius: 12px; display: block; margin-left: auto; margin-right: auto;" />
              <h1 class="title-size" style="color: #ffffff; margin: 0; font-size: clamp(20px, 4vw, 28px); font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.2); letter-spacing: -0.5px; line-height: 1.2;">
                ${formData.subject || "Newsletter vitalCHECK"}
              </h1>
              ${formData.previewText ? `<p class="subtitle-size" style="color: rgba(255, 255, 255, 0.95); margin: 8px 0 0 0; font-size: clamp(14px, 2.5vw, 16px); font-weight: 400; line-height: 1.4;">${formData.previewText}</p>` : ""}
            </td>
          </tr>

          ${
						formData.imageUrl ?
							`
          <!-- Image de la newsletter -->
          <tr>
            <td style="padding: 0;">
              <img src="${formData.imageUrl}" alt="${formData.subject || "Newsletter"}" style="width: 100%; max-width: 100%; height: auto; display: block;" />
            </td>
          </tr>
          `
						:	""
					}

          <!-- Contenu principal -->
          <tr>
            <td class="content-padding" style="padding: 20px 15px;">
              <div class="text-size" style="color: #333333; font-size: clamp(14px, 2vw, 16px); line-height: 1.7; word-wrap: break-word;">
                ${emailContent}
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="footer-padding" style="background: #1f2937; padding: 20px 15px; text-align: center;">
              <img src="https://www.checkmyenterprise.com/ms-icon-310x310.png" alt="vitalCHECK Logo" style="width: 40px; height: 40px; max-width: 100%; border-radius: 8px; object-fit: contain; margin: 0 auto 10px auto; background: rgba(255,255,255,0.1); padding: 4px; border-radius: 10px; display: block;" />
              <h3 style="color: #ffffff; margin: 0 0 6px 0; font-size: clamp(16px, 3vw, 18px); font-weight: 700; line-height: 1.2;">Enterprise Health Check</h3>
              <p class="text-size" style="color: #9ca3af; margin: 0; font-size: clamp(12px, 2vw, 13px); line-height: 1.5;">Évaluation Professionnelle d'Entreprise & Conseil en Croissance</p>
              <div style="margin: 15px 0; padding-top: 15px; border-top: 1px solid #374151;">
                <p class="contact-text" style="color: #9ca3af; margin: 0 0 8px 0; font-size: clamp(12px, 2vw, 13px); line-height: 1.6; word-wrap: break-word;">📧 info@checkmyenterprise.com | 📞 +221 788346969</p>
                <p class="footer-text" style="color: #6b7280; margin: 0; font-size: clamp(11px, 1.8vw, 12px);"><a href="https://www.checkmyenterprise.com" style="color: #60a5fa; text-decoration: none;">www.checkmyenterprise.com</a></p>
              </div>
              <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #374151;">
                <p class="footer-text" style="color: #6b7280; margin: 0; font-size: clamp(10px, 1.6vw, 11px); line-height: 1.5; word-wrap: break-word;">Vous recevez cet email car vous êtes abonné à la newsletter vitalCHECK.</p>
                <p class="footer-text" style="color: #4b5563; margin: 10px 0 0 0; font-size: clamp(9px, 1.4vw, 10px);">&copy; ${new Date().getFullYear()} vitalCHECK Enterprise Health Check. Tous droits réservés.</p>
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

		return newsletterHTML;
	}, [
		formData.subject,
		formData.previewText,
		formData.content,
		formData.imageUrl,
	]);

	const handleSend = async () => {
		const isResend = formData.status === "sent";
		const confirmMessage =
			isResend ?
				`Êtes-vous sûr de vouloir RENVOYER cette newsletter à ${recipientCount} destinataires ?`
			:	`Êtes-vous sûr de vouloir envoyer cette newsletter à ${recipientCount} destinataires ?`;

		if (!window.confirm(confirmMessage)) {
			return;
		}

		try {
			setSaving(true);
			const token = localStorage.getItem("adminToken");
			let newsletterId = id;

			// Sauvegarder d'abord si c'est un nouveau brouillon
			if (!isEdit) {
				// Pour un envoi immédiat, on ignore une éventuelle date de programmation
				const payload = {
					...formData,
					scheduledAt: null,
				};
				const saveResponse = await axios.post(
					`${API_BASE_URL}/newsletters/admin/create`,
					payload,
					{
						headers: { Authorization: `Bearer ${token}` },
					},
				);
				newsletterId = saveResponse.data.newsletter._id;
			}

			const response = await axios.post(
				`${API_BASE_URL}/newsletters/admin/${newsletterId}/send`,
				{},
				{
					headers: { Authorization: `Bearer ${token}` },
				},
			);

			if (response.data.success) {
				const message =
					isResend ?
						`Newsletter renvoyée à ${response.data.stats.sent} destinataires`
					:	`Newsletter envoyée à ${response.data.stats.sent} destinataires`;
				toast.success(message);
				navigate("/admin/newsletters");
			}
		} catch (error) {
			console.error("Erreur lors de l'envoi:", error);
			toast.error(error.response?.data?.message || "Erreur lors de l'envoi");
		} finally {
			setSaving(false);
		}
	};

	const handleSchedule = async () => {
		if (!formData.subject.trim()) {
			toast.error("Le sujet est requis");
			return;
		}

		if (!formData.content.trim()) {
			toast.error("Le contenu est requis");
			return;
		}

		if (!formData.scheduledAt) {
			toast.error("Veuillez choisir une date et une heure d’envoi");
			return;
		}

		const scheduledDate = new Date(formData.scheduledAt);
		const now = new Date();

		if (Number.isNaN(scheduledDate.getTime())) {
			toast.error("Date de programmation invalide");
			return;
		}

		if (scheduledDate <= now) {
			toast.error("Veuillez choisir une date ultérieure pour la programmation");
			return;
		}

		try {
			setSaving(true);
			const token = localStorage.getItem("adminToken");
			const scheduledAtISO = scheduledDate.toISOString();

			if (isEdit) {
				await axios.put(
					`${API_BASE_URL}/newsletters/admin/${id}`,
					{
						...formData,
						// Envoyer en ISO avec timezone pour éviter les décalages serveur (UTC vs local)
						scheduledAt: scheduledAtISO,
					},
					{
						headers: { Authorization: `Bearer ${token}` },
					},
				);
				toast.success("Newsletter programmée avec succès");
			} else {
				const response = await axios.post(
					`${API_BASE_URL}/newsletters/admin/create`,
					{
						...formData,
						scheduledAt: scheduledAtISO,
					},
					{
						headers: { Authorization: `Bearer ${token}` },
					},
				);

				if (response.data.success) {
					toast.success("Newsletter programmée avec succès");
				}
			}

			navigate("/admin/newsletters");
		} catch (error) {
			console.error("Erreur lors de la programmation:", error);
			toast.error(
				error.response?.data?.message ||
					"Erreur lors de la programmation de la newsletter",
			);
		} finally {
			setSaving(false);
		}
	};

	// Récupérer les suggestions d'emails depuis les abonnés
	const fetchEmailSuggestions = async (searchTerm) => {
		if (!searchTerm || searchTerm.length < 2) {
			setEmailSuggestions([]);
			setShowSuggestions(false);
			return;
		}

		try {
			setLoadingSuggestions(true);
			const token = localStorage.getItem("adminToken");
			const response = await axios.get(
				`${API_BASE_URL}/newsletters/admin/subscribers`,
				{
					headers: { Authorization: `Bearer ${token}` },
					params: {
						search: searchTerm,
						limit: 10,
						page: 1,
					},
				},
			);

			if (response.data.success) {
				const emails = response.data.subscribers
					.map((sub) => sub.email)
					.filter((email) => {
						// Filtrer les emails déjà ajoutés
						return !formData.recipients.customEmails?.includes(email);
					})
					.slice(0, 10); // Limiter à 10 suggestions
				setEmailSuggestions(emails);
				setShowSuggestions(emails.length > 0);
			}
		} catch (error) {
			console.error("Erreur lors de la récupération des suggestions:", error);
			setEmailSuggestions([]);
			setShowSuggestions(false);
		} finally {
			setLoadingSuggestions(false);
		}
	};

	const handleEmailInputChange = (e) => {
		const value = e.target.value;
		setCustomEmailInput(value);
		fetchEmailSuggestions(value);
	};

	const selectEmail = (email) => {
		setCustomEmailInput(email);
		setShowSuggestions(false);
		setEmailSuggestions([]);
		// Ajouter automatiquement l'email sélectionné
		addCustomEmail(email);
	};

	// Charger tous les abonnés pour la sélection multiple
	const fetchAllSubscribers = async () => {
		try {
			setLoadingSubscribers(true);
			const token = localStorage.getItem("adminToken");

			// Charger tous les abonnés (avec une limite raisonnable)
			const response = await axios.get(
				`${API_BASE_URL}/newsletters/admin/subscribers`,
				{
					headers: { Authorization: `Bearer ${token}` },
					params: {
						limit: 1000, // Limite élevée pour charger beaucoup d'abonnés
						page: 1,
					},
				},
			);

			if (response.data.success) {
				setAllSubscribers(response.data.subscribers);
			}
		} catch (error) {
			console.error("Erreur lors du chargement des abonnés:", error);
			toast.error("Erreur lors du chargement de la liste des abonnés");
		} finally {
			setLoadingSubscribers(false);
		}
	};

	// Filtrer les abonnés selon le terme de recherche
	const filteredSubscribers = useMemo(() => {
		if (!subscriberSearchTerm) return allSubscribers;

		const searchLower = subscriberSearchTerm.toLowerCase();
		return allSubscribers.filter(
			(sub) =>
				sub.email.toLowerCase().includes(searchLower) ||
				(sub.firstName && sub.firstName.toLowerCase().includes(searchLower)) ||
				(sub.lastName && sub.lastName.toLowerCase().includes(searchLower)),
		);
	}, [allSubscribers, subscriberSearchTerm]);

	// Gérer la sélection/désélection d'un abonné
	const toggleSubscriberSelection = (email) => {
		setSelectedSubscriberEmails((prev) => {
			if (prev.includes(email)) {
				return prev.filter((e) => e !== email);
			} else {
				return [...prev, email];
			}
		});
	};

	// Sélectionner/désélectionner tous les abonnés filtrés
	const toggleAllSubscribers = () => {
		const filteredEmails = filteredSubscribers.map((sub) => sub.email);
		const allSelected = filteredEmails.every((email) =>
			selectedSubscriberEmails.includes(email),
		);

		if (allSelected) {
			// Désélectionner tous les emails filtrés
			setSelectedSubscriberEmails((prev) =>
				prev.filter((email) => !filteredEmails.includes(email)),
			);
		} else {
			// Sélectionner tous les emails filtrés qui ne sont pas déjà dans la liste
			const currentEmails = formData.recipients.customEmails || [];
			const newSelections = filteredEmails.filter(
				(email) => !currentEmails.includes(email),
			);
			setSelectedSubscriberEmails((prev) => {
				const combined = [...prev, ...newSelections];
				return [...new Set(combined)]; // Supprimer les doublons
			});
		}
	};

	// Ajouter les emails sélectionnés à la liste des destinataires
	const addSelectedSubscribers = () => {
		if (selectedSubscriberEmails.length === 0) {
			toast.error("Aucun email sélectionné");
			return;
		}

		const currentEmails = formData.recipients.customEmails || [];
		const newEmails = selectedSubscriberEmails.filter(
			(email) => !currentEmails.includes(email),
		);

		if (newEmails.length === 0) {
			toast.error("Tous les emails sélectionnés sont déjà dans la liste");
			return;
		}

		const newCustomEmails = [...currentEmails, ...newEmails];
		setFormData({
			...formData,
			recipients: {
				...formData.recipients,
				customEmails: newCustomEmails,
			},
		});

		setSelectedSubscriberEmails([]);
		setRecipientCount(newCustomEmails.length);
		toast.success(
			`${newEmails.length} email${newEmails.length > 1 ? "s" : ""} ajouté${newEmails.length > 1 ? "s" : ""}`,
		);
	};

	const addCustomEmail = (emailToAdd = null) => {
		const email = (emailToAdd || customEmailInput).trim();
		if (!email) return;

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			toast.error("Email invalide");
			return;
		}

		const currentEmails = formData.recipients.customEmails || [];
		if (currentEmails.includes(email)) {
			toast.error("Cet email est déjà dans la liste");
			return;
		}

		const newCustomEmails = [...currentEmails, email];
		setFormData({
			...formData,
			recipients: {
				...formData.recipients,
				customEmails: newCustomEmails,
			},
		});

		setCustomEmailInput("");
		setShowSuggestions(false);
		setEmailSuggestions([]);
		// Mettre à jour le comptage immédiatement pour le type custom
		if (formData.recipients.type === "custom") {
			setRecipientCount(newCustomEmails.length);
		}
		toast.success("Email ajouté");
	};

	const removeCustomEmail = (email) => {
		const currentEmails = formData.recipients.customEmails || [];
		const newCustomEmails = currentEmails.filter((e) => e !== email);
		setFormData({
			...formData,
			recipients: {
				...formData.recipients,
				customEmails: newCustomEmails,
			},
		});
		// Mettre à jour le comptage immédiatement pour le type custom
		if (formData.recipients.type === "custom") {
			setRecipientCount(newCustomEmails.length);
		}
	};

	const handleImageUpload = async (e) => {
		const file = e.target.files?.[0];
		if (!file) return;

		// Vérifier le type de fichier
		if (!file.type.startsWith("image/")) {
			toast.error("Veuillez sélectionner un fichier image");
			return;
		}

		// Vérifier la taille (5MB max)
		if (file.size > 5 * 1024 * 1024) {
			toast.error("L'image ne doit pas dépasser 5MB");
			return;
		}

		setUploadingImage(true);
		try {
			const formData = new FormData();
			formData.append("image", file);

			const response = await uploadApiService.uploadImage(formData);

			if (response.data.success) {
				setFormData((prev) => ({
					...prev,
					imageUrl: response.data.data.url,
				}));
				toast.success("Image uploadée avec succès");
			}
		} catch (error) {
			console.error("Erreur lors de l'upload:", error);
			toast.error(
				error.response?.data?.message || "Erreur lors de l'upload de l'image",
			);
		} finally {
			setUploadingImage(false);
		}
	};

	const handleRemoveImage = () => {
		setFormData((prev) => ({
			...prev,
			imageUrl: "",
		}));
		toast.success("Image supprimée");
	};

	if (loading) {
		return (
			<AdminLayout>
				<div className="flex items-center justify-center h-64">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
				</div>
			</AdminLayout>
		);
	}

	return (
		<AdminLayout>
			<div className="p-4 sm:p-6 lg:p-8">
				{/* Header */}
				<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
					<div className="flex items-center gap-2 sm:gap-4">
						<button
							onClick={() => navigate("/admin/newsletters")}
							className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
							aria-label="Retour"
						>
							<ArrowLeft className="w-5 h-5" />
						</button>
						<div className="min-w-0 flex-1">
							<h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">
								{isEdit ? "Modifier la Newsletter" : "Nouvelle Newsletter"}
							</h1>
							<p className="text-sm sm:text-base text-gray-600 mt-1">
								{isEdit ?
									"Modifiez votre newsletter"
								:	"Créez une nouvelle newsletter"}
							</p>
						</div>
					</div>

					<div className="flex flex-wrap items-center gap-2 sm:gap-2">
						<button
							onClick={() => setShowPreview(true)}
							className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm text-sm sm:text-base"
							title="Afficher l'aperçu en popup"
						>
							<Eye className="w-4 h-4 sm:w-5 sm:h-5" />
							<span className="hidden sm:inline">Aperçu</span>
						</button>
						<button
							onClick={handleSave}
							disabled={saving}
							className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 shadow-sm text-sm sm:text-base"
						>
							<Save className="w-4 h-4 sm:w-5 sm:h-5" />
							<span className="hidden sm:inline">
								{saving ? "Enregistrement..." : "Enregistrer"}
							</span>
							<span className="sm:hidden">{saving ? "..." : "Sauver"}</span>
						</button>
						<button
							onClick={handleSchedule}
							disabled={saving || recipientCount === 0}
							className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-sm text-sm sm:text-base"
						>
							<Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
							<span className="hidden sm:inline">
								{saving ? "Programmation..." : "Programmer"}
							</span>
							<span className="sm:hidden">{saving ? "..." : "Prog."}</span>
						</button>
						{isEdit && (
							<button
								onClick={handleSend}
								disabled={saving || recipientCount === 0}
								className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg transition-colors disabled:opacity-50 shadow-sm text-sm sm:text-base ${
									formData.status === "sent" ?
										"bg-orange-600 hover:bg-orange-700 text-white"
									:	"bg-green-600 hover:bg-green-700 text-white"
								}`}
							>
								<Send className="w-4 h-4 sm:w-5 sm:h-5" />
								<span className="hidden sm:inline">
									{formData.status === "sent" ? "Renvoyer" : "Envoyer"}
								</span>
								<span className="sm:hidden">
									{formData.status === "sent" ? "Renvoyer" : "Envoyer"}
								</span>
							</button>
						)}
					</div>
				</div>

				<div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-3">
					{/* Formulaire principal */}
					<div className="space-y-4 sm:space-y-6 lg:col-span-2">
						{/* Sujet */}
						<div className="bg-white shadow-lg rounded-xl border border-gray-100 p-4 sm:p-6">
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Sujet de l'email *
							</label>
							<input
								type="text"
								value={formData.subject}
								onChange={(e) =>
									setFormData({ ...formData, subject: e.target.value })
								}
								placeholder="Ex: Nouvelles fonctionnalités de vitalCHECK"
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500"
							/>
						</div>

						{/* Texte d'aperçu */}
						<div className="bg-white shadow-lg rounded-xl border border-gray-100 p-4 sm:p-6">
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Texte d'aperçu (optionnel)
							</label>
							<input
								type="text"
								value={formData.previewText}
								onChange={(e) =>
									setFormData({ ...formData, previewText: e.target.value })
								}
								placeholder="Court texte qui apparaît dans l'aperçu de l'email"
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500"
							/>
							<p className="text-xs text-gray-500 mt-1">
								Ce texte apparaît dans l'aperçu de l'email avant l'ouverture
							</p>
						</div>

						{/* Image de la newsletter */}
						<div className="bg-white shadow-lg rounded-xl border border-gray-100 p-4 sm:p-6">
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Image de la newsletter (optionnel)
							</label>

							{formData.imageUrl ?
								<div className="space-y-3">
									<div className="relative rounded-lg overflow-hidden border border-gray-200">
										<img
											src={formData.imageUrl}
											alt="Newsletter"
											className="w-full h-auto max-h-64 object-contain"
										/>
									</div>
									<button
										type="button"
										onClick={handleRemoveImage}
										className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
									>
										<Trash2 className="w-4 h-4" />
										Supprimer l'image
									</button>
								</div>
							:	<div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
									<input
										type="file"
										accept="image/*"
										onChange={handleImageUpload}
										disabled={uploadingImage}
										className="hidden"
										id="image-upload"
									/>
									<label
										htmlFor="image-upload"
										className="cursor-pointer flex flex-col items-center gap-2"
									>
										{uploadingImage ?
											<>
												<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
												<span className="text-sm text-gray-600">
													Upload en cours...
												</span>
											</>
										:	<>
												<Upload className="w-8 h-8 text-gray-400" />
												<span className="text-sm text-gray-600">
													Cliquez pour uploader une image
												</span>
												<span className="text-xs text-gray-500">
													Formats acceptés: JPG, PNG, GIF (max 5MB)
												</span>
											</>
										}
									</label>
								</div>
							}
							<p className="text-xs text-gray-500 mt-2">
								L'image sera affichée en haut de la newsletter, juste après le
								header
							</p>
						</div>

						{/* Contenu */}
						<div className="bg-white shadow-lg rounded-xl border border-gray-100 p-4 sm:p-6">
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Contenu de la newsletter *
							</label>
							<SimpleTextEditor
								value={formData.content}
								onChange={(content) => setFormData({ ...formData, content })}
								placeholder="Rédigez le contenu de votre newsletter..."
							/>
						</div>
					</div>

					{/* Panneau latéral - Destinataires */}
					<div className="space-y-4 sm:space-y-6 lg:col-span-1">
						{/* Destinataires */}
						<div className="bg-white shadow-lg rounded-xl border border-gray-100 p-4 sm:p-6">
							<div className="flex items-center gap-2 mb-4">
								<Users className="w-5 h-5 text-primary-600" />
								<h3 className="text-lg font-semibold text-gray-900">
									Destinataires
								</h3>
							</div>

							<div className="space-y-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Type de destinataires
									</label>
									<select
										value={formData.recipients.type}
										onChange={(e) =>
											setFormData({
												...formData,
												recipients: {
													...formData.recipients,
													type: e.target.value,
												},
											})
										}
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500"
									>
										<option value="all">Tous les abonnés actifs</option>
										<option value="active">Abonnés actifs uniquement</option>
										<option value="tags">Par tags (à venir)</option>
										<option value="custom">Emails personnalisés</option>
									</select>
								</div>

								{formData.recipients.type === "custom" && (
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Ajouter un email
										</label>
										<div className="relative flex flex-col sm:flex-row gap-2">
											<div className="flex-1 relative">
												<input
													type="email"
													value={customEmailInput}
													onChange={handleEmailInputChange}
													onKeyPress={(e) =>
														e.key === "Enter" && addCustomEmail()
													}
													onFocus={() => {
														if (emailSuggestions.length > 0) {
															setShowSuggestions(true);
														}
													}}
													onBlur={() => {
														// Délai pour permettre le clic sur une suggestion
														setTimeout(() => setShowSuggestions(false), 200);
													}}
													placeholder="Tapez un email ou sélectionnez depuis la liste"
													className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm sm:text-base"
												/>
												{showSuggestions && emailSuggestions.length > 0 && (
													<div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
														{loadingSuggestions ?
															<div className="px-3 py-2 text-sm text-gray-500 text-center">
																Chargement...
															</div>
														:	emailSuggestions.map((suggestion, index) => (
																<button
																	key={index}
																	type="button"
																	onClick={() => selectEmail(suggestion)}
																	className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors border-b border-gray-100 last:border-b-0"
																>
																	{suggestion}
																</button>
															))
														}
													</div>
												)}
											</div>
											<button
												onClick={() => addCustomEmail()}
												className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm text-sm sm:text-base whitespace-nowrap"
											>
												Ajouter
											</button>
										</div>
										<p className="text-xs text-gray-500 mt-1">
											Tapez pour rechercher dans les abonnés ou saisissez un
											nouvel email
										</p>

										{formData.recipients.customEmails.length > 0 && (
											<div className="mt-2 space-y-2">
												{formData.recipients.customEmails.map((email) => (
													<div
														key={email}
														className="flex items-center justify-between gap-2 px-3 py-2 bg-gray-50 rounded-lg"
													>
														<span className="text-xs sm:text-sm text-gray-700 truncate flex-1 min-w-0">
															{email}
														</span>
														<button
															onClick={() => removeCustomEmail(email)}
															className="text-red-600 hover:text-red-800 flex-shrink-0 p-1 hover:bg-red-50 rounded transition-colors"
															aria-label={`Supprimer ${email}`}
															title={`Supprimer ${email}`}
														>
															<X className="w-4 h-4" />
														</button>
													</div>
												))}
											</div>
										)}

										{/* Section de sélection multiple des abonnés */}
										<div className="mt-6 pt-6 border-t border-gray-200">
											<div className="flex items-center justify-between mb-3">
												<label className="block text-sm font-medium text-gray-700">
													Sélectionner depuis les abonnés inscrits
												</label>
												{filteredSubscribers.length > 0 && (
													<button
														onClick={toggleAllSubscribers}
														className="text-xs text-primary-600 hover:text-primary-700 font-medium"
													>
														{(
															filteredSubscribers.every((sub) =>
																selectedSubscriberEmails.includes(sub.email),
															)
														) ?
															"Tout désélectionner"
														:	"Tout sélectionner"}
													</button>
												)}
											</div>

											{/* Barre de recherche pour les abonnés */}
											<div className="mb-3">
												<input
													type="text"
													value={subscriberSearchTerm}
													onChange={(e) =>
														setSubscriberSearchTerm(e.target.value)
													}
													placeholder="Rechercher un abonné..."
													className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
												/>
											</div>

											{/* Liste des abonnés avec checkboxes */}
											<div className="border border-gray-200 rounded-lg max-h-60 overflow-y-auto bg-white">
												{loadingSubscribers ?
													<div className="px-4 py-8 text-center text-sm text-gray-500">
														Chargement des abonnés...
													</div>
												: filteredSubscribers.length === 0 ?
													<div className="px-4 py-8 text-center text-sm text-gray-500">
														{subscriberSearchTerm ?
															"Aucun abonné trouvé"
														:	"Aucun abonné disponible"}
													</div>
												:	<div className="divide-y divide-gray-100">
														{filteredSubscribers.map((subscriber) => {
															const isSelected =
																selectedSubscriberEmails.includes(
																	subscriber.email,
																);
															const isAlreadyAdded =
																formData.recipients.customEmails?.includes(
																	subscriber.email,
																);

															return (
																<label
																	key={subscriber.email}
																	className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer ${
																		isAlreadyAdded ?
																			"opacity-50 bg-gray-50"
																		:	""
																	}`}
																>
																	<input
																		type="checkbox"
																		checked={isSelected}
																		onChange={() =>
																			!isAlreadyAdded &&
																			toggleSubscriberSelection(
																				subscriber.email,
																			)
																		}
																		disabled={isAlreadyAdded}
																		className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
																	/>
																	<div className="flex-1 min-w-0">
																		<div className="text-sm font-medium text-gray-900 truncate">
																			{subscriber.email}
																		</div>
																		{(subscriber.firstName ||
																			subscriber.lastName) && (
																			<div className="text-xs text-gray-500 truncate">
																				{[
																					subscriber.firstName,
																					subscriber.lastName,
																				]
																					.filter(Boolean)
																					.join(" ")}
																			</div>
																		)}
																	</div>
																	{isAlreadyAdded && (
																		<span className="text-xs text-gray-400 italic">
																			Déjà ajouté
																		</span>
																	)}
																</label>
															);
														})}
													</div>
												}
											</div>

											{/* Bouton pour ajouter les sélections */}
											{selectedSubscriberEmails.length > 0 && (
												<div className="mt-3 flex items-center justify-between">
													<span className="text-sm text-gray-600">
														{selectedSubscriberEmails.length} email
														{selectedSubscriberEmails.length > 1 ?
															"s"
														:	""}{" "}
														sélectionné
														{selectedSubscriberEmails.length > 1 ? "s" : ""}
													</span>
													<button
														onClick={addSelectedSubscribers}
														className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm text-sm font-medium"
													>
														Ajouter les sélections
													</button>
												</div>
											)}
										</div>
									</div>
								)}

								<div className="pt-4 border-t border-gray-200">
									<div className="flex items-center gap-2 text-sm">
										<Mail className="w-4 h-4 text-primary-600" />
										<span className="text-gray-700">
											<strong>{recipientCount}</strong> destinataire
											{recipientCount > 1 ? "s" : ""}
										</span>
									</div>
								</div>
							</div>
						</div>

						{/* Programmation */}
						<div className="bg-white shadow-lg rounded-xl border border-gray-100 p-4 sm:p-6">
							<div className="flex items-center gap-2 mb-4">
								<Calendar className="w-5 h-5 text-primary-600" />
								<h3 className="text-lg font-semibold text-gray-900">
									Programmation
								</h3>
							</div>

							<div className="space-y-3">
								<p className="text-sm text-gray-600">
									Choisissez une date ultérieure pour envoyer automatiquement
									cette newsletter, ou laissez vide pour un envoi immédiat.
								</p>

								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Date et heure d’envoi
									</label>
									<input
										type="datetime-local"
										value={formData.scheduledAt}
										onChange={(e) =>
											setFormData((prev) => ({
												...prev,
												scheduledAt: e.target.value,
											}))
										}
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
									/>
									<p className="text-xs text-gray-500 mt-1">
										Fuseau horaire basé sur l’horloge de votre navigateur.
									</p>
								</div>

								{formData.scheduledAt && (
									<div className="mt-2 rounded-lg bg-blue-50 border border-blue-100 px-3 py-2 text-xs text-blue-800">
										La newsletter sera marquée comme{" "}
										<span className="font-semibold">programmée</span> pour le{" "}
										{new Date(formData.scheduledAt).toLocaleString("fr-FR")}.
									</div>
								)}
							</div>
						</div>

						{/* Aide */}
						<div className="bg-blue-50 rounded-xl border border-blue-100 p-4 sm:p-6">
							<h3 className="text-sm font-semibold text-blue-900 mb-2">
								💡 Conseils
							</h3>
							<ul className="text-xs sm:text-sm text-blue-800 space-y-1">
								<li>• Rédigez un sujet accrocheur</li>
								<li>• Utilisez le texte d'aperçu pour inciter à l'ouverture</li>
								<li>• Testez avec l'aperçu avant l'envoi</li>
								<li>• Vérifiez le nombre de destinataires</li>
							</ul>
						</div>
					</div>
				</div>

				{/* Modal d'aperçu en popup */}
				{showPreview && (
					<div
						className="fixed inset-0 z-50 overflow-y-auto"
						aria-labelledby="modal-title"
						role="dialog"
						aria-modal="true"
					>
						{/* Overlay */}
						<div
							className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
							onClick={() => setShowPreview(false)}
						></div>

						{/* Modal */}
						<div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
							<div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all w-full max-w-4xl max-h-[90vh] flex flex-col">
								{/* Header */}
								<div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
									<h3 className="text-lg font-semibold text-gray-900">
										Aperçu de la Newsletter
									</h3>
									<button
										onClick={() => setShowPreview(false)}
										className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
										title="Fermer l'aperçu"
										aria-label="Fermer l'aperçu"
									>
										<X className="w-5 h-5 text-gray-500" />
									</button>
								</div>

								{/* Content */}
								<div className="flex-1 overflow-y-auto overflow-x-auto bg-gray-50 p-4 sm:p-6">
									<div
										className="bg-white w-full max-w-full mx-auto"
										style={{
											boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
											overflow: "hidden",
										}}
										dangerouslySetInnerHTML={{ __html: generatePreview }}
									/>
								</div>

								{/* Footer */}
								<div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
									<button
										onClick={() => setShowPreview(false)}
										className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm sm:text-base"
									>
										Fermer
									</button>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</AdminLayout>
	);
};

export default NewsletterEditPage;
