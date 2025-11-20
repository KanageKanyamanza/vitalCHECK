const questionsDataFR = {
  pillars: [
    {
      id: "finance",
      name: "Finance & Trésorerie",
      questions: [
        {
          id: "f1",
          text: "Avez-vous des états financiers à jour (P&L, Bilan, Flux de trésorerie) ?",
          options: [
            { label: "Aucun enregistrement", score: 0 },
            { label: "Enregistrements de base, non mis à jour", score: 1 },
            { label: "Mis à jour trimestriellement", score: 2 },
            { label: "Mis à jour mensuellement", score: 3 }
          ]
        },
        {
          id: "f2",
          text: "Combien de mois de réserves de trésorerie votre entreprise peut-elle couvrir ?",
          options: [
            { label: "< 1 mois", score: 0 },
            { label: "1–3 mois", score: 1 },
            { label: "3–6 mois", score: 2 },
            { label: "> 6 mois", score: 3 }
          ]
        }
      ],
      recommendations: {
        red: [
          "Commencez à tenir des registres financiers mensuels (P&L, Bilan, Flux de trésorerie).",
          "Séparez les finances personnelles et professionnelles pour éviter la confusion.",
          "Mettez en place un système de comptabilité de base ou engagez un comptable."
        ],
        amber: [
          "Construisez un prévisionnel de trésorerie de 3–6 mois.",
          "Suivez de plus près les créances et relancez les paiements en retard.",
          "Examinez et optimisez votre stratégie de tarification."
        ],
        green: [
          "Explorez les options de financement pour la croissance et l'expansion.",
          "Utilisez des tableaux de bord financiers pour surveiller les KPI en temps réel.",
          "Considérez la planification financière avancée et les stratégies d'investissement."
        ]
      }
    },
    {
      id: "operations",
      name: "Opérations & Processus",
      questions: [
        {
          id: "o1",
          text: "Vos processus métier sont-ils documentés ?",
          options: [
            { label: "Pas du tout", score: 0 },
            { label: "Seulement certains processus", score: 1 },
            { label: "La plupart des processus documentés", score: 2 },
            { label: "Entièrement standardisés et automatisés", score: 3 }
          ]
        },
        {
          id: "o2",
          text: "Comment surveillez-vous l'efficacité opérationnelle ?",
          options: [
            { label: "Aucune surveillance", score: 0 },
            { label: "Vérifications ad-hoc", score: 1 },
            { label: "Révisions régulières", score: 2 },
            { label: "KPI basés sur les données", score: 3 }
          ]
        }
      ],
      recommendations: {
        red: [
          "Documentez au moins vos processus de base (ventes, approvisionnement, service client).",
          "Identifiez les goulots d'étranglement dans vos opérations actuelles.",
          "Créez des listes de contrôle simples pour les activités clés."
        ],
        amber: [
          "Standardisez les flux de travail et ajoutez des KPI simples.",
          "Mettez en place des révisions opérationnelles régulières.",
          "Formez le personnel aux processus documentés."
        ],
        green: [
          "Automatisez les processus et considérez les systèmes ERP.",
          "Implémentez des analyses avancées et la maintenance prédictive.",
          "Concentrez-vous sur l'amélioration continue et l'innovation."
        ]
      }
    },
    {
      id: "sales",
      name: "Ventes & Marketing",
      questions: [
        {
          id: "s1",
          text: "Comment générez-vous des prospects/clients ?",
          options: [
            { label: "Principalement par le bouche-à-oreille", score: 0 },
            { label: "Un peu de marketing irrégulier", score: 1 },
            { label: "Campagnes structurées (réseaux sociaux, email, etc.)", score: 2 },
            { label: "Stratégie intégrée ventes + marketing avec KPI", score: 3 }
          ]
        },
        {
          id: "s2",
          text: "Suivez-vous la rétention client et la valeur vie client ?",
          options: [
            { label: "Non", score: 0 },
            { label: "Suivi de base (tableurs)", score: 1 },
            { label: "Surveillance régulière", score: 2 },
            { label: "Analyses avancées + système CRM", score: 3 }
          ]
        }
      ],
      recommendations: {
        red: [
          "Définissez clairement vos clients cibles.",
          "Mettez en place une présence numérique de base (Google Business, réseaux sociaux).",
          "Créez un plan marketing simple."
        ],
        amber: [
          "Lancez des campagnes marketing structurées.",
          "Suivez systématiquement les prospects et mesurez les taux de conversion.",
          "Développez des stratégies de rétention client."
        ],
        green: [
          "Optimisez la valeur vie client et implémentez un CRM avancé.",
          "Utilisez l'analyse de données pour des campagnes marketing personnalisées.",
          "Concentrez-vous sur l'expérience client et les programmes de fidélité."
        ]
      }
    },
    {
      id: "people",
      name: "Personnel & RH",
      questions: [
        {
          id: "p1",
          text: "Avez-vous des descriptions de poste claires et des évaluations de performance ?",
          options: [
            { label: "Non", score: 0 },
            { label: "Partiel / informel", score: 1 },
            { label: "Évaluations régulières pour les rôles clés", score: 2 },
            { label: "Systématique pour tout le personnel", score: 3 }
          ]
        },
        {
          id: "p2",
          text: "Investissez-vous dans la formation et le développement du personnel ?",
          options: [
            { label: "Jamais", score: 0 },
            { label: "Occasionnellement", score: 1 },
            { label: "Plan de formation annuel", score: 2 },
            { label: "Programme de formation continue", score: 3 }
          ]
        }
      ],
      recommendations: {
        red: [
          "Définissez clairement les rôles et responsabilités pour tous les postes.",
          "Créez des descriptions de poste de base et des attentes.",
          "Établissez des canaux de communication réguliers avec le personnel."
        ],
        amber: [
          "Introduisez des évaluations de performance régulières et un budget de formation.",
          "Développez des parcours de carrière pour les employés clés.",
          "Implémentez des politiques et procédures RH de base."
        ],
        green: [
          "Construisez un pipeline de leadership et une planification de succession.",
          "Implémentez un logiciel RH complet et des analyses.",
          "Concentrez-vous sur l'engagement et les stratégies de rétention des employés."
        ]
      }
    },
    {
      id: "strategy",
      name: "Stratégie & Gouvernance",
      questions: [
        {
          id: "st1",
          text: "Avez-vous une stratégie/plan d'entreprise documenté ?",
          options: [
            { label: "Aucun", score: 0 },
            { label: "Idées informelles seulement", score: 1 },
            { label: "Plan écrit, pas régulièrement mis à jour", score: 2 },
            { label: "Plan clair, mis à jour avec surveillance", score: 3 }
          ]
        },
        {
          id: "st2",
          text: "À quelle fréquence la direction examine-t-elle les performances de l'entreprise ?",
          options: [
            { label: "Jamais", score: 0 },
            { label: "Occasionnellement", score: 1 },
            { label: "Trimestriellement", score: 2 },
            { label: "Mensuellement", score: 3 }
          ]
        }
      ],
      recommendations: {
        red: [
          "Rédigez un plan d'entreprise d'une page (vision, objectifs, feuille de route 12 mois).",
          "Définissez vos avantages concurrentiels et votre positionnement sur le marché.",
          "Fixez des objectifs financiers et opérationnels de base."
        ],
        amber: [
          "Tenez des révisions de performance trimestrielles et des mises à jour stratégiques.",
          "Développez des indicateurs de performance clés (KPI) pour suivre les progrès.",
          "Créez des plans de contingence pour les risques potentiels."
        ],
        green: [
          "Mettez en place un conseil consultatif et utilisez des KPI stratégiques.",
          "Implémentez la planification de scénarios et l'analyse de marché.",
          "Concentrez-vous sur les partenariats stratégiques à long terme et les alliances."
        ]
      }
    },
    {
      id: "technology",
      name: "Technologie & Maturité Numérique",
      questions: [
        {
          id: "t1",
          text: "Quel rôle joue la technologie dans votre entreprise ?",
          options: [
            { label: "Très limité", score: 0 },
            { label: "De base (emails, tableurs)", score: 1 },
            { label: "Systèmes de base en place (comptabilité, CRM, ERP)", score: 2 },
            { label: "Outils numériques avancés intégrés dans toutes les fonctions", score: 3 }
          ]
        },
        {
          id: "t2",
          text: "Avez-vous une politique de cybersécurité/protection des données ?",
          options: [
            { label: "Aucune", score: 0 },
            { label: "Pratiques informelles de base", score: 1 },
            { label: "Politique formelle, pas appliquée", score: 2 },
            { label: "Entièrement implémentée + personnel formé", score: 3 }
          ]
        }
      ],
      recommendations: {
        red: [
          "Adoptez des logiciels métier de base (comptabilité, POS, CRM).",
          "Implémentez des sauvegardes de données régulières et des mesures de sécurité de base.",
          "Formez le personnel aux outils numériques essentiels."
        ],
        amber: [
          "Sauvegardez régulièrement les données et formalisez les bases de la cybersécurité.",
          "Intégrez les systèmes métier de base pour une meilleure efficacité.",
          "Développez des programmes de formation aux compétences numériques pour le personnel."
        ],
        green: [
          "Intégrez des systèmes avancés (CRM + ERP + analyses).",
          "Explorez l'automatisation, l'IA et les technologies émergentes.",
          "Implémentez une cybersécurité complète et une gouvernance des données."
        ]
      }
    },
    {
      id: "risks",
      name: "Risques & Conformité",
      questions: [
        {
          id: "r1",
          text: "Gestion des risques ?",
          options: [
            { label: "Aucun système", score: 0 },
            { label: "Quelques risques identifiés", score: 1 },
            { label: "Processus partiel", score: 2 },
            { label: "Système complet", score: 3 }
          ]
        }
      ],
      recommendations: {
        red: [
          "Identifiez les principaux risques de votre activité.",
          "Consultez les réglementations applicables à votre secteur.",
          "Mettez en place des mesures de base pour la conformité."
        ],
        amber: [
          "Développez un processus formel de gestion des risques.",
          "Effectuez des audits de conformité réguliers.",
          "Documentez vos procédures de conformité."
        ],
        green: [
          "Implémentez un système complet de gestion des risques avec suivi continu.",
          "Obtenez des certifications sectorielles pertinentes.",
          "Mettez en place un comité de gestion des risques."
        ]
      }
    },
    {
      id: "branding",
      name: "Branding & Packaging",
      questions: [
        {
          id: "b1",
          text: "Branding ?",
          options: [
            { label: "Aucun branding clair", score: 0 },
            { label: "Basique", score: 1 },
            { label: "Cohérent", score: 2 },
            { label: "Professionnel", score: 3 }
          ]
        }
      ],
      recommendations: {
        red: [
          "Définissez votre identité de marque (valeurs, mission, vision).",
          "Créez un logo et des éléments visuels de base.",
          "Développez un message de marque clair."
        ],
        amber: [
          "Harmonisez votre branding sur tous les canaux de communication.",
          "Améliorez la qualité de votre packaging.",
          "Développez une charte graphique cohérente."
        ],
        green: [
          "Créez une expérience de marque premium et mémorable.",
          "Investissez dans un packaging innovant et différenciant.",
          "Développez une stratégie de marque à long terme."
        ]
      }
    },
    {
      id: "export",
      name: "Préparation à l'Export",
      questions: [
        {
          id: "e1",
          text: "Prêt à exporter ?",
          options: [
            { label: "Aucune démarche", score: 0 },
            { label: "Intérêt informel", score: 1 },
            { label: "Préparation partielle", score: 2 },
            { label: "Processus complet", score: 3 }
          ]
        }
      ],
      recommendations: {
        red: [
          "Évaluez le potentiel d'exportation de vos produits/services.",
          "Renseignez-vous sur les exigences réglementaires à l'export.",
          "Identifiez au moins un marché cible potentiel."
        ],
        amber: [
          "Développez un plan d'exportation avec des marchés prioritaires.",
          "Établissez des partenariats locaux dans les marchés cibles.",
          "Adaptez vos produits/services aux exigences des marchés internationaux."
        ],
        green: [
          "Implémentez une stratégie d'exportation complète avec plusieurs marchés.",
          "Créez une présence internationale solide avec des partenaires locaux.",
          "Développez des capacités logistiques et de distribution à l'international."
        ]
      }
    }
  ],
  scoring: {
    thresholds: {
      red: [0, 39],
      amber: [40, 69],
      green: [70, 100]
    },
    logic: "Scores moyens des questions × 25 = score pilier. Score global = moyenne de tous les piliers."
  }
};

module.exports = questionsDataFR;
