// Recherche d'un utilisateur par adresse email.
//
// Jusqu'en novembre 2026, le diagnostic v2 enregistrait l'adresse « normalisée » par
// express-validator (réglages par défaut) : pour Gmail, points et « +étiquette » retirés
// (prenom.nom@gmail.com -> prenomnom@gmail.com). Les adresses sont désormais gardées telles
// quelles (minuscules) ; la recherche essaie aussi l'ancienne forme pour ces comptes.

const GMAIL_DOMAINS = ['gmail.com', 'googlemail.com'];

const normalizeEmailInput = (email) => String(email || '').trim().toLowerCase();

/** Ancienne forme d'une adresse Gmail (sans points ni +étiquette), ou null si identique ou non Gmail. */
const legacyGmailForm = (email) => {
  const [local, domain] = normalizeEmailInput(email).split('@');
  if (!local || !GMAIL_DOMAINS.includes(domain)) return null;
  const legacy = `${local.split('+')[0].replace(/\./g, '')}@gmail.com`;
  return legacy === `${local}@${domain}` ? null : legacy;
};

/**
 * Utilisateur correspondant à l'adresse : forme exacte d'abord, puis ancienne forme Gmail.
 * `filter` ajoute des conditions (ex. { hasAccount: true }), `select` des champs masqués (ex. '+password').
 */
const findUserByEmail = async (User, email, { filter = {}, select } = {}) => {
  const query = (address) => {
    const q = User.findOne({ ...filter, email: address });
    return select ? q.select(select) : q;
  };
  const exact = await query(normalizeEmailInput(email));
  if (exact) return exact;
  const legacy = legacyGmailForm(email);
  return legacy ? query(legacy) : null;
};

module.exports = { normalizeEmailInput, legacyGmailForm, findUserByEmail };
