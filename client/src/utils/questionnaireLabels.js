// Libellés admin (FR) du questionnaire suivi — doit rester aligné avec SECTOR_QUESTIONNAIRES (server/routes/assessmentsV2.js)
const QUESTIONNAIRE_LABELS = {
  universal: 'Universel',
  agriculture: 'Agriculture',
  retail: 'Commerce de détail',
  restaurant: 'Restauration',
  construction: 'Construction & BTP',
  distribution: 'Distribution',
  export: 'Export',
  manufacturing: 'Industrie & Transformation',
};

export const getQuestionnaireLabel = (assessment) => {
  if (!assessment) return '—';
  if (assessment.version !== 'v2') return 'Ancien questionnaire (v1)';
  const type = assessment.questionnaireType || 'universal';
  return QUESTIONNAIRE_LABELS[type] || type;
};
