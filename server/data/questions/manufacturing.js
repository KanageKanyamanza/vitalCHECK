module.exports = {
  "pillars": [
    {
      "id": "finance",
      "name": "Finance",
      "questions": [
        {
          "id": "manufacturing_finance_1",
          "text": "Connaissez-vous le coût de revient industriel exact de chaque unité produite ?",
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
          "id": "manufacturing_finance_2",
          "text": "Avez-vous calculé le seuil de rentabilité de vos équipements majeurs ?",
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
          "id": "manufacturing_operations_1",
          "text": "Avez-vous une démarche d'amélioration continue (Lean, Kaizen) pour réduire les déchets ?",
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
          "id": "manufacturing_operations_2",
          "text": "La maintenance préventive de vos machines est-elle planifiée et respectée ?",
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
          "id": "manufacturing_sales_1",
          "text": "Votre carnet de commandes offre-t-il une visibilité suffisante sur la production à venir ?",
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
          "id": "manufacturing_sales_2",
          "text": "Travaillez-vous avec des distributeurs ou en vente directe aux industriels/consommateurs ?",
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
          "id": "manufacturing_people_1",
          "text": "La sécurité au travail (EPI, formations) est-elle votre priorité absolue ?",
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
        },
        {
          "id": "manufacturing_people_2",
          "text": "Avez-vous des plans de polyvalence pour pallier l'absence d'opérateurs clés ?",
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
          "id": "manufacturing_strategy_1",
          "text": "Avez-vous sécurisé vos approvisionnements stratégiques (double sourcing) ?",
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
          "id": "manufacturing_strategy_2",
          "text": "Investissez-vous dans la modernisation de l'outil industriel (Industrie 4.0) ?",
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
          "id": "manufacturing_technology_1",
          "text": "Utilisez-vous un ERP/GPAO pour piloter la production et les stocks en temps réel ?",
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
          "id": "manufacturing_technology_2",
          "text": "Avez-vous digitalisé les fiches de suivi de production (zéro papier) ?",
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
          "id": "manufacturing_risks_1",
          "text": "Vos installations sont-elles aux normes environnementales et incendie ?",
          "options": [
            {
              "label": "Non conforme / Ignoré",
              "score": 0
            },
            {
              "label": "Partiellement conforme",
              "score": 1
            },
            {
              "label": "Entièrement conforme et audité",
              "score": 3
            }
          ]
        },
        {
          "id": "manufacturing_risks_2",
          "text": "Avez-vous un plan de continuité en cas de rupture de la chaîne logistique ?",
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
          "id": "manufacturing_branding_1",
          "text": "Le design industriel de vos produits est-il un facteur de différenciation ?",
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
          "id": "manufacturing_branding_2",
          "text": "Communiquez-vous sur la qualité de fabrication et l'origine (Made in...) ?",
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
          "id": "manufacturing_export_1",
          "text": "Vos produits respectent-ils les normes techniques (CE, UL, ISO) des pays cibles ?",
          "options": [
            {
              "label": "Non conforme / Ignoré",
              "score": 0
            },
            {
              "label": "Partiellement conforme",
              "score": 1
            },
            {
              "label": "Entièrement conforme et audité",
              "score": 3
            }
          ]
        },
        {
          "id": "manufacturing_export_2",
          "text": "Avez-vous un réseau de partenaires locaux pour le SAV et la maintenance à l'export ?",
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