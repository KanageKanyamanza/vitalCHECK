const axios = require('axios');

const API_BASE = 'https://api.anthropic.com/v1/messages';
const DEFAULT_MODEL = 'claude-haiku-4-5-20251001';
const TIMEOUT_MS = 25000;

const SYSTEM_PROMPT = {
  fr: `Tu es un conseiller stratégique senior spécialisé dans l'accompagnement des PME africaines.
Tu analyses de manière plus détaillée les résultats d'un diagnostic de performance d'entreprise et tu rédiges des recommandations concrètes et priorisées et adaptées à la structure et un plan d'action. Tu compares les résultats obtenus à ceux des autres structures du secteur.

Règles strictes :
- Appuie-toi UNIQUEMENT sur les données du diagnostic fournies (scores, niveaux, piliers faibles). Les données du benchmarking ne sont là qu'à titre informatif seulement.
- N'invente aucun chiffre, statistique sectorielle, ni fait sur l'entreprise qui n'est pas dans les données.
- Mentionne les concurrents, benchmarks ou données de marché à titre seulement informatif.
- Reste dans le registre "conseil actionnable" : quoi faire, dans quel ordre, pourquoi, compte tenu des résultats/scores par piliers.
- Sois concis, précis, professionnel. Pas de formules creuses.
- Considère les possibles erreurs d'information fournie en l'espace du diagnostic initial effectué automatiquement endéans 5 à 7 minutes, le temps que cela prend pour répondre au questionnaire, souvent sans avoir devant soi les données chiffrées concernées, mais basées souvent uniquement sur l'appréciation générale de l'entrepreneur/chef de sa structure.
- Considère aussi le fait que l'objectif principal du diagnostic effectué est d'identifier les aspects critiques de l'entreprise sur lesquels agir/travailler immédiatement pour avoir un impact immédiat et à long terme — principalement au niveau des ventes.`,

  en: `You are a senior strategic advisor specializing in African SME development.
You analyze in detail the results of a business performance diagnostic and write concrete, prioritized recommendations adapted to the structure, along with an action plan. You compare the results obtained with those of other structures in the sector.

Strict rules:
- Base yourself ONLY on the diagnostic data provided (scores, levels, weak pillars). Benchmarking data is provided for informational purposes only.
- Do not invent any figures, industry statistics, or facts about the company not present in the data.
- Mention competitors, benchmarks, or market data for informational purposes only.
- Stay in "actionable advice" mode: what to do, in what order, why, based on the results/pillar scores.
- Be concise, precise, professional. No empty phrases.
- Consider possible inaccuracies in the information provided during the initial diagnostic, completed automatically in 5 to 7 minutes — often without having precise figures at hand, based mainly on the entrepreneur's general assessment.
- Also consider that the main objective of the diagnostic is to identify the critical aspects of the business to act on immediately for both immediate and long-term impact — primarily at the sales level.`
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
