const express = require('express');
const router = express.Router();
const { getTranslations } = require('../data/chatbot-translations');

// Ce fichier implémente un chatbot simple, basé sur des règles,
// adapté au projet vitalCHECK / Enterprise Health Check.
// Il gère :
// - FAQ de base (multilingue)
// - quelques intentions (évaluation, rapport, prix, contact)
// - une recherche simple dans les contenus
// - des liens rapides de navigation

// --- Fonctions utilitaires ---

const normalize = (text = '') =>
  text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

function detectIntent(message, lang = 'fr') {
  const t = getTranslations(lang);
  const norm = normalize(message);

  for (const intent of t.intents) {
    if (intent.keywords.some((kw) => norm.includes(normalize(kw)))) {
      return intent;
    }
  }
  return null;
}

function searchFaq(message, lang = 'fr') {
  const t = getTranslations(lang);
  const norm = normalize(message);

  // 1) match par mot-clé déclaré
  const strongMatches = t.faq.filter((item) =>
    item.keywords.some((kw) => norm.includes(normalize(kw)))
  );
  if (strongMatches.length > 0) return strongMatches;

  // 2) fallback : recherche texte dans question / answer
  const fallbackMatches = t.faq.filter((item) => {
    const source = `${item.question} ${item.answer}`;
    return normalize(source).includes(norm);
  });
  return fallbackMatches;
}

// --- Route principale chatbot ---

router.post('/chatbot', async (req, res) => {
  try {
    const { message, lang = 'fr', visitor } = req.body || {};

    if (!message || typeof message !== 'string') {
      const t = getTranslations(lang);
      return res.status(400).json({
        success: false,
        message: t.messages.invalidMessage
      });
    }

    const normalizedMessage = normalize(message);
    const t = getTranslations(lang);

    // Réponse d'accueil / help
    const greetingWords = lang === 'en'
      ? ['hello', 'hi', 'hey', 'help']
      : ['bonjour', 'salut', 'hello', 'hi', 'hey', 'aide', 'help'];

    if (greetingWords.some((w) => normalizedMessage.includes(w))) {
      return res.json({
        success: true,
        reply: t.messages.greeting,
        quickLinks: t.quickLinks,
        suggestions: t.suggestions.greeting
      });
    }

    // 1) Détection d'intention
    const intent = detectIntent(message, lang);

    // 2) Recherche FAQ
    const faqMatches = searchFaq(message, lang);
    const topFaq = faqMatches[0];

    // Construction de la réponse principale
    let reply = '';
    const suggestions = [];
    const suggestedLinks = new Set();

    if (intent) {
      reply += intent.response.message;
      (intent.response.suggestedLinks || []).forEach((l) => suggestedLinks.add(l));
    }

    if (topFaq) {
      if (reply) reply += '\n\n';
      reply += `${topFaq.question}\n${topFaq.answer}`;
    }

    // Si aucune info utilisable
    if (!intent && !topFaq) {
      return res.json({
        success: true,
        reply: t.messages.notUnderstood,
        quickLinks: t.quickLinks,
        suggestions: t.suggestions.notUnderstood
      });
    }

    // Suggestions complémentaires à partir des autres FAQ
    t.faq.slice(0, 3).forEach((item) => {
      if (!topFaq || item.id !== topFaq.id) {
        suggestions.push(item.question);
      }
    });

    // Construction des liens rapides
    const links = t.quickLinks.filter((l) => suggestedLinks.has(l.id));

    // NOTE : pour rester simple, on ne stocke pas encore visitor (nom, email)
    // ici. On se contente de renvoyer une structure pour que le frontend puisse
    // décider d'afficher un formulaire si visitor est vide.

    return res.json({
      success: true,
      reply,
      quickLinks: links.length ? links : t.quickLinks,
      suggestions
    });
  } catch (error) {
    console.error('[CHATBOT] Erreur:', error);
    const lang = req.body?.lang || 'fr';
    const t = getTranslations(lang);
    return res.status(500).json({
      success: false,
      message: t.messages.error
    });
  }
});

module.exports = router;
