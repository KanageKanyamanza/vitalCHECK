module.exports = {
  "pillars": [
    {
      "id": "finance",
      "name": "Finance",
      "questions": [
        {
          "id": "services_finance_1",
          "text": "Calculez-vous la rentabilité réelle par mission/projet (heures vendues vs heures passées) ?",
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
          "id": "services_finance_2",
          "text": "Avez-vous automatisé la facturation récurrente (abonnements) pour sécuriser le cash-flow ?",
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
          "id": "services_operations_1",
          "text": "Vos processus d'onboarding client sont-ils standardisés pour garantir une qualité constante ?",
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
          "id": "services_operations_2",
          "text": "Utilisez-vous un outil de gestion de projet partagé pour le suivi des livrables ?",
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
          "id": "services_sales_1",
          "text": "Avez-vous une stratégie de recommandation active pour générer du bouche-à-oreille qualifié ?",
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
        },
        {
          "id": "services_sales_2",
          "text": "Votre proposition de valeur est-elle clairement différenciée des concurrents généralistes ?",
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
          "id": "services_people_1",
          "text": "Comment partagez-vous la connaissance en interne pour ne pas dépendre d'un seul expert ?",
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
          "id": "services_people_2",
          "text": "Vos collaborateurs sont-ils formés à la relation client en plus de leur expertise technique ?",
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
          "id": "services_strategy_1",
          "text": "Cherchez-vous à \"produitiser\" vos services pour les rendre plus scalables ?",
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
          "id": "services_strategy_2",
          "text": "Avez-vous défini votre client idéal (Avatar) pour refuser les projets non rentables ?",
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
          "id": "services_technology_1",
          "text": "Utilisez-vous des outils collaboratifs sécurisés pour échanger des documents sensibles ?",
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
          "id": "services_technology_2",
          "text": "Votre CRM permet-il de suivre tout l'historique des interactions avec chaque client ?",
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
          "id": "services_risks_1",
          "text": "Avez-vous une assurance Responsabilité Civile Professionnelle adaptée à vos enjeux ?",
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
        },
        {
          "id": "services_risks_2",
          "text": "Vos contrats clients limitent-ils bien votre responsabilité et définissent-ils le périmètre ?",
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
          "id": "services_branding_1",
          "text": "Votre personal branding (dirigeants/experts) renforce-t-il la crédibilité de l'entreprise ?",
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
          "id": "services_branding_2",
          "text": "Publiez-vous des études de cas ou des livres blancs pour prouver votre expertise ?",
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
          "id": "services_export_1",
          "text": "Êtes-vous capables de délivrer vos services 100% à distance et en anglais ?",
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
          "id": "services_export_2",
          "text": "Avez-vous étudié la fiscalité des services (TVA, retenue à la source) à l'international ?",
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