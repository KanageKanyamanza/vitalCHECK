// Questionnaire sectoriel Export — PME exportatrices structurées (Sénégal / Afrique de l'Ouest)
// L'export est un mode d'activité transversal : le diagnostic évalue la capacité à exporter.
// Format identique aux autres questionnaires sectoriels : { fr, en, levels }
// Valeurs options : 0 (Non) / 2 (Partiellement) / 4 (Oui)
// Contenu : VitalCHECK_Export_Questions_Bilingue.md — Septembre 2026

const fr = {
  pillars: [
    {
      id: "marches",
      name: "Marchés cibles & Clients internationaux",
      questions: [
        {
          id: "export_marches_1",
          text: "Connaissez-vous précisément les exigences de votre marché cible (pays, normes attendues) ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Exigences du marché cible bien identifiées" },
            { value: 2, shortLabel: "Partiellement", label: "Connaissance partielle des exigences" },
            { value: 0, shortLabel: "Non", label: "Marché cible mal connu", recommendation: "Renseignez-vous sur les exigences précises (normes, documents) du pays que vous visez avant d'exporter." },
          ],
        },
        {
          id: "export_marches_2",
          text: "Avez-vous des acheteurs internationaux réguliers (contrats ou relations stables) ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Acheteurs stables, contrats en place" },
            { value: 2, shortLabel: "Partiellement", label: "Acheteurs ponctuels, sans contrat" },
            { value: 0, shortLabel: "Non", label: "Ventes à l'export opportunistes", recommendation: "Cherchez à sécuriser au moins un acheteur régulier avec un engagement d'achat, même informel." },
          ],
        },
        {
          id: "export_marches_3",
          text: "Vos débouchés à l'export sont-ils diversifiés (pas un seul acheteur ou pays) ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Plusieurs acheteurs / marchés" },
            { value: 2, shortLabel: "Partiellement", label: "Un acheteur principal domine" },
            { value: 0, shortLabel: "Non", label: "Dépendance à un seul acheteur étranger", recommendation: "Identifiez un deuxième acheteur ou marché pour réduire votre dépendance." },
          ],
        },
        {
          id: "export_marches_4",
          text: "Adaptez-vous votre produit (emballage, étiquetage, calibrage) aux attentes du marché cible ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Produit conforme aux attentes du marché" },
            { value: 2, shortLabel: "Partiellement", label: "Adaptation partielle" },
            { value: 0, shortLabel: "Non", label: "Produit non adapté au marché cible", recommendation: "Renseignez-vous sur les attentes d'emballage et d'étiquetage de votre marché cible et adaptez votre produit." },
          ],
        },
        {
          id: "export_marches_5",
          text: "Suivez-vous l'information de marché (prix, demande) sur vos marchés d'export ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Information de marché suivie régulièrement" },
            { value: 2, shortLabel: "Partiellement", label: "Information ponctuelle" },
            { value: 0, shortLabel: "Non", label: "Aucune information de marché", recommendation: "Suivez les prix et la demande de votre marché cible (via un acheteur, une chambre de commerce, l'ASEPEX)." },
          ],
        },
      ],
      recommendationPool: {
        low: [
          "Choisissez un premier marché cible clair et étudiez ses exigences.",
          "Prenez contact avec l'ASEPEX pour l'appui à l'export.",
        ],
        mid: [
          "Sécurisez un acheteur régulier avec un engagement d'achat.",
          "Adaptez emballage et étiquetage aux attentes de votre marché.",
        ],
        high: [
          "Diversifiez vos marchés et acheteurs pour réduire les risques.",
          "Explorez de nouveaux marchés (ZLECAf, UE) selon vos atouts.",
        ],
      },
    },
    {
      id: "conformite",
      name: "Conformité & Certification",
      questions: [
        {
          id: "export_conformite_1",
          text: "Maîtrisez-vous les normes sanitaires et de qualité exigées par votre marché cible ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Normes maîtrisées et respectées" },
            { value: 2, shortLabel: "Partiellement", label: "Normes connues mais inégalement respectées" },
            { value: 0, shortLabel: "Non", label: "Normes mal comprises ou non respectées", recommendation: "Identifiez les normes (sanitaires, résidus, qualité) de votre marché cible : leur non-respect = refus en douane." },
          ],
        },
        {
          id: "export_conformite_2",
          text: "Disposez-vous des certifications requises pour votre marché (GlobalG.A.P., HACCP, ISO, bio…) ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Certifications requises en place" },
            { value: 2, shortLabel: "Partiellement", label: "Démarche de certification en cours" },
            { value: 0, shortLabel: "Non", label: "Aucune certification", recommendation: "Renseignez-vous sur la certification exigée par vos acheteurs et engagez la démarche (au besoin avec l'ASEPEX)." },
          ],
        },
        {
          id: "export_conformite_3",
          text: "Assurez-vous la traçabilité de vos produits (lots, origine, intrants) ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Traçabilité opérationnelle par lot" },
            { value: 2, shortLabel: "Partiellement", label: "Traçabilité partielle" },
            { value: 0, shortLabel: "Non", label: "Aucune traçabilité", recommendation: "Mettez en place un suivi simple par lot (origine, date, intrants) : c'est exigé par les marchés d'export." },
          ],
        },
        {
          id: "export_conformite_4",
          text: "Contrôlez-vous la qualité de vos produits avant expédition (tri, analyses) ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Contrôle qualité systématique avant expédition" },
            { value: 2, shortLabel: "Partiellement", label: "Contrôle irrégulier" },
            { value: 0, shortLabel: "Non", label: "Aucun contrôle avant expédition", recommendation: "Instaurez un contrôle qualité (tri, vérification) avant chaque expédition pour éviter les refus." },
          ],
        },
        {
          id: "export_conformite_5",
          text: "Maîtrisez-vous les règles d'hygiène / bonnes pratiques de production pour l'export ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Bonnes pratiques appliquées et documentées" },
            { value: 2, shortLabel: "Partiellement", label: "Bonnes pratiques partielles" },
            { value: 0, shortLabel: "Non", label: "Aucune démarche de bonnes pratiques", recommendation: "Formez-vous aux bonnes pratiques d'hygiène et de production exigées à l'export (HACCP, GAP)." },
          ],
        },
      ],
      recommendationPool: {
        low: [
          "Listez les normes exactes exigées par votre marché cible.",
          "Mettez en place un suivi par lot de vos produits.",
        ],
        mid: [
          "Engagez la démarche de certification demandée par vos acheteurs.",
          "Instaurez un contrôle qualité avant chaque expédition.",
        ],
        high: [
          "Faites-vous accompagner (ASEPEX, laboratoires) pour la mise aux normes.",
          "Visez une certification reconnue pour accéder aux marchés premium.",
        ],
      },
    },
    {
      id: "logistique",
      name: "Logistique internationale & Documentation",
      questions: [
        {
          id: "export_logistique_1",
          text: "Votre chaîne logistique (transport, éventuel froid, délais) est-elle fiable ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Chaîne logistique fiable et maîtrisée" },
            { value: 2, shortLabel: "Partiellement", label: "Fiabilité variable" },
            { value: 0, shortLabel: "Non", label: "Chaîne subie, retards et pertes fréquents", recommendation: "Sécurisez vos transporteurs et vérifiez la conservation (froid) et les délais jusqu'à destination." },
          ],
        },
        {
          id: "export_logistique_2",
          text: "Maîtrisez-vous la documentation d'export (certificats, origine, douane) ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Documentation maîtrisée, dossiers complets" },
            { value: 2, shortLabel: "Partiellement", label: "Documentation approximative, erreurs occasionnelles" },
            { value: 0, shortLabel: "Non", label: "Documentation subie, blocages fréquents", recommendation: "Faites la liste des documents exigés (SPS, certificat d'origine, douane) et préparez-les à l'avance." },
          ],
        },
        {
          id: "export_logistique_3",
          text: "Comprenez-vous vos incoterms (qui paie quoi, qui porte le risque) ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Incoterms compris et négociés" },
            { value: 2, shortLabel: "Partiellement", label: "Notion vague des incoterms" },
            { value: 0, shortLabel: "Non", label: "Incoterms mal maîtrisés", recommendation: "Apprenez les incoterms de base (FOB, CFR/CIF) pour savoir qui paie et qui porte le risque du transport." },
          ],
        },
        {
          id: "export_logistique_4",
          text: "Travaillez-vous avec un transitaire ou un partenaire logistique fiable ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Transitaire fiable, relation établie" },
            { value: 2, shortLabel: "Partiellement", label: "Recours ponctuel, sans partenaire fixe" },
            { value: 0, shortLabel: "Non", label: "Aucun partenaire logistique", recommendation: "Identifiez un transitaire fiable pour gérer douane, transport et documentation à votre place." },
          ],
        },
        {
          id: "export_logistique_5",
          text: "Anticipez-vous vos coûts logistiques pour ne pas rogner votre marge à l'export ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Coûts logistiques anticipés et intégrés au prix" },
            { value: 2, shortLabel: "Partiellement", label: "Coûts estimés vaguement" },
            { value: 0, shortLabel: "Non", label: "Coûts logistiques subis, marge imprévisible", recommendation: "Chiffrez le transport, l'assurance et la manutention avant de fixer votre prix export." },
          ],
        },
      ],
      recommendationPool: {
        low: [
          "Listez tous les documents exigés pour votre expédition.",
          "Apprenez les incoterms de base (FOB, CIF).",
        ],
        mid: [
          "Établissez une relation avec un transitaire fiable.",
          "Chiffrez vos coûts logistiques avant de fixer vos prix.",
        ],
        high: [
          "Sécurisez votre chaîne du froid jusqu'à destination si nécessaire.",
          "Standardisez vos dossiers d'export pour éviter les blocages en douane.",
        ],
      },
    },
    {
      id: "finance",
      name: "Financement & Risque international",
      questions: [
        {
          id: "export_finance_1",
          text: "Pouvez-vous financer votre campagne d'export (achats, mise aux normes, logistique avant paiement) ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Financement de campagne assuré" },
            { value: 2, shortLabel: "Partiellement", label: "Financement limité ou incertain" },
            { value: 0, shortLabel: "Non", label: "Incapacité à préfinancer la campagne", recommendation: "Rapprochez-vous d'une banque ou d'un dispositif d'appui pour préfinancer votre campagne d'export." },
          ],
        },
        {
          id: "export_finance_2",
          text: "Sécurisez-vous vos paiements internationaux (lettre de crédit, acheteur fiable, acompte) ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Paiements sécurisés (LC, acompte, acheteur établi)" },
            { value: 2, shortLabel: "Partiellement", label: "Sécurisation partielle" },
            { value: 0, shortLabel: "Non", label: "Aucune sécurisation, exposition aux impayés", recommendation: "Exigez un acompte ou une lettre de crédit pour vos nouveaux acheteurs afin d'éviter les impayés." },
          ],
        },
        {
          id: "export_finance_3",
          text: "Gérez-vous le risque de change quand vous vendez hors zone euro/FCFA ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Risque de change géré ou sans objet (zone euro/FCFA)" },
            { value: 2, shortLabel: "Partiellement", label: "Risque connu mais non géré" },
            { value: 0, shortLabel: "Non", label: "Risque de change subi", recommendation: "Si vous vendez en devise étrangère, renseignez-vous sur les moyens de limiter le risque de change." },
          ],
        },
        {
          id: "export_finance_4",
          text: "Connaissez-vous votre prix de revient export réel (produit + mise aux normes + logistique) ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Prix de revient export connu et suivi" },
            { value: 2, shortLabel: "Partiellement", label: "Estimation approximative" },
            { value: 0, shortLabel: "Non", label: "Prix de revient export inconnu", recommendation: "Additionnez tous vos coûts (produit, certification, transport) pour connaître votre vrai prix de revient export." },
          ],
        },
        {
          id: "export_finance_5",
          text: "Tenez-vous une comptabilité qui vous permet de présenter des documents à une banque ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Documents de gestion prêts et présentables" },
            { value: 2, shortLabel: "Partiellement", label: "Documents partiels" },
            { value: 0, shortLabel: "Non", label: "Aucun document exploitable par une banque", recommendation: "Tenez une comptabilité claire : c'est indispensable pour accéder au financement du commerce international." },
          ],
        },
      ],
      recommendationPool: {
        low: [
          "Exigez un acompte de vos nouveaux acheteurs.",
          "Additionnez tous vos coûts pour connaître votre prix de revient export.",
        ],
        mid: [
          "Sécurisez vos paiements par lettre de crédit ou acompte.",
          "Rapprochez-vous d'une banque pour le financement de campagne.",
        ],
        high: [
          "Étudiez l'assurance-crédit export pour couvrir le risque d'impayé.",
          "Structurez votre comptabilité pour accéder au financement du commerce.",
        ],
      },
    },
    {
      id: "organisation",
      name: "Organisation export & Appui",
      questions: [
        {
          id: "export_organisation_1",
          text: "Avez-vous une personne ou une organisation dédiée à la gestion de l'export ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Fonction export identifiée et organisée" },
            { value: 2, shortLabel: "Partiellement", label: "Export géré « en plus », sans organisation" },
            { value: 0, shortLabel: "Non", label: "Aucune organisation dédiée", recommendation: "Désignez un responsable de l'export, même à temps partiel, pour piloter les démarches." },
          ],
        },
        {
          id: "export_organisation_2",
          text: "Pouvez-vous tenir les volumes et les délais promis à vos acheteurs internationaux ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Capacité à honorer volumes et délais" },
            { value: 2, shortLabel: "Partiellement", label: "Capacité limite, tensions occasionnelles" },
            { value: 0, shortLabel: "Non", label: "Incapacité fréquente à honorer les commandes", recommendation: "Évaluez votre capacité réelle avant de vous engager sur des volumes que vous ne pourriez pas tenir." },
          ],
        },
        {
          id: "export_organisation_3",
          text: "Recourez-vous aux dispositifs d'appui à l'export (ASEPEX, programmes qualité) ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Appuis utilisés activement" },
            { value: 2, shortLabel: "Partiellement", label: "Appuis connus mais peu utilisés" },
            { value: 0, shortLabel: "Non", label: "Aucun recours aux appuis", recommendation: "Contactez l'ASEPEX et les programmes d'appui : ils accélèrent la mise aux normes et l'accès aux marchés." },
          ],
        },
        {
          id: "export_organisation_4",
          text: "Contractualisez-vous clairement avec vos acheteurs (périmètre, qualité, paiement) ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Contrats clairs et respectés" },
            { value: 2, shortLabel: "Partiellement", label: "Accords informels" },
            { value: 0, shortLabel: "Non", label: "Aucun contrat écrit", recommendation: "Formalisez un contrat précisant qualité, volumes, prix et conditions de paiement avec vos acheteurs." },
          ],
        },
        {
          id: "export_organisation_5",
          text: "Apprenez-vous de chaque expédition pour améliorer la suivante (retours, incidents) ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Retours d'expérience exploités" },
            { value: 2, shortLabel: "Partiellement", label: "Retours informels" },
            { value: 0, shortLabel: "Non", label: "Aucun retour d'expérience", recommendation: "Après chaque expédition, notez ce qui a posé problème (douane, qualité, délais) pour corriger la fois suivante." },
          ],
        },
      ],
      recommendationPool: {
        low: [
          "Désignez un responsable de l'export, même à temps partiel.",
          "Contactez l'ASEPEX pour un premier appui.",
        ],
        mid: [
          "Formalisez des contrats clairs avec vos acheteurs.",
          "Évaluez votre capacité avant de vous engager sur des volumes.",
        ],
        high: [
          "Structurez une véritable fonction export dans votre entreprise.",
          "Exploitez les retours d'expérience pour fiabiliser vos expéditions.",
        ],
      },
    },
  ],
};

const en = {
  pillars: [
    {
      id: "marches",
      name: "Target Markets & International Clients",
      questions: [
        {
          id: "export_marches_1",
          text: "Do you know precisely the requirements of your target market (country, expected standards)?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Target-market requirements clearly identified" },
            { value: 2, shortLabel: "Partially", label: "Partial knowledge of requirements" },
            { value: 0, shortLabel: "No", label: "Target market poorly understood", recommendation: "Research the precise requirements (standards, documents) of the country you target before exporting." },
          ],
        },
        {
          id: "export_marches_2",
          text: "Do you have regular international buyers (contracts or stable relationships)?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Stable buyers, contracts in place" },
            { value: 2, shortLabel: "Partially", label: "Occasional buyers, no contract" },
            { value: 0, shortLabel: "No", label: "Opportunistic export sales", recommendation: "Aim to secure at least one regular buyer with a purchase commitment, even informal." },
          ],
        },
        {
          id: "export_marches_3",
          text: "Are your export outlets diversified (not a single buyer or country)?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Several buyers / markets" },
            { value: 2, shortLabel: "Partially", label: "One main buyer dominates" },
            { value: 0, shortLabel: "No", label: "Dependence on a single foreign buyer", recommendation: "Identify a second buyer or market to reduce your dependence." },
          ],
        },
        {
          id: "export_marches_4",
          text: "Do you adapt your product (packaging, labeling, grading) to the target market's expectations?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Product tailored to market expectations" },
            { value: 2, shortLabel: "Partially", label: "Partial adaptation" },
            { value: 0, shortLabel: "No", label: "Product not adapted to the target market", recommendation: "Find out the packaging and labeling expectations of your target market and adapt your product." },
          ],
        },
        {
          id: "export_marches_5",
          text: "Do you track market information (prices, demand) on your export markets?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Market information tracked regularly" },
            { value: 2, shortLabel: "Partially", label: "Occasional information" },
            { value: 0, shortLabel: "No", label: "No market information", recommendation: "Track prices and demand in your target market (via a buyer, a chamber of commerce, ASEPEX)." },
          ],
        },
      ],
      recommendationPool: {
        low: [
          "Choose a clear first target market and study its requirements.",
          "Reach out to ASEPEX for export support.",
        ],
        mid: [
          "Secure a regular buyer with a purchase commitment.",
          "Adapt packaging and labeling to your market's expectations.",
        ],
        high: [
          "Diversify your markets and buyers to reduce risk.",
          "Explore new markets (AfCFTA, EU) based on your strengths.",
        ],
      },
    },
    {
      id: "conformite",
      name: "Compliance & Certification",
      questions: [
        {
          id: "export_conformite_1",
          text: "Do you master the health and quality standards required by your target market?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Standards mastered and met" },
            { value: 2, shortLabel: "Partially", label: "Standards known but unevenly met" },
            { value: 0, shortLabel: "No", label: "Standards poorly understood or unmet", recommendation: "Identify your target market's standards (health, residues, quality): failing them means customs rejection." },
          ],
        },
        {
          id: "export_conformite_2",
          text: "Do you hold the certifications required for your market (GlobalG.A.P., HACCP, ISO, organic…)?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Required certifications in place" },
            { value: 2, shortLabel: "Partially", label: "Certification process underway" },
            { value: 0, shortLabel: "No", label: "No certification", recommendation: "Find out which certification your buyers require and start the process (with ASEPEX if needed)." },
          ],
        },
        {
          id: "export_conformite_3",
          text: "Do you ensure traceability of your products (lots, origin, inputs)?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Operational lot-level traceability" },
            { value: 2, shortLabel: "Partially", label: "Partial traceability" },
            { value: 0, shortLabel: "No", label: "No traceability", recommendation: "Set up simple lot-level tracking (origin, date, inputs): export markets require it." },
          ],
        },
        {
          id: "export_conformite_4",
          text: "Do you check product quality before shipping (sorting, testing)?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Systematic quality check before shipping" },
            { value: 2, shortLabel: "Partially", label: "Irregular checks" },
            { value: 0, shortLabel: "No", label: "No pre-shipment check", recommendation: "Set up a quality check (sorting, verification) before each shipment to avoid rejections." },
          ],
        },
        {
          id: "export_conformite_5",
          text: "Do you master the hygiene rules / good production practices for export?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Good practices applied and documented" },
            { value: 2, shortLabel: "Partially", label: "Partial good practices" },
            { value: 0, shortLabel: "No", label: "No good-practice approach", recommendation: "Get trained in the hygiene and production good practices required for export (HACCP, GAP)." },
          ],
        },
      ],
      recommendationPool: {
        low: [
          "List the exact standards required by your target market.",
          "Set up lot-level tracking of your products.",
        ],
        mid: [
          "Start the certification process your buyers require.",
          "Set up a quality check before each shipment.",
        ],
        high: [
          "Get support (ASEPEX, labs) to meet the standards.",
          "Aim for a recognized certification to access premium markets.",
        ],
      },
    },
    {
      id: "logistique",
      name: "International Logistics & Documentation",
      questions: [
        {
          id: "export_logistique_1",
          text: "Is your logistics chain (transport, cold chain if needed, lead times) reliable?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Reliable, controlled logistics chain" },
            { value: 2, shortLabel: "Partially", label: "Variable reliability" },
            { value: 0, shortLabel: "No", label: "Chain out of control, frequent delays and losses", recommendation: "Secure your carriers and check preservation (cold chain) and lead times to destination." },
          ],
        },
        {
          id: "export_logistique_2",
          text: "Do you master export documentation (certificates, origin, customs)?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Documentation mastered, complete files" },
            { value: 2, shortLabel: "Partially", label: "Approximate documentation, occasional errors" },
            { value: 0, shortLabel: "No", label: "Documentation struggled with, frequent blockages", recommendation: "List the required documents (SPS, certificate of origin, customs) and prepare them in advance." },
          ],
        },
        {
          id: "export_logistique_3",
          text: "Do you understand your incoterms (who pays what, who bears the risk)?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Incoterms understood and negotiated" },
            { value: 2, shortLabel: "Partially", label: "Vague notion of incoterms" },
            { value: 0, shortLabel: "No", label: "Incoterms poorly understood", recommendation: "Learn the basic incoterms (FOB, CFR/CIF) to know who pays and who bears the transport risk." },
          ],
        },
        {
          id: "export_logistique_4",
          text: "Do you work with a reliable freight forwarder or logistics partner?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Reliable forwarder, established relationship" },
            { value: 2, shortLabel: "Partially", label: "Occasional use, no fixed partner" },
            { value: 0, shortLabel: "No", label: "No logistics partner", recommendation: "Find a reliable freight forwarder to handle customs, transport and documentation for you." },
          ],
        },
        {
          id: "export_logistique_5",
          text: "Do you anticipate your logistics costs so they don't eat into your export margin?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Logistics costs anticipated and built into the price" },
            { value: 2, shortLabel: "Partially", label: "Costs roughly estimated" },
            { value: 0, shortLabel: "No", label: "Logistics costs absorbed blindly, unpredictable margin", recommendation: "Cost out transport, insurance and handling before setting your export price." },
          ],
        },
      ],
      recommendationPool: {
        low: [
          "List all documents required for your shipment.",
          "Learn the basic incoterms (FOB, CIF).",
        ],
        mid: [
          "Build a relationship with a reliable freight forwarder.",
          "Cost out your logistics before setting your prices.",
        ],
        high: [
          "Secure your cold chain to destination if needed.",
          "Standardize your export files to avoid customs blockages.",
        ],
      },
    },
    {
      id: "finance",
      name: "Financing & International Risk",
      questions: [
        {
          id: "export_finance_1",
          text: "Can you finance your export campaign (purchases, compliance, logistics before payment)?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Campaign financing secured" },
            { value: 2, shortLabel: "Partially", label: "Limited or uncertain financing" },
            { value: 0, shortLabel: "No", label: "Unable to pre-finance the campaign", recommendation: "Approach a bank or a support scheme to pre-finance your export campaign." },
          ],
        },
        {
          id: "export_finance_2",
          text: "Do you secure your international payments (letter of credit, reliable buyer, deposit)?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Payments secured (LC, deposit, established buyer)" },
            { value: 2, shortLabel: "Partially", label: "Partial security" },
            { value: 0, shortLabel: "No", label: "No security, exposed to non-payment", recommendation: "Require a deposit or a letter of credit from new buyers to avoid non-payment." },
          ],
        },
        {
          id: "export_finance_3",
          text: "Do you manage exchange-rate risk when selling outside the euro/CFA zone?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Exchange risk managed or not applicable (euro/CFA zone)" },
            { value: 2, shortLabel: "Partially", label: "Risk known but not managed" },
            { value: 0, shortLabel: "No", label: "Exchange risk absorbed blindly", recommendation: "If you sell in foreign currency, look into ways to limit exchange-rate risk." },
          ],
        },
        {
          id: "export_finance_4",
          text: "Do you know your real export cost (product + compliance + logistics)?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Export cost known and tracked" },
            { value: 2, shortLabel: "Partially", label: "Rough estimate" },
            { value: 0, shortLabel: "No", label: "Export cost unknown", recommendation: "Add up all your costs (product, certification, transport) to know your real export cost." },
          ],
        },
        {
          id: "export_finance_5",
          text: "Do you keep accounts that let you present documents to a bank?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Management documents ready and presentable" },
            { value: 2, shortLabel: "Partially", label: "Partial documents" },
            { value: 0, shortLabel: "No", label: "No documents usable by a bank", recommendation: "Keep clear accounts: it's essential to access trade financing." },
          ],
        },
      ],
      recommendationPool: {
        low: [
          "Require a deposit from new buyers.",
          "Add up all your costs to know your export cost.",
        ],
        mid: [
          "Secure your payments with a letter of credit or deposit.",
          "Approach a bank for campaign financing.",
        ],
        high: [
          "Look into export credit insurance to cover non-payment risk.",
          "Structure your accounts to access trade financing.",
        ],
      },
    },
    {
      id: "organisation",
      name: "Export Organization & Support",
      questions: [
        {
          id: "export_organisation_1",
          text: "Do you have a person or setup dedicated to managing export?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Export function identified and organized" },
            { value: 2, shortLabel: "Partially", label: "Export handled on the side, no organization" },
            { value: 0, shortLabel: "No", label: "No dedicated organization", recommendation: "Appoint an export lead, even part-time, to drive the process." },
          ],
        },
        {
          id: "export_organisation_2",
          text: "Can you meet the volumes and deadlines promised to your international buyers?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Able to meet volumes and deadlines" },
            { value: 2, shortLabel: "Partially", label: "Capacity at the limit, occasional strain" },
            { value: 0, shortLabel: "No", label: "Frequent inability to fulfill orders", recommendation: "Assess your real capacity before committing to volumes you couldn't meet." },
          ],
        },
        {
          id: "export_organisation_3",
          text: "Do you use export support schemes (ASEPEX, quality programs)?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Support actively used" },
            { value: 2, shortLabel: "Partially", label: "Support known but little used" },
            { value: 0, shortLabel: "No", label: "No use of support", recommendation: "Contact ASEPEX and support programs: they speed up compliance and market access." },
          ],
        },
        {
          id: "export_organisation_4",
          text: "Do you contract clearly with your buyers (scope, quality, payment)?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Clear, honored contracts" },
            { value: 2, shortLabel: "Partially", label: "Informal agreements" },
            { value: 0, shortLabel: "No", label: "No written contract", recommendation: "Formalize a contract specifying quality, volumes, price and payment terms with your buyers." },
          ],
        },
        {
          id: "export_organisation_5",
          text: "Do you learn from each shipment to improve the next (feedback, incidents)?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Lessons learned and applied" },
            { value: 2, shortLabel: "Partially", label: "Informal feedback" },
            { value: 0, shortLabel: "No", label: "No lessons learned", recommendation: "After each shipment, note what went wrong (customs, quality, timing) to fix it next time." },
          ],
        },
      ],
      recommendationPool: {
        low: [
          "Appoint an export lead, even part-time.",
          "Contact ASEPEX for initial support.",
        ],
        mid: [
          "Formalize clear contracts with your buyers.",
          "Assess your capacity before committing to volumes.",
        ],
        high: [
          "Build a genuine export function in your company.",
          "Use lessons learned to make your shipments more reliable.",
        ],
      },
    },
  ],
};

// Niveaux de maturité spécifiques Export
const levels = [
  {
    id: "critique",
    min: 0,
    max: 39,
    color: "#ef4444",
    label: { fr: "Critique", en: "Critical" },
    interpretation: {
      fr: "Votre capacité d'export fait face à des risques importants. Une action rapide est nécessaire pour structurer votre démarche (normes, documentation, financement).",
      en: "Your export capability faces significant risks. Immediate action is needed to structure your approach (standards, documentation, financing).",
    },
  },
  {
    id: "vulnerable",
    min: 40,
    max: 59,
    color: "#f97316",
    label: { fr: "Vulnérable", en: "Vulnerable" },
    interpretation: {
      fr: "Votre démarche export fonctionne mais repose sur des bases fragiles. Plusieurs axes nécessitent une attention prioritaire.",
      en: "Your export activity works but rests on fragile foundations. Several areas require priority attention.",
    },
  },
  {
    id: "stable",
    min: 60,
    max: 79,
    color: "#eab308",
    label: { fr: "Stable", en: "Stable" },
    interpretation: {
      fr: "Votre démarche export a des bases solides. Quelques ajustements ciblés sécuriseront vos marchés et vos paiements.",
      en: "Your export activity has solid foundations. A few targeted adjustments will secure your markets and payments.",
    },
  },
  {
    id: "pret",
    min: 80,
    max: 89,
    color: "#22c55e",
    label: { fr: "Prêt pour la croissance", en: "Growth-Ready" },
    interpretation: {
      fr: "Votre entreprise est bien structurée pour exporter et prête à élargir ses marchés internationaux.",
      en: "Your business is well-structured for export and ready to expand its international markets.",
    },
  },
  {
    id: "haute_performance",
    min: 90,
    max: 100,
    color: "#6366f1",
    label: { fr: "Haute performance", en: "High Performance" },
    interpretation: {
      fr: "Votre entreprise affiche une excellente maturité export sur l'ensemble des piliers clés. Continuez sur cette lancée !",
      en: "Your business shows excellent export maturity across all key pillars. Keep up the great work!",
    },
  },
];

module.exports = { fr, en, levels };
