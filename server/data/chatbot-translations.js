// Traductions pour le chatbot backend
// Support multilingue (FR/EN)

const translations = {
  fr: {
    quickLinks: [
      {
        id: 'start-assessment',
        label: 'Commencer l\'évaluation',
        path: '/assessment'
      },
      {
        id: 'pricing',
        label: 'Voir les tarifs',
        path: '/pricing'
      },
      {
        id: 'contact',
        label: 'Contacter l\'équipe',
        path: '/contact'
      },
      {
        id: 'blog',
        label: 'Consulter le blog',
        path: '/blog'
      }
    ],
    faq: [
      {
        id: 'what-is-ehc',
        question: 'Qu\'est-ce que le vitalCHECK ?',
        keywords: ['qu\'est-ce', 'c\'est quoi', 'enterprise health check', 'vitalcheck', 'outil', 'diagnostic', 'what is', 'what\'s'],
        answer: 'vitalCHECK Enterprise Health Check est un outil en ligne qui évalue la santé organisationnelle de votre entreprise (finance, opérations, ventes & marketing, RH, stratégie, technologie) en environ 10 minutes, puis génère un rapport avec recommandations.'
      },
      {
        id: 'how-long',
        question: 'Combien de temps dure l\'évaluation ?',
        keywords: ['combien de temps', 'durée', 'temps', 'minutes', 'how long', 'duration', 'time'],
        answer: 'L\'évaluation dure en moyenne 10 à 15 minutes selon votre taille d\'entreprise et votre niveau de préparation.'
      },
      {
        id: 'price',
        question: 'Combien ça coûte ?',
        keywords: ['prix', 'coût', 'tarif', 'combien', 'payer', 'price', 'cost', 'pricing', 'how much'],
        answer: 'Vous pouvez commencer par une évaluation gratuite. Pour des rapports détaillés et des options d\'accompagnement, consultez la page Tarifs ou contactez notre équipe.'
      },
      {
        id: 'report',
        question: 'Quel type de rapport vais-je recevoir ?',
        keywords: ['rapport', 'résultats', 'pdf', 'score', 'report', 'results'],
        answer: 'À la fin de l\'évaluation, vous obtenez un rapport avec vos scores par pilier (Finance, Opérations, Ventes & Marketing, RH, Stratégie, Technologie) et des recommandations concrètes pour améliorer la santé de votre entreprise.'
      },
      {
        id: 'data-privacy',
        question: 'Que faites-vous avec mes données ?',
        keywords: ['données', 'confidentialité', 'rgpd', 'sécurité', 'privacy', 'data', 'security'],
        answer: 'Vos réponses sont stockées de manière sécurisée et utilisées uniquement pour générer votre rapport et améliorer le service. Pour plus de détails, consultez notre Politique de confidentialité.'
      }
    ],
    intents: [
      {
        id: 'assessment',
        keywords: ['évaluation', 'assessment', 'diagnostic', 'commencer', 'start', 'begin', 'evaluate'],
        response: {
          type: 'info',
          message: 'Vous pouvez démarrer votre évaluation organisationnelle en quelques clics. Cliquez sur "Commencer l\'évaluation" ci-dessous.',
          suggestedLinks: ['start-assessment']
        }
      },
      {
        id: 'pricing',
        keywords: ['prix', 'tarif', 'coût', 'combien', 'payer', 'price', 'pricing', 'cost', 'how much'],
        response: {
          type: 'info',
          message: 'Pour connaître les options gratuites et payantes, consultez la page Tarifs. Vous y trouverez le détail des offres et des rapports.',
          suggestedLinks: ['pricing']
        }
      },
      {
        id: 'support-contact',
        keywords: ['aide', 'support', 'contact', 'email', 'téléphone', 'question', 'help', 'phone'],
        response: {
          type: 'info',
          message: 'Notre équipe peut vous accompagner pour interpréter vos résultats ou mettre en œuvre les recommandations. Vous pouvez nous écrire via la page Contact.',
          suggestedLinks: ['contact']
        }
      },
      {
        id: 'promotion',
        keywords: ['promo', 'promotion', 'réduction', 'discount', 'offre', 'deal', 'special'],
        response: {
          type: 'info',
          message: 'Des offres spéciales peuvent exister selon les périodes ou les partenariats. Dites-moi si vous êtes une PME, une grande entreprise ou une organisation partenaire, et je vous dirai quoi faire ensuite.',
          suggestedLinks: ['pricing', 'contact']
        }
      }
    ],
    messages: {
      greeting: 'Bonjour, je suis l\'assistant vitalCHECK. Je peux répondre à vos questions sur l\'évaluation, les tarifs, le rapport et la manière dont fonctionne l\'outil.',
      notUnderstood: 'Je ne suis pas sûr de bien comprendre votre question. Vous pouvez me demander par exemple :\n- ce qu\'est le Enterprise Health Check,\n- la durée de l\'évaluation,\n- ce que contient le rapport,\n- ou comment nous contacter.',
      error: 'Une erreur est survenue côté serveur du chatbot.',
      invalidMessage: 'Merci d\'envoyer un message texte au chatbot.'
    },
    suggestions: {
      greeting: [
        'Qu\'est-ce que le Enterprise Health Check ?',
        'Combien de temps dure l\'évaluation ?',
        'Comment obtenir mon rapport ?',
        'Comment contacter votre équipe ?'
      ],
      notUnderstood: [
        'Qu\'est-ce que le Enterprise Health Check ?',
        'Combien de temps dure l\'évaluation ?',
        'Quel type de rapport vais-je recevoir ?',
        'Comment vous contacter ?'
      ]
    }
  },
  en: {
    quickLinks: [
      {
        id: 'start-assessment',
        label: 'Start assessment',
        path: '/assessment'
      },
      {
        id: 'pricing',
        label: 'View pricing',
        path: '/pricing'
      },
      {
        id: 'contact',
        label: 'Contact team',
        path: '/contact'
      },
      {
        id: 'blog',
        label: 'View blog',
        path: '/blog'
      }
    ],
    faq: [
      {
        id: 'what-is-ehc',
        question: 'What is vitalCHECK?',
        keywords: ['what is', 'what\'s', 'enterprise health check', 'vitalcheck', 'tool', 'diagnostic', 'qu\'est-ce', 'c\'est quoi'],
        answer: 'vitalCHECK Enterprise Health Check is an online tool that evaluates the organizational health of your business (finance, operations, sales & marketing, HR, strategy, technology) in about 10 minutes, then generates a report with recommendations.'
      },
      {
        id: 'how-long',
        question: 'How long does the assessment take?',
        keywords: ['how long', 'duration', 'time', 'minutes', 'combien de temps', 'durée'],
        answer: 'The assessment takes an average of 10 to 15 minutes depending on your company size and level of preparation.'
      },
      {
        id: 'price',
        question: 'How much does it cost?',
        keywords: ['price', 'cost', 'pricing', 'how much', 'prix', 'coût', 'tarif'],
        answer: 'You can start with a free assessment. For detailed reports and support options, check the Pricing page or contact our team.'
      },
      {
        id: 'report',
        question: 'What type of report will I receive?',
        keywords: ['report', 'results', 'pdf', 'score', 'rapport', 'résultats'],
        answer: 'At the end of the assessment, you get a report with your scores by pillar (Finance, Operations, Sales & Marketing, HR, Strategy, Technology) and concrete recommendations to improve your business health.'
      },
      {
        id: 'data-privacy',
        question: 'What do you do with my data?',
        keywords: ['data', 'privacy', 'security', 'données', 'confidentialité', 'sécurité'],
        answer: 'Your responses are stored securely and used only to generate your report and improve the service. For more details, see our Privacy Policy.'
      }
    ],
    intents: [
      {
        id: 'assessment',
        keywords: ['assessment', 'evaluate', 'diagnostic', 'start', 'begin', 'commencer', 'évaluation'],
        response: {
          type: 'info',
          message: 'You can start your organizational assessment in a few clicks. Click on "Start assessment" below.',
          suggestedLinks: ['start-assessment']
        }
      },
      {
        id: 'pricing',
        keywords: ['price', 'pricing', 'cost', 'how much', 'prix', 'tarif', 'coût'],
        response: {
          type: 'info',
          message: 'To learn about free and paid options, check the Pricing page. You\'ll find details on offers and reports.',
          suggestedLinks: ['pricing']
        }
      },
      {
        id: 'support-contact',
        keywords: ['help', 'support', 'contact', 'email', 'phone', 'question', 'aide', 'téléphone'],
        response: {
          type: 'info',
          message: 'Our team can help you interpret your results or implement recommendations. You can write to us via the Contact page.',
          suggestedLinks: ['contact']
        }
      },
      {
        id: 'promotion',
        keywords: ['promo', 'promotion', 'discount', 'deal', 'special', 'offre', 'réduction'],
        response: {
          type: 'info',
          message: 'Special offers may exist depending on periods or partnerships. Tell me if you are an SME, large company or partner organization, and I\'ll tell you what to do next.',
          suggestedLinks: ['pricing', 'contact']
        }
      }
    ],
    messages: {
      greeting: 'Hello, I\'m the vitalCHECK assistant. I can answer your questions about the assessment, pricing, the report and how the tool works.',
      notUnderstood: 'I\'m not sure I understand your question. You can ask me for example:\n- what is the Enterprise Health Check,\n- how long the assessment takes,\n- what the report contains,\n- or how to contact us.',
      error: 'An error occurred on the chatbot server.',
      invalidMessage: 'Please send a text message to the chatbot.'
    },
    suggestions: {
      greeting: [
        'What is the Enterprise Health Check?',
        'How long does the assessment take?',
        'How do I get my report?',
        'How do I contact your team?'
      ],
      notUnderstood: [
        'What is the Enterprise Health Check?',
        'How long does the assessment take?',
        'What type of report will I receive?',
        'How do I contact you?'
      ]
    }
  }
};

// Fonction pour obtenir les traductions selon la langue
function getTranslations(lang = 'fr') {
  return translations[lang] || translations.fr; // Fallback sur français
}

module.exports = {
  translations,
  getTranslations
};


