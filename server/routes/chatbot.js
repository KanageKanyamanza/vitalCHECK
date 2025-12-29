const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getTranslations } = require('../data/chatbot-translations');

// Charger le modèle de manière non bloquante
let ChatbotInteraction;
try {
  ChatbotInteraction = require('../models/ChatbotInteraction');
} catch (error) {
  console.warn('[CHATBOT] Modèle ChatbotInteraction non disponible:', error.message);
  ChatbotInteraction = null;
}

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
    const { message, lang = 'fr', visitor, userId } = req.body || {};

    if (!message || typeof message !== 'string') {
      const t = getTranslations(lang);
      return res.status(400).json({
        success: false,
        message: t.messages.invalidMessage
      });
    }

    const normalizedMessage = normalize(message);
    const t = getTranslations(lang);

    // Récupérer l'utilisateur si userId est fourni
    let user = null;
    if (userId) {
      try {
        user = await User.findById(userId);
      } catch (err) {
        console.error('[CHATBOT] Erreur récupération utilisateur:', err);
      }
    }

    // Réponse d'accueil / help
    const greetingWords = lang === 'en'
      ? ['hello', 'hi', 'hey', 'help']
      : ['bonjour', 'salut', 'hello', 'hi', 'hey', 'aide', 'help'];

    let responseType = 'no_answer';
    let reply = '';
    const suggestions = [];
    const suggestedLinks = new Set();

    if (greetingWords.some((w) => normalizedMessage.includes(w))) {
      responseType = 'intent';
      reply = t.messages.greeting;
      const greetingResponse = {
        success: true,
        reply,
        quickLinks: t.quickLinks,
        suggestions: t.suggestions.greeting
      };

      // Enregistrer l'interaction (non bloquant)
      saveInteraction({
        question: message,
        response: reply,
        responseType: 'intent',
        userId: user?._id || null,
        visitorName: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : (visitor?.name || null),
        visitorEmail: user?.email || visitor?.email || null,
        lang,
        status: 'answered'
      }).catch(err => console.error('[CHATBOT] Erreur enregistrement (non bloquant):', err));

      return res.json(greetingResponse);
    }

    // 1) Détection d'intention
    const intent = detectIntent(message, lang);

    // 2) Recherche FAQ statique
    const faqMatches = searchFaq(message, lang);
    const topFaq = faqMatches[0];

    // 3) Recherche dans les réponses personnalisées (si disponible)
    let customResponse = null;
    try {
      const ChatbotResponse = require('../models/ChatbotResponse');
      const normalizedMsg = normalize(message);
      
      // Recherche par mots-clés
      const keywordMatches = await ChatbotResponse.find({
        lang,
        isActive: true,
        keywords: { $in: normalizedMsg.split(' ') }
      }).sort({ priority: -1, usageCount: -1 }).limit(1);

      // Recherche par texte dans question/réponse
      if (keywordMatches.length === 0) {
        const textMatches = await ChatbotResponse.find({
          lang,
          isActive: true,
          $or: [
            { question: { $regex: normalizedMsg, $options: 'i' } },
            { answer: { $regex: normalizedMsg, $options: 'i' } }
          ]
        }).sort({ priority: -1, usageCount: -1 }).limit(1);

        if (textMatches.length > 0) {
          customResponse = textMatches[0];
        }
      } else {
        customResponse = keywordMatches[0];
      }

      // Incrémenter l'utilisation si trouvé
      if (customResponse) {
        await customResponse.incrementUsage();
      }
    } catch (err) {
      // Si le modèle n'est pas disponible, continuer sans
      console.warn('[CHATBOT] Réponses personnalisées non disponibles:', err.message);
    }

    // Construction de la réponse principale
    // Priorité: réponses personnalisées > FAQ statique > intent
    if (customResponse) {
      responseType = 'custom';
      reply = customResponse.answer;
    } else if (topFaq) {
      responseType = 'faq';
      reply = `${topFaq.question}\n${topFaq.answer}`;
    } else if (intent) {
      responseType = 'intent';
      reply = intent.response.message;
      (intent.response.suggestedLinks || []).forEach((l) => suggestedLinks.add(l));
    }

    // Si aucune info utilisable
    if (!intent && !topFaq) {
      reply = t.messages.notUnderstood;
      responseType = 'no_answer';
    }

    // Suggestions complémentaires à partir des autres FAQ
    t.faq.slice(0, 3).forEach((item) => {
      if (!topFaq || item.id !== topFaq.id) {
        suggestions.push(item.question);
      }
    });

    // Construction des liens rapides
    const links = t.quickLinks.filter((l) => suggestedLinks.has(l.id));

    // Enregistrer l'interaction (non bloquant)
    const interactionStatus = responseType === 'no_answer' ? 'pending' : 'answered';
    saveInteraction({
      question: message,
      response: reply,
      responseType,
      userId: user?._id || null,
      visitorName: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : (visitor?.name || null),
      visitorEmail: user?.email || visitor?.email || null,
      lang,
      status: interactionStatus
    }).catch(err => console.error('[CHATBOT] Erreur enregistrement (non bloquant):', err));

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

// Fonction helper pour enregistrer une interaction
async function saveInteraction(data) {
  try {
    if (!ChatbotInteraction || !data || !data.question) {
      return;
    }
    
    // Vérifier si une question similaire existe déjà en attente
    const existing = await ChatbotInteraction.incrementFrequency(data.question);
    
    if (!existing) {
      // Créer une nouvelle interaction
      const now = new Date();
      await ChatbotInteraction.create({
        question: data.question,
        response: data.response || null,
        responseType: data.responseType || 'no_answer',
        userId: data.userId || null,
        visitorName: data.visitorName || null,
        visitorEmail: data.visitorEmail || null,
        lang: data.lang || 'fr',
        status: data.status || 'pending',
        frequency: 1,
        createdAt: now,
        updatedAt: now
      });
    }
  } catch (error) {
    console.error('[CHATBOT] Erreur enregistrement interaction:', error);
    // Ne pas bloquer la réponse si l'enregistrement échoue
  }
}

module.exports = router;
