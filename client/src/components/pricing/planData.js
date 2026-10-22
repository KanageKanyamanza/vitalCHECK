import { Store, Users, Building2, Briefcase, TrendingUp, Landmark, Sprout, Mail, MessageCircle, Phone } from 'lucide-react'

// Plans d'abonnement, dans l'ordre d'affichage. Les montants facturés restent dans
// config/paypal.js (PLAN_PRICES) ; les montants affichés dans pricing.plans.* (i18n).
export const PLAN_IDS = ['free', 'standard', 'premium']
export const POPULAR_PLAN = 'standard'

// Fonctionnalités par plan (libellés : pricing.features.<key>)
export const FEATURES = [
  { key: 'accessEvaluation', free: true, standard: true, premium: true },
  { key: 'globalScorePillars', free: true, standard: true, premium: true },
  { key: 'basicPdfReport', free: true, standard: true, premium: true },
  { key: 'personalizedRecommendations', free: false, standard: true, premium: true },
  { key: 'multipleEvaluations', free: false, standard: true, premium: true },
  { key: 'historyTracking', free: false, standard: true, premium: true },
  { key: 'dashboardAdvancedExport', free: false, standard: true, premium: true },
  { key: 'comparativeAnalysis', free: false, standard: false, premium: true },
  { key: 'expertConsultation', free: false, standard: false, premium: true },
  { key: 'evaluatedCompanyBadge', free: false, standard: false, premium: true },
  { key: 'multipleUsers', free: false, standard: false, premium: true },
]

// Canaux de support par plan (libellés : pricing.supportTypes / pricing.supportDescriptions)
export const SUPPORT = [
  { key: 'emailSupport', icon: Mail, free: true, standard: true, premium: true },
  { key: 'whatsappSupport', icon: MessageCircle, free: false, standard: true, premium: true },
  { key: 'phoneSupport', icon: Phone, free: false, standard: false, premium: true },
]

// Type d'entreprise -> plan recommandé (libellés : pricing.enterpriseTypes / enterpriseDescriptions)
export const ENTERPRISE_TYPES = [
  { key: 'tpePmeUnstructured', plan: 'free', icon: Store },
  { key: 'cooperativesIndividual', plan: 'free', icon: Users },
  { key: 'structuredPme', plan: 'standard', icon: Building2 },
  { key: 'accountingCoaches', plan: 'standard', icon: Briefcase },
  { key: 'growthExportPme', plan: 'premium', icon: TrendingUp },
  { key: 'financingEntrepreneurs', plan: 'premium', icon: Landmark },
  { key: 'incubationPrograms', plan: 'premium', icon: Sprout },
]

// Ce qu'un plan ajoute au plan précédent (pour les cartes : « Tout le plan X, plus : »)
export const featuresAddedBy = (planId) => {
  const index = PLAN_IDS.indexOf(planId)
  const previous = PLAN_IDS[index - 1]
  return FEATURES.filter((f) => f[planId] && (!previous || !f[previous])).map((f) => f.key)
}
