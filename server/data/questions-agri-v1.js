// Questionnaire sectoriel Agriculture — Diagnostic Exploitation Agricole +10 ha
// Format identique à questions-v2.js : { fr, en, levels }
// Valeurs options : 0 (Non) / 2 (Partiellement) / 4 (Oui)
// levels : interprétations spécifiques agriculture ("votre exploitation" au lieu de "votre entreprise")

const fr = {
  pillars: [
    {
      id: "pilotage",
      name: "Pilotage de l'Exploitation",
      questions: [
        {
          id: "agri_pilotage_1",
          text: "Avez-vous un plan stratégique formalisé pour votre exploitation (objectifs à 3-5 ans, plan de succession, orientations de production) ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Oui, documenté et révisé régulièrement" },
            { value: 2, shortLabel: "Partiellement", label: "Partiellement, quelques orientations définies mais non formalisées" },
            { value: 0, shortLabel: "Non", label: "Non, nous gérons au quotidien sans vision pluriannuelle", recommendation: "Formalisez un plan stratégique à 3 ans incluant vos objectifs de production, surfaces visées et un plan de succession. Même une page suffit pour clarifier votre cap." },
          ],
        },
        {
          id: "agri_pilotage_2",
          text: "Suivez-vous des indicateurs de performance clés (rendements par culture/élevage, marge brute par hectare, taux de chargement) sur une base annuelle ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Oui, tableau de bord à jour avec comparaison N-1" },
            { value: 2, shortLabel: "Partiellement", label: "Partiellement, quelques indicateurs suivis mais sans outil structuré" },
            { value: 0, shortLabel: "Non", label: "Non, pas de suivi formalisé des performances", recommendation: "Mettez en place un tableau de bord simple (Excel ou logiciel de gestion agricole) avec au minimum le rendement par culture, la marge brute/ha et le coût de production pour identifier vos leviers de rentabilité." },
          ],
        },
        {
          id: "agri_pilotage_3",
          text: "Êtes-vous à jour dans vos obligations réglementaires (conditionnalité PAC, normes environnementales, bien-être animal le cas échéant) ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Oui, conformité assurée et audits passés sans réserve majeure" },
            { value: 2, shortLabel: "Partiellement", label: "Partiellement, quelques points de non-conformité identifiés et en cours de correction" },
            { value: 0, shortLabel: "Non", label: "Non, nous avons des écarts réglementaires non résolus", recommendation: "Réalisez un audit de conformité avec votre conseiller agricole. Les non-conformités PAC exposent à des pénalités sur vos aides directes. Priorisez les points à enjeux financiers immédiats." },
          ],
        },
        {
          id: "agri_pilotage_4",
          text: "Participez-vous à des réseaux professionnels (coopérative, groupement d'employeurs, CUMA, groupes de développement) pour partager vos pratiques et vous comparer ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Oui, membre actif d'au moins 2 structures avec échanges réguliers" },
            { value: 2, shortLabel: "Partiellement", label: "Partiellement, adhésion formelle mais participation limitée" },
            { value: 0, shortLabel: "Non", label: "Non, nous travaillons de manière indépendante", recommendation: "Rejoignez un groupe de développement agricole ou une CUMA locale. Le benchmarking entre pairs est le moyen le plus direct d'identifier les pratiques différenciantes et de réduire vos coûts." },
          ],
        },
        {
          id: "agri_pilotage_5",
          text: "Avez-vous une vision claire de la transmission ou de l'évolution capitalistique de votre exploitation à horizon 10 ans (cession, intégration d'un associé, constitution d'une société) ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Oui, scénarios définis et accompagnement juridique/fiscal en cours" },
            { value: 2, shortLabel: "Partiellement", label: "Partiellement, réflexion engagée mais aucune décision formalisée" },
            { value: 0, shortLabel: "Non", label: "Non, la question n'a pas encore été abordée", recommendation: "Consultez un conseiller spécialisé en transmission agricole (Chambre d'Agriculture, notaire). Une préparation 5 à 10 ans avant la cession optimise la valeur de reprise et réduit la fiscalité." },
          ],
        },
      ],
      recommendationPool: {
        low: [
          "Faites-vous accompagner par votre Chambre d'Agriculture pour établir un diagnostic global de votre exploitation et définir vos axes prioritaires.",
          "Mettez en place un tableau de bord mensuel avec 5 indicateurs clés : rendement, marge brute/ha, trésorerie, endettement et taux de chargement.",
          "Adhérez à un groupement de développement agricole pour bénéficier de références technico-économiques locales.",
        ],
        mid: [
          "Formalisez votre plan stratégique en définissant 3 objectifs mesurables pour les 3 prochaines années.",
          "Planifiez un audit de conformité réglementaire annuel avant les contrôles PAC.",
          "Engagez une réflexion sur la structure juridique optimale pour votre exploitation (EARL, GAEC, SAS agricole).",
        ],
        high: [
          "Mettez en place une gouvernance formelle avec comptes rendus de gestion trimestriels si vous êtes en société.",
          "Développez un tableau de bord prospectif intégrant des scénarios climatiques et de marché pour renforcer votre résilience.",
          "Initiez les démarches de transmission patrimoniale avec un conseiller en gestion de patrimoine agricole.",
        ],
      },
    },
    {
      id: "finance",
      name: "Santé Financière",
      questions: [
        {
          id: "agri_finance_1",
          text: "Votre exploitation dégage-t-elle régulièrement un excédent brut d'exploitation (EBE) suffisant pour couvrir vos annuités d'emprunt et votre prélèvement privé ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Oui, taux de couverture supérieur à 130 % en moyenne sur 3 ans" },
            { value: 2, shortLabel: "Partiellement", label: "Partiellement, couverture assurée mais avec peu de marge les mauvaises années" },
            { value: 0, shortLabel: "Non", label: "Non, certaines années ne permettent pas de couvrir nos charges fixes", recommendation: "Analysez votre point mort de trésorerie avec votre comptable. Identifiez les charges compressibles et négociez un rééchelonnement de vos annuités en cas de tension. Constituez une épargne de précaution équivalente à 3 mois de charges fixes." },
          ],
        },
        {
          id: "agri_finance_2",
          text: "Connaissez-vous précisément votre coût de production unitaire par culture ou par litre/kg produit, et le comparez-vous au prix de marché ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Oui, calculé annuellement et intégré dans mes décisions de commercialisation" },
            { value: 2, shortLabel: "Partiellement", label: "Partiellement, estimation globale mais sans ventilation précise par atelier" },
            { value: 0, shortLabel: "Non", label: "Non, je ne connais pas mon coût de revient précis", recommendation: "Calculez votre coût de production par culture avec la méthode proposée par votre coopérative ou l'INOSYS. Sans ce repère, vous ne pouvez pas évaluer la viabilité de vos choix de production ni négocier vos prix de vente en connaissance de cause." },
          ],
        },
        {
          id: "agri_finance_3",
          text: "Votre ratio d'endettement (dettes totales / actif total) est-il inférieur à 50 % et votre capacité de remboursement maîtrisée (annuités < 30 % de l'EBE) ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Oui, ratios financiers sains et suivi par mon comptable" },
            { value: 2, shortLabel: "Partiellement", label: "Partiellement, un des ratios est tendu mais la situation reste gérée" },
            { value: 0, shortLabel: "Non", label: "Non, notre endettement est élevé et nos annuités pèsent sur notre trésorerie", recommendation: "Rencontrez votre banquier et votre comptable pour restructurer votre dette. Explorez les outils de lissage (prêts bonifoniés, garanties SOFIPROTÉOL, fonds de garantie MSA). Un endettement excessif est le principal facteur de fragilité des exploitations." },
          ],
        },
        {
          id: "agri_finance_4",
          text: "Optimisez-vous votre accès aux aides publiques (PAC, MAEC, aides régionales à l'investissement, crédit impôt formation) et les mobilisez-vous systématiquement ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Oui, veille active avec un conseiller et dossiers déposés dans les délais" },
            { value: 2, shortLabel: "Partiellement", label: "Partiellement, aides de base mobilisées mais des dispositifs nous échappent" },
            { value: 0, shortLabel: "Non", label: "Non, nous ne suivons pas l'ensemble des dispositifs disponibles", recommendation: "Demandez à votre Chambre d'Agriculture un audit de vos droits aux aides. Pour une exploitation de +10 ha, les MAEC, les aides à l'investissement (PCAE) et les aides à l'installation/transmission représentent souvent plusieurs milliers d'euros non mobilisés." },
          ],
        },
        {
          id: "agri_finance_5",
          text: "Disposez-vous d'un plan de gestion du risque économique (assurance récolte, épargne de précaution, diversification des revenus, outils de couverture de prix) ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Oui, plusieurs outils combinés et révisés annuellement" },
            { value: 2, shortLabel: "Partiellement", label: "Partiellement, assurance souscrite mais stratégie globale peu formalisée" },
            { value: 0, shortLabel: "Non", label: "Non, nous ne disposons d'aucun dispositif de couverture des risques", recommendation: "Combinez a minima l'assurance récolte multirisque climatique, une épargne de précaution (DEP ou épargne bancaire) et la diversification de vos débouchés. La combinaison de plusieurs outils réduit significativement la volatilité de votre revenu." },
          ],
        },
      ],
      recommendationPool: {
        low: [
          "Réalisez un diagnostic financier complet avec votre centre de gestion pour identifier vos leviers d'amélioration de la rentabilité.",
          "Calculez votre seuil de rentabilité et votre point mort de trésorerie pour chaque atelier de production.",
          "Souscrivez à une assurance récolte multirisque climatique si ce n'est pas encore le cas.",
        ],
        mid: [
          "Mettez en place un suivi mensuel de trésorerie prévisionnelle à 12 mois pour anticiper les tensions.",
          "Consultez votre Chambre d'Agriculture pour un audit complet de vos droits aux aides PAC et extra-PAC.",
          "Diversifiez vos instruments de gestion du risque prix (contrats à terme, vente échelonnée).",
        ],
        high: [
          "Optimisez votre fiscalité agricole avec un expert-comptable spécialisé (DPA, DEP, régimes d'imposition).",
          "Mettez en place une comptabilité analytique par atelier pour piloter finement votre rentabilité.",
          "Étudiez les opportunités d'investissement à fort retour sur investissement (irrigation, stockage, digital farming).",
        ],
      },
    },
    {
      id: "marche",
      name: "Marchés & Commercialisation",
      questions: [
        {
          id: "agri_marche_1",
          text: "Commercialisez-vous votre production via au moins 2 canaux distincts (coopérative + négoce, vente directe + GMS, export, circuits courts) ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Oui, 3 canaux ou plus avec répartition intentionnelle des volumes" },
            { value: 2, shortLabel: "Partiellement", label: "Partiellement, 2 canaux mais sans stratégie de répartition formalisée" },
            { value: 0, shortLabel: "Non", label: "Non, un seul débouché pour la quasi-totalité de notre production", recommendation: "Diversifiez vos débouchés en explorant au moins un canal complémentaire à votre débouché principal. Une dépendance à un unique acheteur expose votre exploitation aux variations de prix et aux risques de rupture de contrat." },
          ],
        },
        {
          id: "agri_marche_2",
          text: "Êtes-vous en mesure de négocier vos prix de vente ou avez-vous un contrat sécurisant un prix plancher sur au moins une partie de votre production ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Oui, contrats avec prix garantis ou participation active à des négociations collectives" },
            { value: 2, shortLabel: "Partiellement", label: "Partiellement, quelques contrats mais la majorité est vendue au cours du marché" },
            { value: 0, shortLabel: "Non", label: "Non, nous vendons exclusivement au cours du marché sans protection de prix", recommendation: "Explorez les contrats à prix fixe ou formule avec votre coopérative ou un négociant. Rejoindre une organisation de producteurs (OP) renforce votre pouvoir de négociation et vous donne accès à des outils de gestion des risques prix." },
          ],
        },
        {
          id: "agri_marche_3",
          text: "Êtes-vous engagé dans une démarche qualité ou une certification valorisant votre production (Label Rouge, AB, HVE, AOP/IGP, filières différenciées) ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Oui, certifié et prime de qualité effective sur le prix de vente" },
            { value: 2, shortLabel: "Partiellement", label: "Partiellement, démarche engagée ou en cours de certification" },
            { value: 0, shortLabel: "Non", label: "Non, production standard sans différenciation qualitative", recommendation: "Évaluez la rentabilité d'une conversion vers une production différenciée (AB, HVE, Label Rouge) en comparant le coût de la certification avec la prime de prix attendue et les aides à la conversion disponibles." },
          ],
        },
        {
          id: "agri_marche_4",
          text: "Avez-vous une connaissance précise des tendances de marché pour vos productions (évolution de la demande, nouveaux débouchés, pressions concurrentielles) ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Oui, veille régulière avec sources identifiées (FranceAgriMer, interprofessions, presse spécialisée)" },
            { value: 2, shortLabel: "Partiellement", label: "Partiellement, quelques informations collectées mais sans démarche structurée" },
            { value: 0, shortLabel: "Non", label: "Non, nous avons peu de visibilité sur l'évolution de nos marchés", recommendation: "Abonnez-vous aux publications de FranceAgriMer et de votre interprofession. Participez aux journées techniques et salons de votre filière. Une bonne intelligence de marché est indispensable pour anticiper les évolutions et saisir les opportunités." },
          ],
        },
        {
          id: "agri_marche_5",
          text: "Si vous pratiquez la vente directe ou les circuits courts, avez-vous développé des outils de communication (site web, réseaux sociaux, marque d'exploitation) pour fidéliser vos clients ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Oui, présence digitale active avec clientèle fidélisée et croissante" },
            { value: 2, shortLabel: "Partiellement", label: "Partiellement, quelques outils en place mais communication irrégulière" },
            { value: 0, shortLabel: "Non", label: "Non applicable (pas de vente directe) ou aucun outil de communication", recommendation: "Si vous pratiquez la vente directe, créez a minima une page Facebook/Instagram et un compte Google Business. Pour les exploitations 100 % en filière longue, concentrez-vous sur votre positionnement au sein de votre coopérative ou OP pour accéder aux meilleures grilles tarifaires." },
          ],
        },
      ],
      recommendationPool: {
        low: [
          "Réalisez un diagnostic commercial avec votre coopérative ou votre Chambre d'Agriculture pour identifier vos canaux de valorisation non exploités.",
          "Rejoignez une organisation de producteurs de votre filière pour renforcer votre pouvoir de négociation.",
          "Évaluez la faisabilité d'une démarche de certification qualité (HVE, AB) adaptée à votre exploitation.",
        ],
        mid: [
          "Formalisez une stratégie commerciale écrite avec vos objectifs de volumes, prix cibles et canaux prioritaires.",
          "Contractualisez au moins 30 % de votre production sur des prix sécurisés avant la campagne.",
          "Développez votre veille de marché en vous abonnant aux publications de votre interprofession.",
        ],
        high: [
          "Envisagez la création d'une marque d'exploitation ou l'adhésion à une marque collective pour valoriser votre production.",
          "Explorez les marchés export via votre coopérative ou Business France pour vos productions différenciées.",
          "Mettez en place une stratégie omnicanale combinant filière longue, circuits courts et vente directe pour maximiser votre valeur ajoutée.",
        ],
      },
    },
    {
      id: "production",
      name: "Production & Durabilité",
      questions: [
        {
          id: "agri_production_1",
          text: "Vos rendements et performances zootechniques sont-ils stables ou en progression sur les 3 dernières campagnes, et conformes aux références de votre territoire ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Oui, au-dessus de la médiane régionale sur les 3 dernières campagnes" },
            { value: 2, shortLabel: "Partiellement", label: "Partiellement, performances dans la moyenne mais avec une variabilité importante" },
            { value: 0, shortLabel: "Non", label: "Non, nos performances sont en dessous des références locales", recommendation: "Engagez un diagnostic agronomique ou zootechnique avec un technicien pour identifier les causes de sous-performance. Des leviers comme l'amélioration variétale, la gestion de la fertilisation ou l'optimisation de l'alimentation animale permettent souvent des gains rapides." },
          ],
        },
        {
          id: "agri_production_2",
          text: "Avez-vous intégré des pratiques agro-écologiques dans votre système de production (couverture des sols, rotation longue, réduction des intrants chimiques, agroforesterie) ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Oui, plusieurs pratiques agro-écologiques déployées avec suivi de leur impact" },
            { value: 2, shortLabel: "Partiellement", label: "Partiellement, quelques pratiques adoptées mais le système reste conventionnel" },
            { value: 0, shortLabel: "Non", label: "Non, notre système de production est entièrement conventionnel sans démarche environnementale", recommendation: "Commencez par les pratiques à faible coût et fort impact : couverts végétaux inter-cultures, allongement des rotations, réduction des passages en IFT. Ces pratiques réduisent vos intrants tout en améliorant la résilience de votre exploitation." },
          ],
        },
        {
          id: "agri_production_3",
          text: "Votre parc matériel est-il adapté à vos surfaces et productions, entretenu selon un plan de maintenance préventive, et son renouvellement est-il planifié financièrement ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Oui, plan de maintenance à jour et plan de renouvellement intégré dans le plan de financement" },
            { value: 2, shortLabel: "Partiellement", label: "Partiellement, matériel globalement adapté mais maintenance et renouvellement peu planifiés" },
            { value: 0, shortLabel: "Non", label: "Non, notre matériel est vieillissant et sa gestion est réactive", recommendation: "Réalisez un inventaire de votre parc matériel avec estimation des valeurs de remplacement. Étudiez l'opportunité du machinisme en CUMA pour réduire le coût horaire. Planifiez financièrement les investissements majeurs à horizon 5 ans." },
          ],
        },
        {
          id: "agri_production_4",
          text: "Maîtrisez-vous précisément vos consommations d'intrants (eau, engrais, produits phytosanitaires, énergie, aliments) et mettez-vous en œuvre des actions de réduction ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Oui, suivi quantitatif annuel avec plan d'action de réduction des intrants" },
            { value: 2, shortLabel: "Partiellement", label: "Partiellement, suivi partiel sans plan d'optimisation formalisé" },
            { value: 0, shortLabel: "Non", label: "Non, pas de suivi structuré des consommations", recommendation: "Mettez en place un tableau de suivi des consommations par intrant et par surface/unité produite. Les outils de modulation de la fertilisation (analyse de sols, agriculture de précision) permettent des économies de 10 à 20 % sur les intrants fertilisants." },
          ],
        },
        {
          id: "agri_production_5",
          text: "Avez-vous évalué votre empreinte carbone et engagé des actions de réduction dans le cadre d'un diagnostic Bilan Carbone® Agri ou équivalent ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Oui, bilan réalisé avec plan d'action carbone déployé" },
            { value: 2, shortLabel: "Partiellement", label: "Partiellement, sensibilité aux enjeux carbone mais aucun bilan formalisé" },
            { value: 0, shortLabel: "Non", label: "Non, la question carbone n'est pas encore traitée dans notre exploitation", recommendation: "Réalisez un CAP'2ER (élevage) ou un Bilan Carbone® Agri. Au-delà de l'obligation réglementaire croissante, cet outil identifie les actions de réduction d'émissions qui sont souvent également des sources d'économies (fertilisation raisonnée, méthanisation, stockage C dans les sols)." },
          ],
        },
      ],
      recommendationPool: {
        low: [
          "Faites réaliser un diagnostic agronomique ou zootechnique pour identifier vos marges de progrès techniques.",
          "Commencez par des pratiques agro-écologiques simples : couverts végétaux, allongement des rotations.",
          "Réalisez un inventaire et un plan de maintenance de votre parc matériel.",
        ],
        mid: [
          "Mettez en place un suivi annuel de vos indicateurs de durabilité (IFT, bilan fertilisation, consommation eau/énergie).",
          "Étudiez les opportunités de l'agriculture de précision pour réduire vos intrants et améliorer vos rendements.",
          "Rejoignez un groupe DEPHY ou un collectif d'agriculteurs engagés dans la transition agro-écologique.",
        ],
        high: [
          "Réalisez un Bilan Carbone® Agri et mettez en place un plan d'action carbone chiffré.",
          "Explorez les opportunités de diversification durable : méthanisation, agroforesterie, production d'énergie renouvelable.",
          "Engagez-vous dans une démarche de certification environnementale (HVE niveau 3, AB) pour valoriser vos pratiques.",
        ],
      },
    },
    {
      id: "organisation",
      name: "Organisation & Capital Humain",
      questions: [
        {
          id: "agri_organisation_1",
          text: "Les rôles et responsabilités entre associés, salariés et prestataires sont-ils clairement définis et documentés au sein de votre exploitation ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Oui, fiches de poste, pacte d'associés et règles de gouvernance formalisés" },
            { value: 2, shortLabel: "Partiellement", label: "Partiellement, organisation orale comprise de tous mais peu écrite" },
            { value: 0, shortLabel: "Non", label: "Non, les responsabilités sont floues et source de tensions", recommendation: "Rédigez des fiches de poste simples pour chaque salarié et formalisez les règles de gouvernance entre associés (statuts, pacte). L'ambiguïté des rôles est une cause majeure de conflits et de pertes d'efficacité dans les exploitations collectives." },
          ],
        },
        {
          id: "agri_organisation_2",
          text: "Vos salariés agricoles bénéficient-ils d'un plan de formation régulier (certiphyto, conduite d'engins, nouvelles pratiques agronomiques) et d'entretiens annuels ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Oui, plan de formation annuel avec entretiens individuels systématiques" },
            { value: 2, shortLabel: "Partiellement", label: "Partiellement, formations réalisées mais sans plan structuré" },
            { value: 0, shortLabel: "Non", label: "Non, peu ou pas de formations organisées pour les salariés", recommendation: "Mettez en place un entretien annuel simple pour chaque salarié et un plan de formation a minima sur les obligations légales (certiphyto, CACES). Utilisez les dispositifs VIVEA (exploitants) et OCAPIAT (salariés) pour financer les formations." },
          ],
        },
        {
          id: "agri_organisation_3",
          text: "Avez-vous mis en place des mesures pour prévenir les risques professionnels (accidents du travail, troubles musculosquelettiques, risques psychosociaux liés à l'isolement) ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Oui, document unique à jour et actions de prévention déployées" },
            { value: 2, shortLabel: "Partiellement", label: "Partiellement, document unique réalisé mais peu suivi au quotidien" },
            { value: 0, shortLabel: "Non", label: "Non, pas de démarche formalisée de prévention des risques", recommendation: "Rédigez ou mettez à jour votre Document Unique d'Évaluation des Risques Professionnels (DUERP), obligatoire pour tout employeur. Contactez la MSA pour bénéficier d'un accompagnement gratuit en prévention des risques agricoles." },
          ],
        },
        {
          id: "agri_organisation_4",
          text: "Disposez-vous d'une organisation documentée (cahiers de plaine, fiches d'élevage, procédures de traite/récolte) permettant à un remplaçant de gérer l'exploitation en cas d'absence ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Oui, procédures écrites et testées avec un remplacement effectif déjà réalisé" },
            { value: 2, shortLabel: "Partiellement", label: "Partiellement, quelques informations écrites mais organisation peu formalisée" },
            { value: 0, shortLabel: "Non", label: "Non, l'exploitation dépend entièrement de ma présence", recommendation: "Adhérez à un service de remplacement agricole et rédigez un carnet de bord minimum de votre exploitation. Une absence imprévue (maladie, accident) ne doit pas mettre en péril votre production. La cotisation au service de remplacement est déductible et bien inférieure au coût d'une absence non couverte." },
          ],
        },
        {
          id: "agri_organisation_5",
          text: "Utilisez-vous des outils numériques agricoles (logiciel de gestion, capteurs connectés, télégestion, agriculture de précision) pour optimiser votre organisation ?",
          options: [
            { value: 4, shortLabel: "Oui", label: "Oui, plusieurs outils numériques intégrés dans les pratiques quotidiennes" },
            { value: 2, shortLabel: "Partiellement", label: "Partiellement, quelques outils utilisés mais sans intégration globale" },
            { value: 0, shortLabel: "Non", label: "Non, gestion entièrement manuelle et peu informatisée", recommendation: "Commencez par un logiciel de gestion agricole (type Smag, Isagri) pour centraliser vos données de production, vos coûts et votre facturation. Le numérique agricole réduit le temps administratif et améliore la précision des décisions." },
          ],
        },
      ],
      recommendationPool: {
        low: [
          "Adhérez à un service de remplacement agricole et formalisez les procédures de base de votre exploitation.",
          "Mettez à jour votre Document Unique d'Évaluation des Risques Professionnels avec l'aide de la MSA.",
          "Réalisez les entretiens annuels de vos salariés et identifiez leurs besoins en formation.",
        ],
        mid: [
          "Formalisez les rôles et responsabilités de chaque membre de l'exploitation avec des fiches de poste.",
          "Mettez en place un plan de formation annuel en mobilisant les financements VIVEA et OCAPIAT.",
          "Adoptez un logiciel de gestion agricole pour centraliser vos données et réduire le temps administratif.",
        ],
        high: [
          "Déployez une stratégie d'agriculture de précision adaptée à vos surfaces et productions.",
          "Formalisez votre gouvernance d'exploitation avec un pacte d'associés et des comptes rendus de réunion.",
          "Développez un plan de développement des compétences à 3 ans aligné sur votre stratégie d'exploitation.",
        ],
      },
    },
  ],
};

const en = {
  pillars: [
    {
      id: "pilotage",
      name: "Farm Management",
      questions: [
        {
          id: "agri_pilotage_1",
          text: "Do you have a formalised strategic plan for your farm (3-5 year objectives, succession plan, production directions)?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Yes, documented and reviewed regularly" },
            { value: 2, shortLabel: "Partially", label: "Partially, some directions defined but not formalised" },
            { value: 0, shortLabel: "No", label: "No, we manage day-to-day without a multi-year vision", recommendation: "Formalise a 3-year strategic plan including your production targets, land objectives and a succession plan. Even a single page is enough to clarify your direction." },
          ],
        },
        {
          id: "agri_pilotage_2",
          text: "Do you track key performance indicators (yields per crop/livestock, gross margin per hectare, stocking rate) on an annual basis?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Yes, up-to-date dashboard with year-on-year comparison" },
            { value: 2, shortLabel: "Partially", label: "Partially, some indicators tracked but without a structured tool" },
            { value: 0, shortLabel: "No", label: "No, no formalised performance monitoring", recommendation: "Set up a simple dashboard (Excel or farm management software) with at minimum yield per crop, gross margin/ha and cost of production to identify your profitability levers." },
          ],
        },
        {
          id: "agri_pilotage_3",
          text: "Are you up to date with your regulatory obligations (CAP conditionality, environmental standards, animal welfare where applicable)?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Yes, compliance ensured and audits passed without major reservations" },
            { value: 2, shortLabel: "Partially", label: "Partially, some non-conformity points identified and being corrected" },
            { value: 0, shortLabel: "No", label: "No, we have unresolved regulatory gaps", recommendation: "Carry out a compliance audit with your agricultural advisor. CAP non-conformities expose you to penalties on your direct payments. Prioritise points with immediate financial impact." },
          ],
        },
        {
          id: "agri_pilotage_4",
          text: "Do you participate in professional networks (cooperative, employer groups, CUMA, development groups) to share practices and benchmark?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Yes, active member of at least 2 structures with regular exchanges" },
            { value: 2, shortLabel: "Partially", label: "Partially, formal membership but limited participation" },
            { value: 0, shortLabel: "No", label: "No, we work independently", recommendation: "Join a local agricultural development group or CUMA. Peer benchmarking is the most direct way to identify best practices and reduce your costs." },
          ],
        },
        {
          id: "agri_pilotage_5",
          text: "Do you have a clear vision for the transfer or capital evolution of your farm within 10 years (sale, bringing in a partner, forming a company)?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Yes, scenarios defined and legal/tax support underway" },
            { value: 2, shortLabel: "Partially", label: "Partially, reflection begun but no formalised decision" },
            { value: 0, shortLabel: "No", label: "No, the question has not yet been addressed", recommendation: "Consult a specialist in farm succession (Chamber of Agriculture, notary). Preparing 5 to 10 years before the transfer optimises the takeover value and reduces taxation." },
          ],
        },
      ],
      recommendationPool: {
        low: [
          "Work with your Chamber of Agriculture to carry out a comprehensive farm diagnostic and define your priority areas.",
          "Set up a monthly dashboard with 5 key indicators: yield, gross margin/ha, cash flow, debt and stocking rate.",
          "Join an agricultural development group to access local technical and economic benchmarks.",
        ],
        mid: [
          "Formalise your strategic plan by defining 3 measurable objectives for the next 3 years.",
          "Schedule an annual regulatory compliance audit before CAP inspections.",
          "Consider the optimal legal structure for your farm (partnership, limited company).",
        ],
        high: [
          "Implement formal governance with quarterly management reports if you operate as a company.",
          "Develop a forward-looking dashboard incorporating climate and market scenarios to strengthen resilience.",
          "Initiate estate transfer planning with an agricultural wealth management advisor.",
        ],
      },
    },
    {
      id: "finance",
      name: "Financial Health",
      questions: [
        {
          id: "agri_finance_1",
          text: "Does your farm regularly generate sufficient gross operating surplus (EBE) to cover your loan repayments and private drawings?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Yes, coverage ratio above 130% on average over 3 years" },
            { value: 2, shortLabel: "Partially", label: "Partially, coverage assured but with little margin in bad years" },
            { value: 0, shortLabel: "No", label: "No, some years do not allow us to cover fixed costs", recommendation: "Analyse your cash flow break-even with your accountant. Identify compressible costs and negotiate loan rescheduling if under pressure. Build a precautionary reserve equivalent to 3 months of fixed costs." },
          ],
        },
        {
          id: "agri_finance_2",
          text: "Do you know precisely your unit cost of production per crop or per litre/kg produced, and do you compare it with market prices?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Yes, calculated annually and integrated into my sales decisions" },
            { value: 2, shortLabel: "Partially", label: "Partially, overall estimate but without detailed breakdown per workshop" },
            { value: 0, shortLabel: "No", label: "No, I do not know my precise cost of production", recommendation: "Calculate your cost of production per crop. Without this benchmark, you cannot assess the viability of your production choices or negotiate your selling prices from an informed position." },
          ],
        },
        {
          id: "agri_finance_3",
          text: "Is your debt ratio (total debt / total assets) below 50% and your repayment capacity managed (annuities < 30% of EBE)?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Yes, healthy financial ratios monitored by my accountant" },
            { value: 2, shortLabel: "Partially", label: "Partially, one ratio is tight but the situation is managed" },
            { value: 0, shortLabel: "No", label: "No, our debt is high and repayments weigh on our cash flow", recommendation: "Meet your banker and accountant to restructure your debt. Explore smoothing tools (subsidised loans, guarantee funds). Excessive debt is the primary fragility factor for farms." },
          ],
        },
        {
          id: "agri_finance_4",
          text: "Do you optimise your access to public support (CAP, agri-environment schemes, regional investment aid, training tax credits) and systematically claim them?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Yes, active monitoring with an advisor and applications submitted on time" },
            { value: 2, shortLabel: "Partially", label: "Partially, basic aid claimed but some schemes are missed" },
            { value: 0, shortLabel: "No", label: "No, we do not track all available schemes", recommendation: "Ask your Chamber of Agriculture for an audit of your aid entitlements. For a 10+ ha farm, agri-environment schemes, investment aid and installation/transfer support often represent several thousand euros unclaimed." },
          ],
        },
        {
          id: "agri_finance_5",
          text: "Do you have an economic risk management plan (crop insurance, precautionary savings, income diversification, price hedging tools)?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Yes, several tools combined and reviewed annually" },
            { value: 2, shortLabel: "Partially", label: "Partially, insurance taken out but overall strategy little formalised" },
            { value: 0, shortLabel: "No", label: "No, we have no risk coverage instruments", recommendation: "Combine at minimum multi-risk climate crop insurance, precautionary savings and diversification of your outlets. Combining several tools significantly reduces income volatility." },
          ],
        },
      ],
      recommendationPool: {
        low: [
          "Carry out a comprehensive financial diagnostic with your management centre to identify profitability improvement levers.",
          "Calculate your break-even point and cash flow threshold for each production workshop.",
          "Take out multi-risk climate crop insurance if not already done.",
        ],
        mid: [
          "Set up a 12-month rolling cash flow forecast to anticipate tensions.",
          "Consult your Chamber of Agriculture for a full audit of your CAP and non-CAP aid entitlements.",
          "Diversify your price risk management instruments (forward contracts, staggered sales).",
        ],
        high: [
          "Optimise your agricultural tax position with a specialist accountant.",
          "Set up analytical accounting by workshop to manage profitability precisely.",
          "Study high-return investment opportunities (irrigation, storage, digital farming).",
        ],
      },
    },
    {
      id: "marche",
      name: "Markets & Sales",
      questions: [
        {
          id: "agri_marche_1",
          text: "Do you sell your production through at least 2 distinct channels (cooperative + trade, direct sales + retail, export, short supply chains)?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Yes, 3 or more channels with intentional volume allocation" },
            { value: 2, shortLabel: "Partially", label: "Partially, 2 channels but without a formalised allocation strategy" },
            { value: 0, shortLabel: "No", label: "No, a single outlet for almost all of our production", recommendation: "Diversify your outlets by exploring at least one additional channel alongside your primary one. Dependence on a single buyer exposes your farm to price fluctuations and contract termination risks." },
          ],
        },
        {
          id: "agri_marche_2",
          text: "Are you able to negotiate your selling prices or do you have a contract securing a floor price on at least part of your production?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Yes, contracts with guaranteed prices or active participation in collective negotiations" },
            { value: 2, shortLabel: "Partially", label: "Partially, some contracts but the majority sold at market price" },
            { value: 0, shortLabel: "No", label: "No, we sell exclusively at market prices with no price protection", recommendation: "Explore fixed-price or formula contracts with your cooperative or a trader. Joining a producer organisation (PO) strengthens your negotiating power and gives access to price risk management tools." },
          ],
        },
        {
          id: "agri_marche_3",
          text: "Are you involved in a quality approach or certification that adds value to your production (organic, high environmental value, protected designation, differentiated supply chains)?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Yes, certified with an effective quality premium on the selling price" },
            { value: 2, shortLabel: "Partially", label: "Partially, approach underway or certification in progress" },
            { value: 0, shortLabel: "No", label: "No, standard production with no qualitative differentiation", recommendation: "Assess the profitability of converting to a differentiated production by comparing certification costs with the expected price premium and available conversion aids." },
          ],
        },
        {
          id: "agri_marche_4",
          text: "Do you have a precise knowledge of market trends for your products (demand evolution, new outlets, competitive pressures)?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Yes, regular monitoring with identified sources (market authorities, sector bodies, trade press)" },
            { value: 2, shortLabel: "Partially", label: "Partially, some information collected but no structured approach" },
            { value: 0, shortLabel: "No", label: "No, we have little visibility on how our markets are evolving", recommendation: "Subscribe to publications from your sector's inter-professional organisation. Attend technical events and trade fairs in your sector. Good market intelligence is essential to anticipate changes and seize opportunities." },
          ],
        },
        {
          id: "agri_marche_5",
          text: "If you practise direct sales or short supply chains, have you developed communication tools (website, social media, farm brand) to build customer loyalty?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Yes, active digital presence with growing loyal customer base" },
            { value: 2, shortLabel: "Partially", label: "Partially, some tools in place but irregular communication" },
            { value: 0, shortLabel: "No", label: "Not applicable (no direct sales) or no communication tools", recommendation: "If you practise direct sales, create at minimum a Facebook/Instagram page and a Google Business profile. For farms in long supply chains, focus on your positioning within your cooperative to access the best price grids." },
          ],
        },
      ],
      recommendationPool: {
        low: [
          "Carry out a commercial diagnostic with your cooperative or Chamber of Agriculture to identify untapped value channels.",
          "Join a producer organisation in your sector to strengthen your negotiating power.",
          "Assess the feasibility of a quality certification (organic, high environmental value) suited to your farm.",
        ],
        mid: [
          "Formalise a written commercial strategy with your volume targets, price objectives and priority channels.",
          "Contract at least 30% of your production at secured prices before the campaign.",
          "Develop your market intelligence by subscribing to your inter-professional body's publications.",
        ],
        high: [
          "Consider creating a farm brand or joining a collective brand to add value to your production.",
          "Explore export markets through your cooperative or trade promotion bodies for your differentiated products.",
          "Implement an omnichannel strategy combining long supply chains, short circuits and direct sales to maximise added value.",
        ],
      },
    },
    {
      id: "production",
      name: "Production & Sustainability",
      questions: [
        {
          id: "agri_production_1",
          text: "Are your yields and zootechnical performance stable or improving over the last 3 campaigns, and in line with your regional benchmarks?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Yes, above the regional median over the last 3 campaigns" },
            { value: 2, shortLabel: "Partially", label: "Partially, performance within average but with significant variability" },
            { value: 0, shortLabel: "No", label: "No, our performance is below local benchmarks", recommendation: "Commission an agronomic or zootechnical diagnostic with a technician to identify the causes of underperformance. Levers such as varietal improvement, fertilisation management or animal feed optimisation often deliver quick gains." },
          ],
        },
        {
          id: "agri_production_2",
          text: "Have you integrated agro-ecological practices into your production system (soil cover, long rotations, reduction of chemical inputs, agroforestry)?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Yes, several agro-ecological practices deployed with impact monitoring" },
            { value: 2, shortLabel: "Partially", label: "Partially, some practices adopted but the system remains conventional" },
            { value: 0, shortLabel: "No", label: "No, our production system is entirely conventional with no environmental approach", recommendation: "Start with low-cost, high-impact practices: inter-crop cover crops, longer rotations, reducing treatment frequency. These practices reduce input costs while improving farm resilience." },
          ],
        },
        {
          id: "agri_production_3",
          text: "Is your machinery fleet suited to your land and production, maintained according to a preventive maintenance plan, and is its renewal financially planned?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Yes, maintenance plan up to date and renewal plan integrated into the financial plan" },
            { value: 2, shortLabel: "Partially", label: "Partially, machinery broadly adequate but maintenance and renewal poorly planned" },
            { value: 0, shortLabel: "No", label: "No, our machinery is ageing and its management is reactive", recommendation: "Carry out a machinery inventory with replacement value estimates. Study the opportunity of shared machinery through a CUMA to reduce hourly costs. Plan major investments financially over a 5-year horizon." },
          ],
        },
        {
          id: "agri_production_4",
          text: "Do you precisely monitor your input consumption (water, fertilisers, pesticides, energy, feed) and implement reduction actions?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Yes, annual quantitative monitoring with an input reduction action plan" },
            { value: 2, shortLabel: "Partially", label: "Partially, partial monitoring without a formalised optimisation plan" },
            { value: 0, shortLabel: "No", label: "No, no structured monitoring of consumption", recommendation: "Set up a consumption tracking table by input and per surface/unit produced. Precision fertilisation tools (soil analysis, precision agriculture) can achieve savings of 10 to 20% on fertiliser inputs." },
          ],
        },
        {
          id: "agri_production_5",
          text: "Have you assessed your carbon footprint and taken reduction actions as part of a Carbon Balance® Agri or equivalent diagnostic?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Yes, balance completed with a carbon action plan deployed" },
            { value: 2, shortLabel: "Partially", label: "Partially, awareness of carbon issues but no formalised balance" },
            { value: 0, shortLabel: "No", label: "No, the carbon question has not yet been addressed on our farm", recommendation: "Carry out a Carbon Balance® Agri or equivalent. Beyond growing regulatory requirements, this tool identifies emission reduction actions that are often also cost savings (reasoned fertilisation, anaerobic digestion, soil carbon storage)." },
          ],
        },
      ],
      recommendationPool: {
        low: [
          "Commission an agronomic or zootechnical diagnostic to identify your technical improvement margins.",
          "Start with simple agro-ecological practices: cover crops, longer rotations.",
          "Carry out an inventory and maintenance plan for your machinery fleet.",
        ],
        mid: [
          "Set up an annual sustainability indicator monitoring (treatment frequency, fertilisation balance, water/energy consumption).",
          "Explore precision agriculture opportunities to reduce inputs and improve yields.",
          "Join a low-input network or farmer collective engaged in agro-ecological transition.",
        ],
        high: [
          "Carry out a Carbon Balance® Agri and implement a quantified carbon action plan.",
          "Explore sustainable diversification opportunities: anaerobic digestion, agroforestry, renewable energy production.",
          "Engage in environmental certification (organic, high environmental value) to recognise your practices.",
        ],
      },
    },
    {
      id: "organisation",
      name: "Organisation & Human Capital",
      questions: [
        {
          id: "agri_organisation_1",
          text: "Are roles and responsibilities between partners, employees and contractors clearly defined and documented within your farm?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Yes, job descriptions, partnership agreement and governance rules formalised" },
            { value: 2, shortLabel: "Partially", label: "Partially, oral organisation understood by all but little written down" },
            { value: 0, shortLabel: "No", label: "No, responsibilities are unclear and a source of tension", recommendation: "Write simple job descriptions for each employee and formalise governance rules between partners (articles of association, partnership agreement). Role ambiguity is a major cause of conflict and efficiency losses in collective farms." },
          ],
        },
        {
          id: "agri_organisation_2",
          text: "Do your agricultural employees benefit from regular training (pesticide handling certificates, machinery operation, new agronomic practices) and annual reviews?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Yes, annual training plan with systematic individual reviews" },
            { value: 2, shortLabel: "Partially", label: "Partially, training carried out but without a structured plan" },
            { value: 0, shortLabel: "No", label: "No, little or no training organised for employees", recommendation: "Set up a simple annual review for each employee and a training plan covering at minimum legal obligations. Use training fund schemes to finance employee training." },
          ],
        },
        {
          id: "agri_organisation_3",
          text: "Have you implemented measures to prevent occupational risks (work accidents, musculoskeletal disorders, psychosocial risks linked to isolation)?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Yes, risk assessment document up to date and prevention actions deployed" },
            { value: 2, shortLabel: "Partially", label: "Partially, risk assessment document completed but little followed in practice" },
            { value: 0, shortLabel: "No", label: "No, no formalised risk prevention approach", recommendation: "Draw up or update your Occupational Risk Assessment Document (DUERP), mandatory for all employers. Contact your agricultural social insurer for free support in agricultural risk prevention." },
          ],
        },
        {
          id: "agri_organisation_4",
          text: "Do you have a documented organisation (field notebooks, livestock records, harvesting/milking procedures) allowing a replacement to manage the farm in your absence?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Yes, written procedures tested with a replacement already successfully carried out" },
            { value: 2, shortLabel: "Partially", label: "Partially, some information written but organisation little formalised" },
            { value: 0, shortLabel: "No", label: "No, the farm depends entirely on my presence", recommendation: "Join a farm replacement service and write a minimum operations notebook for your farm. An unplanned absence (illness, accident) must not jeopardise your production. The replacement service contribution is tax-deductible and far below the cost of an uncovered absence." },
          ],
        },
        {
          id: "agri_organisation_5",
          text: "Do you use agricultural digital tools (management software, connected sensors, remote monitoring, precision agriculture) to optimise your organisation?",
          options: [
            { value: 4, shortLabel: "Yes", label: "Yes, several digital tools integrated into daily practices" },
            { value: 2, shortLabel: "Partially", label: "Partially, some tools used but without overall integration" },
            { value: 0, shortLabel: "No", label: "No, entirely manual and little computerised management", recommendation: "Start with a farm management software to centralise your production data, costs and invoicing. Agricultural digital tools reduce administrative time and improve the accuracy of decisions." },
          ],
        },
      ],
      recommendationPool: {
        low: [
          "Join a farm replacement service and formalise the basic procedures of your farm.",
          "Update your Occupational Risk Assessment Document with the support of your agricultural social insurer.",
          "Carry out annual reviews with your employees and identify their training needs.",
        ],
        mid: [
          "Formalise the roles and responsibilities of each farm member with job descriptions.",
          "Set up an annual training plan mobilising available funding schemes.",
          "Adopt farm management software to centralise your data and reduce administrative time.",
        ],
        high: [
          "Deploy a precision agriculture strategy suited to your land and productions.",
          "Formalise your farm governance with a partnership agreement and meeting minutes.",
          "Develop a 3-year skills development plan aligned with your farm strategy.",
        ],
      },
    },
  ],
};

// Niveaux de maturité spécifiques agriculture
// "votre exploitation" remplace "votre entreprise" des niveaux universels
const levels = [
  {
    id: "critique",
    min: 0,
    max: 39,
    color: "#ef4444",
    label: { fr: "Exploitation Fragile", en: "Vulnerable Farm" },
    interpretation: {
      fr: "Votre exploitation présente des vulnérabilités structurelles importantes dans plusieurs piliers. Des actions correctrices urgentes sont nécessaires pour assurer sa pérennité. Concentrez-vous sur la stabilisation financière et la mise en conformité réglementaire en priorité.",
      en: "Your farm has significant structural vulnerabilities across several pillars. Urgent corrective actions are needed to ensure its sustainability. Focus on financial stabilisation and regulatory compliance as a priority.",
    },
  },
  {
    id: "vulnerable",
    min: 40,
    max: 59,
    color: "#f97316",
    label: { fr: "Exploitation en Développement", en: "Developing Farm" },
    interpretation: {
      fr: "Votre exploitation dispose de bases solides mais présente des fragilités dans certains domaines clés. Avec un accompagnement ciblé et des actions structurées, vous avez le potentiel pour améliorer significativement votre performance et votre résilience face aux aléas climatiques et économiques.",
      en: "Your farm has solid foundations but shows weaknesses in some key areas. With targeted support and structured actions, you have the potential to significantly improve your performance and resilience to climate and economic risks.",
    },
  },
  {
    id: "stable",
    min: 60,
    max: 79,
    color: "#eab308",
    label: { fr: "Exploitation Équilibrée", en: "Balanced Farm" },
    interpretation: {
      fr: "Votre exploitation est bien gérée et présente un bon équilibre entre les différents piliers. Vous disposez d'une base saine pour envisager des projets de développement. Quelques axes d'optimisation peuvent encore renforcer votre compétitivité et votre durabilité à long terme.",
      en: "Your farm is well-managed and shows a good balance across the different pillars. You have a sound base to consider development projects. A few optimisation areas can still strengthen your competitiveness and long-term sustainability.",
    },
  },
  {
    id: "pret",
    min: 80,
    max: 89,
    color: "#22c55e",
    label: { fr: "Exploitation Performante", en: "High-Performing Farm" },
    interpretation: {
      fr: "Votre exploitation affiche d'excellentes performances sur la grande majorité des piliers. Vous êtes en position de force pour saisir de nouvelles opportunités : diversification, agrandissement, conversion vers des filières à plus forte valeur ajoutée. Continuez à investir dans l'innovation et le développement des compétences.",
      en: "Your farm shows excellent performance across most pillars. You are in a strong position to seize new opportunities: diversification, expansion, conversion to higher value-added supply chains. Continue investing in innovation and skills development.",
    },
  },
  {
    id: "haute_performance",
    min: 90,
    max: 100,
    color: "#6366f1",
    label: { fr: "Exploitation d'Excellence", en: "Farm of Excellence" },
    interpretation: {
      fr: "Votre exploitation est un modèle de performance et de durabilité agricole. Vous maîtrisez l'ensemble des dimensions de la gestion agricole et êtes en mesure d'anticiper les évolutions de votre environnement. Votre exploitation peut servir de référence pour d'autres agriculteurs de votre territoire.",
      en: "Your farm is a model of agricultural performance and sustainability. You master all dimensions of farm management and are able to anticipate changes in your environment. Your farm can serve as a benchmark for other farmers in your area.",
    },
  },
];

module.exports = { fr, en, levels };
