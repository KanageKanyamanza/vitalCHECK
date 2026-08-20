const htmlPdf = require("html-pdf-node");
const {
	getLevelColor,
	getLevelLabel,
	getLevelInterpretation,
	rankPillars,
} = require("./scoringV2");

// Configuration pour html-pdf-node
const pdfOptions = {
	format: "A4",
	margin: {
		top: "15mm",
		right: "15mm",
		bottom: "15mm",
		left: "15mm",
	},
	printBackground: true,
	displayHeaderFooter: false,
	preferCSSPageSize: true,
};

// Configuration pour Render.com et autres environnements
const launchOptions = {
	args: [
		"--no-sandbox",
		"--disable-setuid-sandbox",
		"--disable-dev-shm-usage",
		"--disable-gpu",
		"--single-process",
		"--no-zygote",
	],
};

const COMPANY_SIZE_LABELS = {
	fr: {
		micro: "Micro (1-9 employés)",
		sme: "PME (10-49 employés)",
		"large-sme": "Grande PME (50+ employés)",
	},
	en: {
		micro: "Micro (1-9 employees)",
		sme: "SME (10-49 employees)",
		"large-sme": "Large SME (50+ employees)",
	},
};

const TEXTS = {
	fr: {
		title: "Diagnostic VitalCHECK – Niveau 1",
		subtitle: "Calculez votre indice de préparation",
		companyName: "Entreprise",
		companySize: "Taille",
		assessmentDate: "Date du diagnostic",
		pillarScores: "Scores par pilier",
		globalScore: "Score global",
		page2Title: "Votre réalité stratégique",
		topRisks: "Principaux risques identifiés",
		topStrengths: "Vos points forts à valoriser",
		nextSteps: "Vos 3 prochaines actions prioritaires",
		benefitsTitle: "Allez plus loin avec le diagnostic Premium",
		benefits: [
			"Une analyse approfondie de chacun des 5 piliers de votre entreprise",
			"Des recommandations personnalisées et un plan d'action détaillé",
			"Un benchmarking par rapport aux entreprises de votre secteur",
			"Un appel de consultation avec nos experts pour prioriser vos actions",
		],
		ctaButton: "Réserver mon diagnostic Premium",
		generatedOn: "Généré le",
		footerNote:
			"Ce rapport présente les résultats de votre auto-évaluation gratuite (Niveau 1). Les scores reflètent votre perception actuelle et constituent un point de départ pour identifier vos priorités.",
	},
	en: {
		title: "VitalCHECK Diagnostic – Level 1",
		subtitle: "Calculate your readiness score",
		companyName: "Company",
		companySize: "Company size",
		assessmentDate: "Assessment date",
		pillarScores: "Pillar scores",
		globalScore: "Global score",
		page2Title: "Your strategic reality",
		topRisks: "Main risks identified",
		topStrengths: "Your strengths to leverage",
		nextSteps: "Your 3 priority next steps",
		benefitsTitle: "Go further with the Premium diagnostic",
		benefits: [
			"An in-depth analysis of each of the 5 pillars of your business",
			"Tailored recommendations and a detailed action plan",
			"Benchmarking against companies in your sector",
			"A consultation call with our experts to prioritize your actions",
		],
		ctaButton: "Book my Premium diagnostic",
		generatedOn: "Generated on",
		footerNote:
			"This report presents the results of your free self-assessment (Level 1). Scores reflect your current perception and serve as a starting point to identify your priorities.",
	},
};

/**
 * Génère le PDF du rapport v2 (2 pages, inspiré du format Cerclos)
 * @param {Object} data
 * @param {string} data.companyName
 * @param {string} [data.companySize]
 * @param {string} [data.sector]
 * @param {string} [data.language]
 * @param {Array} data.pillarScores - [{pillarId, pillarName, score, level}]
 * @param {number} data.overallScore
 * @param {string} data.overallLevel
 * @param {Array} data.recommendations - [{pillarId, pillarName, recommendations: []}]
 * @param {Date} [data.completedAt]
 */
async function generateV2PDFReport(data) {
	try {
		const htmlContent = generateV2HTMLContent(data);

		const options = {
			...pdfOptions,
			args: launchOptions.args,
		};

		const file = { content: htmlContent };

		return await htmlPdf.generatePdf(file, options);
	} catch (error) {
		console.error("V2 PDF generation error:", error);
		throw error;
	}
}

function generateV2HTMLContent(data) {
	const {
		companyName,
		companySize,
		sector,
		language = "fr",
		pillarScores = [],
		overallScore = 0,
		overallLevel = "critique",
		recommendations = [],
		completedAt = new Date(),
	} = data;

	const t = TEXTS[language] || TEXTS.fr;
	const sizeLabels = COMPANY_SIZE_LABELS[language] || COMPANY_SIZE_LABELS.fr;

	const overallColor = getLevelColor(overallLevel);
	const overallLabel = getLevelLabel(overallLevel, language);
	const overallInterpretation = getLevelInterpretation(overallLevel, language);

	const { weakest, strongest } = rankPillars(pillarScores);

	// Récupère les recommandations associées à un pilier
	const recsFor = (pillarId) => {
		const found = recommendations.find((r) => r.pillarId === pillarId);
		return found ? found.recommendations : [];
	};

	// 3 prochaines actions prioritaires : recommandations des piliers les plus faibles
	const nextSteps = weakest
		.flatMap((p) => recsFor(p.pillarId))
		.filter(Boolean)
		.slice(0, 3);

	const formattedDate = new Date(completedAt).toLocaleDateString(
		language === "fr" ? "fr-FR" : "en-US",
	);

	return `
    <!DOCTYPE html>
    <html lang="${language}">
    <head>
      <meta charset="UTF-8">
      <title>${t.title}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.5;
          color: #333;
          background: white;
        }

        .page {
          padding: 8px 5px;
        }

        .page-break {
          page-break-before: always;
        }

        .header {
          background: linear-gradient(135deg, #F4C542 0%, #00751B 100%);
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 12px;
          margin-bottom: 25px;
        }

        .header h1 {
          font-size: 24px;
          font-weight: 700;
        }

        .header p {
          margin-top: 8px;
          font-size: 14px;
          opacity: 0.95;
        }

        .company-details {
          background: #f8fafc;
          border-radius: 12px;
          padding: 18px 22px;
          margin-bottom: 25px;
          border: 1px solid #e2e8f0;
        }

        .company-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .company-label {
          color: #718096;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          margin-bottom: 4px;
        }

        .company-value {
          color: #2d3748;
          font-weight: 600;
          font-size: 14px;
        }

        h2.section-title {
          font-size: 18px;
          color: #2d3748;
          margin-bottom: 10px;
          border-bottom: 2px solid #F4C542;
          padding-bottom: 6px;
        }

        .pillar-list {
          margin-bottom: 30px;
        }

        .pillar-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          background: #f8fafc;
          border-radius: 8px;
          margin-bottom: 10px;
          border-left: 4px solid #F4C542;
        }

        .pillar-name {
          font-weight: 600;
          color: #2d3748;
          font-size: 14px;
        }

        .pillar-score-wrapper {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .pillar-bar-bg {
          width: 120px;
          height: 8px;
          border-radius: 4px;
          background: #e2e8f0;
          overflow: hidden;
        }

        .pillar-bar-fill {
          height: 100%;
          border-radius: 4px;
        }

        .pillar-score-value {
          font-weight: 700;
          font-size: 14px;
          color: #2d3748;
          min-width: 50px;
          text-align: right;
        }

        .global-score-section {
          text-align: center;
          background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
          border-radius: 16px;
          padding: 30px;
          border: 1px solid #e2e8f0;
        }

        .global-score-circle {
          width: 130px;
          height: 130px;
          border-radius: 50%;
          background: ${overallColor};
          color: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin: 0 auto 18px auto;
        }

        .global-score-circle .value {
          font-size: 36px;
          font-weight: 700;
          line-height: 1;
        }

        .global-score-circle .max {
          font-size: 13px;
          opacity: 0.9;
        }

        .level-badge {
          display: inline-block;
          background: ${overallColor};
          color: white;
          padding: 8px 22px;
          border-radius: 24px;
          font-weight: 700;
          font-size: 16px;
          margin-bottom: 14px;
        }

        .interpretation {
          font-size: 14px;
          color: #4a5568;
          max-width: 480px;
          margin: 0 auto;
        }

        .insight-block {
          margin-bottom: 14px;
        }

        .insight-item {
          background: #f8fafc;
          border-radius: 8px;
          padding: 10px 14px;
          margin-bottom: 6px;
          border-left: 4px solid #cbd5e0;
        }

        .insight-item.risk {
          border-left-color: #EF4444;
        }

        .insight-item.strength {
          border-left-color: #10B981;
        }

        .insight-item .pillar-title {
          font-weight: 700;
          color: #2d3748;
          font-size: 14px;
          margin-bottom: 3px;
        }

        .insight-item .pillar-score {
          font-weight: 600;
          font-size: 12px;
          color: #718096;
          margin-bottom: 4px;
        }

        .insight-item ul {
          margin: 0;
          padding-left: 18px;
          font-size: 12px;
          color: #4a5568;
        }

        .next-steps-list {
          counter-reset: step;
          margin-bottom: 14px;
        }

        .next-steps-list .step {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          background: #fffbeb;
          border-radius: 8px;
          padding: 10px 14px;
          margin-bottom: 6px;
          border-left: 4px solid #F4C542;
        }

        .step-number {
          background: #00751B;
          color: white;
          width: 26px;
          height: 26px;
          min-width: 26px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 13px;
        }

        .step-text {
          font-size: 13px;
          color: #4a5568;
        }

        .premium-section {
          background: linear-gradient(135deg, #F4C542 0%, #00751B 100%);
          color: white;
          padding: 18px;
          border-radius: 16px;
          margin-top: 8px;
        }

        .premium-section h3 {
          font-size: 18px;
          margin-bottom: 10px;
          text-align: center;
        }

        .premium-section ul {
          list-style: none;
          padding: 0;
          margin-bottom: 10px;
        }

        .premium-section li {
          padding: 5px 0 5px 28px;
          position: relative;
          font-size: 13px;
        }

        .premium-section li::before {
          content: '✓';
          position: absolute;
          left: 0;
          font-weight: 700;
          font-size: 16px;
        }

        .premium-button {
          display: block;
          width: fit-content;
          margin: 0 auto;
          background: white;
          color: #00751B;
          padding: 12px 28px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 15px;
          text-decoration: none;
          text-align: center;
        }

        .footer-note {
          margin-top: 10px;
          font-size: 10px;
          line-height: 1.3;
          color: #a0aec0;
          text-align: center;
        }

        @media print {
          body { -webkit-print-color-adjust: exact; }
          .header { break-inside: avoid; }
          .global-score-section { break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <!-- PAGE 1 : Calculate Your Readiness -->
      <div class="page">
        <div class="header">
          <h1>${t.title}</h1>
          <p>${t.subtitle}</p>
        </div>

        <div class="company-details">
          <div class="company-grid">
            <div>
              <div class="company-label">${t.companyName}</div>
              <div class="company-value">${companyName || "-"}</div>
            </div>
            ${companySize ? `
            <div>
              <div class="company-label">${t.companySize}</div>
              <div class="company-value">${sizeLabels[companySize] || companySize}</div>
            </div>` : ""}
            <div>
              <div class="company-label">${t.assessmentDate}</div>
              <div class="company-value">${formattedDate}</div>
            </div>
          </div>
        </div>

        <h2 class="section-title">${t.pillarScores}</h2>
        <div class="pillar-list">
          ${pillarScores
						.map(
							(pillar) => `
            <div class="pillar-row">
              <div class="pillar-name">${pillar.pillarName}</div>
              <div class="pillar-score-wrapper">
                <div class="pillar-bar-bg">
                  <div class="pillar-bar-fill" style="width: ${pillar.score}%; background: ${getLevelColor(pillar.level)};"></div>
                </div>
                <div class="pillar-score-value">${pillar.score}/100</div>
              </div>
            </div>
          `,
						)
						.join("")}
        </div>

        <div class="global-score-section">
          <div class="global-score-circle">
            <div class="value">${overallScore}</div>
            <div class="max">/100</div>
          </div>
          <div class="level-badge">${overallLabel}</div>
          <div class="interpretation">${overallInterpretation}</div>
        </div>
      </div>

      <!-- PAGE 2 : Strategic Reality -->
      <div class="page page-break">
        <h2 class="section-title">${t.page2Title}</h2>

        <div class="insight-block">
          <h3 style="font-size: 14px; color: #2d3748; margin-bottom: 6px;">${t.topRisks}</h3>
          ${weakest
						.map(
							(pillar) => `
            <div class="insight-item risk">
              <div class="pillar-title">${pillar.pillarName}</div>
              <div class="pillar-score">${pillar.score}/100 — ${getLevelLabel(pillar.level, language)}</div>
              <ul>
                ${recsFor(pillar.pillarId).map((rec) => `<li>${rec}</li>`).join("")}
              </ul>
            </div>
          `,
						)
						.join("")}
        </div>

        <div class="insight-block">
          <h3 style="font-size: 14px; color: #2d3748; margin-bottom: 6px;">${t.topStrengths}</h3>
          ${strongest
						.map(
							(pillar) => `
            <div class="insight-item strength">
              <div class="pillar-title">${pillar.pillarName}</div>
              <div class="pillar-score">${pillar.score}/100 — ${getLevelLabel(pillar.level, language)}</div>
            </div>
          `,
						)
						.join("")}
        </div>

        <h3 style="font-size: 14px; color: #2d3748; margin-bottom: 6px;">${t.nextSteps}</h3>
        <div class="next-steps-list">
          ${nextSteps
						.map(
							(step, index) => `
            <div class="step">
              <div class="step-number">${index + 1}</div>
              <div class="step-text">${step}</div>
            </div>
          `,
						)
						.join("")}
        </div>

        <div class="premium-section">
          <h3>${t.benefitsTitle}</h3>
          <ul>
            ${t.benefits.map((b) => `<li>${b}</li>`).join("")}
          </ul>
          <a href="https://checkmyenterprise.com/checkout?plan=premium" class="premium-button">${t.ctaButton}</a>
        </div>

        <div class="footer-note">
          <p>${t.footerNote}</p>
          <p>${t.generatedOn} ${new Date().toLocaleDateString(language === "fr" ? "fr-FR" : "en-US")} — vitalCHECK · UBUNTU BUSINESS BUILDERS (UBB) – SARL · Dakar, Sénégal</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// ─── Premium PDF (3 pages : rapport standard + page IA) ───────────────────────

const PREMIUM_TEXTS = {
	fr: {
		premiumTitle: 'Recommandations Personnalisées — Premium',
		premiumSubtitle: 'Analyse approfondie générée par intelligence artificielle à partir de vos résultats',
		fallbackNote: 'Vos recommandations approfondies sont en cours de préparation.',
		badge: 'RAPPORT PREMIUM',
	},
	en: {
		premiumTitle: 'Personalized Recommendations — Premium',
		premiumSubtitle: 'In-depth analysis generated by artificial intelligence from your results',
		fallbackNote: 'Your in-depth recommendations are being prepared.',
		badge: 'PREMIUM REPORT',
	},
};

function markdownToHtml(md) {
	return md
		.replace(/^### (.+)$/gm, '<h3 class="ai-h3">$1</h3>')
		.replace(/^## (.+)$/gm, '<h2 class="ai-h2">$1</h2>')
		.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
		.replace(/^- (.+)$/gm, '<li>$1</li>')
		.replace(/(<li>.*<\/li>\n?)+/gs, (match) => `<ul class="ai-list">${match}</ul>`)
		.replace(/\n{2,}/g, '</p><p class="ai-p">')
		.replace(/^(?!<[hul])(.+)$/gm, '<p class="ai-p">$1</p>')
		.replace(/<p class="ai-p"><\/p>/g, '');
}

function generatePremiumPage(data, premiumInsights, language) {
	const t = PREMIUM_TEXTS[language] || PREMIUM_TEXTS.fr;
	const isFallback = premiumInsights?.fallback === true;
	const insightHtml = markdownToHtml(premiumInsights?.text || t.fallbackNote);

	return `
    <div class="page page-break">
      <div class="premium-header">
        <div class="premium-badge">${t.badge}</div>
        <h1 class="premium-page-title">${t.premiumTitle}</h1>
        <p class="premium-page-subtitle">${t.premiumSubtitle}</p>
      </div>

      <div class="ai-content">
        ${insightHtml}
      </div>

      ${isFallback ? `<p class="ai-fallback-note">${t.fallbackNote}</p>` : ''}

      <div class="footer-note" style="margin-top:24px;">
        <p>${data.t?.generatedOn || 'Generated on'} ${new Date().toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')} — vitalCHECK · UBUNTU BUSINESS BUILDERS (UBB) – SARL · Dakar, Sénégal</p>
      </div>
    </div>`;
}

const PREMIUM_CSS = `
  .premium-header {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
    color: white;
    padding: 28px 30px;
    border-radius: 12px;
    margin-bottom: 24px;
    text-align: center;
  }
  .premium-badge {
    display: inline-block;
    background: #F4C542;
    color: #1a1a2e;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 2px;
    padding: 4px 14px;
    border-radius: 20px;
    margin-bottom: 12px;
    text-transform: uppercase;
  }
  .premium-page-title {
    font-size: 22px;
    font-weight: 700;
    margin-bottom: 8px;
  }
  .premium-page-subtitle {
    font-size: 13px;
    opacity: 0.85;
    max-width: 500px;
    margin: 0 auto;
  }
  .ai-content {
    background: #f8fafc;
    border-radius: 10px;
    padding: 20px 24px;
    border: 1px solid #e2e8f0;
  }
  .ai-h3 {
    font-size: 15px;
    color: #1a1a2e;
    margin: 16px 0 8px 0;
    padding-bottom: 4px;
    border-bottom: 2px solid #F4C542;
  }
  .ai-h3:first-child { margin-top: 0; }
  .ai-h2 {
    font-size: 17px;
    color: #0f3460;
    margin: 18px 0 10px 0;
  }
  .ai-list {
    margin: 6px 0 10px 0;
    padding-left: 20px;
  }
  .ai-list li {
    font-size: 13px;
    color: #4a5568;
    margin-bottom: 5px;
    line-height: 1.5;
  }
  .ai-p {
    font-size: 13px;
    color: #4a5568;
    margin: 6px 0;
    line-height: 1.6;
  }
  .ai-fallback-note {
    text-align: center;
    font-size: 12px;
    color: #718096;
    margin-top: 16px;
    font-style: italic;
  }
`;

async function generatePremiumV2PDFReport(data, premiumInsights) {
	const language = data.language || 'fr';
	const t = TEXTS[language] || TEXTS.fr;
	const standardHtml = generateV2HTMLContent(data);

	// Inject premium CSS and append premium page
	const premiumPage = generatePremiumPage({ t }, premiumInsights, language);
	const htmlWithPremium = standardHtml
		.replace('</style>', `${PREMIUM_CSS}</style>`)
		.replace('</body>', `${premiumPage}</body>`);

	const options = { ...pdfOptions, args: launchOptions.args };
	return await htmlPdf.generatePdf({ content: htmlWithPremium }, options);
}

module.exports = {
	generateV2PDFReport,
	generateV2HTMLContent,
	generatePremiumV2PDFReport,
};
