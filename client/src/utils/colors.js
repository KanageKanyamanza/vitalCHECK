// Configuration centralisée des couleurs vitalCHECK
// Basée sur tailwind.config.js

export const colors = {
  // vitalCHECK Ubuntu Blue - Trust, knowledge, interconnectedness
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6', // Ubuntu Blue
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  
  // Earthy and Grounded Foundation - Rich browns, warm ochre
  secondary: {
    50: '#fef7ed',
    100: '#fdedd3',
    200: '#fbd7a5',
    300: '#f8b86d',
    400: '#f59332',
    500: '#d97706', // Warm ochre
    600: '#b45309',
    700: '#92400e',
    800: '#78350f',
    900: '#451a03',
  },
  
  // Vibrant African Accents - Bold yellows, oranges, reds
  accent: {
    50: '#fffdf7',
    100: '#fef9e7',
    200: '#fef2c7',
    300: '#fde68a',
    400: '#fcd34d',
    500: '#fbc350', // vitalCHECK Orange
    600: '#f59e0b',
    700: '#d97706',
    800: '#b45309',
    900: '#92400e',
  },
  
  // Deep greens - Growth, resilience, connection to land
  earth: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e', // Deep green
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  
  // Status colors
  success: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981', // Green
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
  },
  
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b', // Amber
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  
  danger: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444', // Red
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  
  // Gray scale
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  }
}

// Fonctions utilitaires pour les couleurs de statut
export const getStatusColor = (status) => {
  switch (status) {
    case 'green':
      return colors.earth[500] // #22c55e
    case 'amber':
      return colors.accent[500] // #fbc350
    case 'red':
      return colors.danger[500] // #ef4444
    default:
      return colors.gray[500] // #6b7280
  }
}

// Couleurs pour les graphiques
export const chartColors = {
  grid: colors.gray[200], // #e5e7eb
  text: colors.gray[500], // #6b7280
  background: colors.gray[50], // #f9fafb
}

// Couleurs pour les toasts
export const toastColors = {
  background: colors.gray[700], // #374151
  text: '#ffffff',
}

// Couleurs pour les patterns
export const patternColors = {
  primary: 'rgba(59, 130, 246, 0.1)', // primary-500 avec opacité
  accent: 'rgba(251, 195, 80, 0.1)', // accent-500 avec opacité
  earth: 'rgba(34, 197, 94, 0.05)', // earth-500 avec opacité
}

// Couleurs pour les gradients de texte
export const gradientTextColors = {
  primary: colors.primary[600], // #2563eb
  secondary: colors.secondary[600], // #b45309
  accent: colors.accent[600], // #f59e0b
}

// Classes CSS pour les gradients
export const gradientClasses = {
  text: 'bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent',
  background: 'bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500',
}

// Paliers de maturité du diagnostic simplifié "Niveau 1" (v2)
// Doit rester cohérent avec server/utils/scoringV2.js
export const LEVELS_V2 = [
  {
    id: 'critique',
    min: 0,
    max: 39,
    color: colors.danger[500], // #ef4444
    label: { fr: 'Critique', en: 'Critical' },
    interpretation: {
      fr: "Votre entreprise fait face à des risques importants qui menacent sa pérennité. Une action rapide est nécessaire pour stabiliser les fondations.",
      en: "Your business is facing significant risks that threaten its sustainability. Immediate action is needed to stabilize the foundations.",
    },
  },
  {
    id: 'vulnerable',
    min: 40,
    max: 59,
    color: colors.warning[500], // #f59e0b
    label: { fr: 'Vulnérable', en: 'Vulnerable' },
    interpretation: {
      fr: "Votre entreprise tient le coup mais repose sur des bases fragiles. Plusieurs axes nécessitent une attention prioritaire.",
      en: "Your business is holding on but is built on fragile foundations. Several areas require priority attention.",
    },
  },
  {
    id: 'stable',
    min: 60,
    max: 79,
    color: '#EAB308', // yellow-500
    label: { fr: 'Stable', en: 'Stable' },
    interpretation: {
      fr: "Votre entreprise a des bases solides. Quelques ajustements ciblés permettront de passer à la vitesse supérieure.",
      en: "Your business has solid foundations. A few targeted adjustments will help you move up a gear.",
    },
  },
  {
    id: 'pret',
    min: 80,
    max: 89,
    color: colors.primary[500], // #3b82f6
    label: { fr: 'Prêt pour la croissance', en: 'Growth-Ready' },
    interpretation: {
      fr: "Votre entreprise est bien structurée et prête à accélérer son développement avec une stratégie de croissance ambitieuse.",
      en: "Your business is well-structured and ready to accelerate its development with an ambitious growth strategy.",
    },
  },
  {
    id: 'haute_performance',
    min: 90,
    max: 100,
    color: colors.success[500], // #10b981
    label: { fr: 'Haute performance', en: 'High Performance' },
    interpretation: {
      fr: "Votre entreprise affiche une excellente maturité organisationnelle sur l'ensemble des piliers clés. Continuez sur cette lancée !",
      en: "Your business shows excellent organizational maturity across all key pillars. Keep up the great work!",
    },
  },
]

// Récupère le palier correspondant à un score 0-100
export const getLevelV2 = (score) =>
  LEVELS_V2.find((level) => score >= level.min && score <= level.max) || LEVELS_V2[0]

// Récupère un palier par son identifiant avec label et interprétation localisés
export const getLevelV2ById = (levelId, lang = 'fr') => {
  const level = LEVELS_V2.find((l) => l.id === levelId) || LEVELS_V2[0]
  return {
    ...level,
    label: level.label[lang] || level.label.fr,
    interpretation: level.interpretation[lang] || level.interpretation.fr,
  }
}
