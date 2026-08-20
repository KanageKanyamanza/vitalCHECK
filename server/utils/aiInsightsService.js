const axios = require('axios');

const API_BASE = 'https://api.anthropic.com/v1/messages';
const DEFAULT_MODEL = 'claude-haiku-4-5-20251001';
const TIMEOUT_MS = 25000;

const SYSTEM_PROMPT = {
  fr: `Tu es un conseiller stratégique senior spécialisé dans l'accompagnement des PME africaines.
Tu analyses les résultats d'un diagnostic de maturité d'entreprise et tu rédiges des recommandations concrètes et priorisées.

Règles strictes :
- Appuie-toi UNIQUEMENT sur les données du diagnostic fournies (scores, niveaux, piliers faibles).
- N'invente aucun chiffre, statistique sectorielle, ni fait sur l'entreprise qui n'est pas dans les données.
- Ne mentionne pas de concurrents, benchmarks ou données de marché.
- Reste dans le registre "conseil actionnable" : quoi faire, dans quel ordre, pourquoi, compte tenu des résultats.
- Sois concis, précis, professionnel. Pas de formules creuses.`,

  en: `You are a senior strategic advisor specializing in African SME development.
You analyze business maturity diagnostic results and write concrete, prioritized recommendations.

Strict rules:
- Base yourself ONLY on the diagnostic data provided (scores, levels, weak pillars).
- Do not invent any figures, industry statistics, or facts about the company not present in the data.
- Do not mention competitors, benchmarks, or market data.
- Stay in "actionable advice" mode: what to do, in what order, why, based on the results.
- Be concise, precise, professional. No empty phrases.`
};

const USER_PROMPT = {
  fr: (data) => `Voici les résultats du diagnostic VitalCHECK :

Score global : ${data.overall_score}/100 — Niveau : ${data.overall_level_label}
Taille d'entreprise : ${data.company_size_label}${data.sector ? `\nSecteur : ${data.sector}` : ''}

Scores par pilier :
${data.pillars.map(p => `- ${p.name} : ${p.score}/100 (${p.level_label})${p.existing_recommendations.length ? `\n  Points faibles identifiés : ${p.existing_recommendations.join(' / ')}` : ''}`).join('\n')}

Génère un plan de recommandations structuré en 3 sections :
1. **Priorités immédiates** (30 jours) — les 2-3 actions les plus urgentes sur les piliers les plus faibles
2. **Plan à moyen terme** (3-6 mois) — une feuille de route pilier par pilier pour les zones critiques et vulnérables
3. **Points forts à consolider** — comment capitaliser sur les piliers forts pour soutenir les zones faibles

Format : markdown structuré avec titres H3, sous-listes et phrases d'action courtes.`,

  en: (data) => `Here are the VitalCHECK diagnostic results:

Overall score: ${data.overall_score}/100 — Level: ${data.overall_level_label}
Company size: ${data.company_size_label}${data.sector ? `\nSector: ${data.sector}` : ''}

Pillar scores:
${data.pillars.map(p => `- ${p.name}: ${p.score}/100 (${p.level_label})${p.existing_recommendations.length ? `\n  Identified weak points: ${p.existing_recommendations.join(' / ')}` : ''}`).join('\n')}

Generate a structured recommendation plan with 3 sections:
1. **Immediate priorities** (30 days) — 2-3 most urgent actions on the weakest pillars
2. **Medium-term plan** (3-6 months) — a pillar-by-pillar roadmap for critical and vulnerable areas
3. **Strengths to consolidate** — how to leverage strong pillars to support weak areas

Format: structured markdown with H3 headings, sub-lists, and short action sentences.`
};

const LEVEL_LABELS = {
  fr: {
    critique: 'Critique', vulnerable: 'Vulnérable', stable: 'Stable',
    pret: 'Prêt', haute_performance: 'Haute performance'
  },
  en: {
    critique: 'Critical', vulnerable: 'Vulnerable', stable: 'Stable',
    pret: 'Ready', haute_performance: 'High performance'
  }
};

const SIZE_LABELS = {
  fr: { micro: 'Micro (1-9 employés)', sme: 'PME (10-49 employés)', 'large-sme': 'Grande PME (50+ employés)' },
  en: { micro: 'Micro (1-9 employees)', sme: 'SME (10-49 employees)', 'large-sme': 'Large SME (50+ employees)' }
};

const FALLBACK_TEXT = {
  fr: '### Recommandations en cours de génération\n\nVos recommandations personnalisées sont en cours de préparation. Elles seront disponibles lors de votre prochain téléchargement de rapport. En attendant, référez-vous aux points forts et axes d\'amélioration identifiés dans les pages précédentes.',
  en: '### Recommendations Being Generated\n\nYour personalized recommendations are being prepared. They will be available on your next report download. In the meantime, refer to the strengths and improvement areas identified in the previous pages.'
};

async function generatePremiumInsights(assessment) {
  const lang = assessment.language || 'fr';
  const levelLabels = LEVEL_LABELS[lang] || LEVEL_LABELS.fr;
  const sizeLabels = SIZE_LABELS[lang] || SIZE_LABELS.fr;

  const data = {
    overall_score: assessment.overallScore,
    overall_level_label: levelLabels[assessment.overallLevel] || assessment.overallLevel,
    company_size_label: sizeLabels[assessment.companySize] || assessment.companySize || 'Non précisé',
    sector: assessment.sector || null,
    pillars: (assessment.pillarScores || []).map(p => ({
      name: p.pillarName,
      score: p.score,
      level_label: levelLabels[p.level] || p.level,
      existing_recommendations: (p.recommendations || []).slice(0, 3)
    }))
  };

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.warn('[AI] ANTHROPIC_API_KEY absent — returning fallback');
    return { text: FALLBACK_TEXT[lang] || FALLBACK_TEXT.fr, fallback: true };
  }

  try {
    const response = await axios.post(
      API_BASE,
      {
        model: process.env.AI_MODEL || DEFAULT_MODEL,
        max_tokens: 1024,
        system: SYSTEM_PROMPT[lang] || SYSTEM_PROMPT.fr,
        messages: [{ role: 'user', content: (USER_PROMPT[lang] || USER_PROMPT.fr)(data) }]
      },
      {
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json'
        },
        timeout: TIMEOUT_MS
      }
    );

    const text = response.data?.content?.[0]?.text;
    if (!text) throw new Error('Réponse IA vide');

    return { text, fallback: false };
  } catch (err) {
    console.error('[AI] Insights generation failed:', err.message);
    return { text: FALLBACK_TEXT[lang] || FALLBACK_TEXT.fr, fallback: true };
  }
}

module.exports = { generatePremiumInsights };
