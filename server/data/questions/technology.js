module.exports = {
  "pillars": [
    {
      "id": "finance",
      "name": "Finance",
      "questions": [
        {
          "id": "technology_finance_1",
          "text": "Suivez-vous les métriques SaaS clés (MRR, Churn, CAC, LTV) de manière mensuelle ?",
          "options": [
            {
              "label": "Non / Au feeling",
              "score": 0
            },
            {
              "label": "Quelques indicateurs simples",
              "score": 1
            },
            {
              "label": "Oui / Tableaux de bord précis",
              "score": 3
            }
          ]
        },
        {
          "id": "technology_finance_2",
          "text": "Avez-vous optimisé vos dépenses d'infrastructure cloud (AWS/Azure) pour éviter le gaspillage ?",
          "options": [
            {
              "label": "Non / Inexistant",
              "score": 0
            },
            {
              "label": "Partiel / En cours d'élaboration",
              "score": 1
            },
            {
              "label": "Oui / Complet et documenté",
              "score": 3
            }
          ]
        }
      ],
      "recommendations": {
        "red": [
          "Commencez à tenir des registres financiers mensuels.",
          "Séparez les finances personnelles et professionnelles."
        ],
        "amber": [
          "Construisez un prévisionnel de trésorerie.",
          "Suivez de plus près les créances."
        ],
        "green": [
          "Explorez les options de financement.",
          "Utilisez des tableaux de bord financiers."
        ]
      }
    },
    {
      "id": "operations",
      "name": "Opérations",
      "questions": [
        {
          "id": "technology_operations_1",
          "text": "Utilisez-vous des méthodes agiles (Scrum/Kanban) pour gérer vos cycles de développement ?",
          "options": [
            {
              "label": "Non / Manuellement",
              "score": 0
            },
            {
              "label": "Outils basiques (Excel...)",
              "score": 1
            },
            {
              "label": "Outils dédiés / Automatisé",
              "score": 3
            }
          ]
        },
        {
          "id": "technology_operations_2",
          "text": "Vos processus de déploiement (CI/CD) sont-ils automatisés pour réduire les erreurs humaines ?",
          "options": [
            {
              "label": "Non / Pas du tout",
              "score": 0
            },
            {
              "label": "Partiellement / Moyennement",
              "score": 1
            },
            {
              "label": "Oui / Tout à fait",
              "score": 3
            }
          ]
        }
      ],
      "recommendations": {
        "red": [
          "Documentez au moins vos processus de base.",
          "Identifiez les goulots d'étranglement."
        ],
        "amber": [
          "Standardisez les flux de travail.",
          "Mettez en place des révisions régulières."
        ],
        "green": [
          "Automatisez les processus.",
          "Implémentez des analyses avancées."
        ]
      }
    },
    {
      "id": "sales",
      "name": "Ventes",
      "questions": [
        {
          "id": "technology_sales_1",
          "text": "Votre site web convertit-il efficacement les visiteurs en utilisateurs d'essai ou démos ?",
          "options": [
            {
              "label": "Non / Pas du tout",
              "score": 0
            },
            {
              "label": "Partiellement / Moyennement",
              "score": 1
            },
            {
              "label": "Oui / Tout à fait",
              "score": 3
            }
          ]
        },
        {
          "id": "technology_sales_2",
          "text": "Avez-vous une stratégie de \"Lead Nurturing\" automatisée pour les prospects froids ?",
          "options": [
            {
              "label": "Non / Inexistant",
              "score": 0
            },
            {
              "label": "Partiel / En cours d'élaboration",
              "score": 1
            },
            {
              "label": "Oui / Complet et documenté",
              "score": 3
            }
          ]
        }
      ],
      "recommendations": {
        "red": [
          "Définissez clairement vos clients cibles.",
          "Mettez en place une présence numérique de base."
        ],
        "amber": [
          "Lancez des campagnes marketing structurées.",
          "Suivez systématiquement les prospects."
        ],
        "green": [
          "Optimisez la valeur vie client.",
          "Utilisez l'analyse de données."
        ]
      }
    },
    {
      "id": "people",
      "name": "RH",
      "questions": [
        {
          "id": "technology_people_1",
          "text": "Comment gérez-vous la rétention des développeurs face à la forte concurrence du marché ?",
          "options": [
            {
              "label": "Non / Pas du tout",
              "score": 0
            },
            {
              "label": "Partiellement / Moyennement",
              "score": 1
            },
            {
              "label": "Oui / Tout à fait",
              "score": 3
            }
          ]
        },
        {
          "id": "technology_people_2",
          "text": "Favorisez-vous la formation continue sur les nouvelles technologies ?",
          "options": [
            {
              "label": "Aucune formation",
              "score": 0
            },
            {
              "label": "Formation sur le tas / Informelle",
              "score": 1
            },
            {
              "label": "Plan de formation structuré",
              "score": 3
            }
          ]
        }
      ],
      "recommendations": {
        "red": [
          "Définissez clairement les rôles.",
          "Créez des descriptions de poste de base."
        ],
        "amber": [
          "Introduisez des évaluations de performance.",
          "Développez des parcours de carrière."
        ],
        "green": [
          "Construisez un pipeline de leadership.",
          "Implémentez un logiciel RH complet."
        ]
      }
    },
    {
      "id": "strategy",
      "name": "Stratégie",
      "questions": [
        {
          "id": "technology_strategy_1",
          "text": "Votre roadmap produit est-elle alignée avec les retours utilisateurs et la vision long terme ?",
          "options": [
            {
              "label": "Non / Pas du tout",
              "score": 0
            },
            {
              "label": "Partiellement / Moyennement",
              "score": 1
            },
            {
              "label": "Oui / Tout à fait",
              "score": 3
            }
          ]
        },
        {
          "id": "technology_strategy_2",
          "text": "Avez-vous protégé votre propriété intellectuelle (code, brevets, marques) ?",
          "options": [
            {
              "label": "Non / Inexistant",
              "score": 0
            },
            {
              "label": "Partiel / En cours d'élaboration",
              "score": 1
            },
            {
              "label": "Oui / Complet et documenté",
              "score": 3
            }
          ]
        }
      ],
      "recommendations": {
        "red": [
          "Rédigez un plan d'entreprise d'une page.",
          "Définissez vos avantages concurrentiels."
        ],
        "amber": [
          "Tenez des révisions de performance trimestrielles.",
          "Développez des KPI stratégiques."
        ],
        "green": [
          "Mettez en place un conseil consultatif.",
          "Implémentez la planification de scénarios."
        ]
      }
    },
    {
      "id": "technology",
      "name": "Technologie",
      "questions": [
        {
          "id": "technology_technology_1",
          "text": "Gérez-vous activement votre dette technique pour éviter le ralentissement du développement ?",
          "options": [
            {
              "label": "Non / Pas du tout",
              "score": 0
            },
            {
              "label": "Partiellement / Moyennement",
              "score": 1
            },
            {
              "label": "Oui / Tout à fait",
              "score": 3
            }
          ]
        },
        {
          "id": "technology_technology_2",
          "text": "Votre architecture est-elle scalable pour supporter une croissance rapide (x10) ?",
          "options": [
            {
              "label": "Non / Pas du tout",
              "score": 0
            },
            {
              "label": "Partiellement / Moyennement",
              "score": 1
            },
            {
              "label": "Oui / Tout à fait",
              "score": 3
            }
          ]
        }
      ],
      "recommendations": {
        "red": [
          "Adoptez des logiciels métier de base.",
          "Implémentez des sauvegardes régulières."
        ],
        "amber": [
          "Sauvegardez régulièrement les données.",
          "Intégrez les systèmes métier."
        ],
        "green": [
          "Intégrez des systèmes avancés (CRM + ERP).",
          "Explorez l'IA."
        ]
      }
    },
    {
      "id": "risks",
      "name": "Risques",
      "questions": [
        {
          "id": "technology_risks_1",
          "text": "Des tests de pénétration et audits de sécurité sont-ils réalisés régulièrement ?",
          "options": [
            {
              "label": "Jamais / Rarement",
              "score": 0
            },
            {
              "label": "Parfois / Irrégulier",
              "score": 1
            },
            {
              "label": "Systématiquement / Régulier",
              "score": 3
            }
          ]
        },
        {
          "id": "technology_risks_2",
          "text": "Avez-vous un plan de reprise d'activité (PRA) en cas de panne majeure des serveurs ?",
          "options": [
            {
              "label": "Non / Inexistant",
              "score": 0
            },
            {
              "label": "Partiel / En cours d'élaboration",
              "score": 1
            },
            {
              "label": "Oui / Complet et documenté",
              "score": 3
            }
          ]
        }
      ],
      "recommendations": {
        "red": [
          "Identifiez les principaux risques.",
          "Consultez les réglementations applicables."
        ],
        "amber": [
          "Développez un processus de gestion des risques.",
          "Effectuez des audits réguliers."
        ],
        "green": [
          "Implémentez un système complet de gestion des risques.",
          "Obtenez des certifications."
        ]
      }
    },
    {
      "id": "branding",
      "name": "Branding",
      "questions": [
        {
          "id": "technology_branding_1",
          "text": "Votre UI/UX Design est-il moderne et reflète-t-il la qualité technologique de votre solution ?",
          "options": [
            {
              "label": "Non / Pas du tout",
              "score": 0
            },
            {
              "label": "Partiellement / Moyennement",
              "score": 1
            },
            {
              "label": "Oui / Tout à fait",
              "score": 3
            }
          ]
        },
        {
          "id": "technology_branding_2",
          "text": "Êtes-vous perçu comme un leader d'opinion (Thought Leader) dans votre niche tech ?",
          "options": [
            {
              "label": "Non / Pas du tout",
              "score": 0
            },
            {
              "label": "Partiellement / Moyennement",
              "score": 1
            },
            {
              "label": "Oui / Tout à fait",
              "score": 3
            }
          ]
        }
      ],
      "recommendations": {
        "red": [
          "Définissez votre identité de marque.",
          "Créez un logo de base."
        ],
        "amber": [
          "Harmonisez votre branding.",
          "Améliorez la qualité du packaging."
        ],
        "green": [
          "Créez une expérience de marque premium.",
          "Investissez dans un packaging innovant."
        ]
      }
    },
    {
      "id": "export",
      "name": "Export",
      "questions": [
        {
          "id": "technology_export_1",
          "text": "Votre logiciel est-il localisé (i18n) pour supporter facilement plusieurs langues/devises ?",
          "options": [
            {
              "label": "Non / Pas du tout",
              "score": 0
            },
            {
              "label": "Partiellement / Moyennement",
              "score": 1
            },
            {
              "label": "Oui / Tout à fait",
              "score": 3
            }
          ]
        },
        {
          "id": "technology_export_2",
          "text": "Avez-vous vérifié la conformité RGPD/GDPR pour les données des utilisateurs européens ?",
          "options": [
            {
              "label": "Non / Inexistant",
              "score": 0
            },
            {
              "label": "Partiel / En cours d'élaboration",
              "score": 1
            },
            {
              "label": "Oui / Complet et documenté",
              "score": 3
            }
          ]
        }
      ],
      "recommendations": {
        "red": [
          "Évaluez le potentiel d'exportation.",
          "Renseignez-vous sur les réglementations."
        ],
        "amber": [
          "Développez un plan d'exportation.",
          "Établissez des partenariats locaux."
        ],
        "green": [
          "Implémentez une stratégie d'exportation complète.",
          "Créez une présence internationale."
        ]
      }
    }
  ],
  "scoring": {
    "thresholds": {
      "red": [
        0,
        39
      ],
      "amber": [
        40,
        69
      ],
      "green": [
        70,
        100
      ]
    },
    "logic": "Scores des questions (0, 1, 3) convertis en pourcentage par pilier."
  }
};