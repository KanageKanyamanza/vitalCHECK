const axios = require('axios');

/**
 * Scheduler interne optionnel:
 * appelle périodiquement l'endpoint /api/newsletters/admin/send-scheduled
 * Désactivé par défaut: activer via ENABLE_NEWSLETTER_SCHEDULER=true
 */
function startNewsletterScheduler({ enabled = false, intervalMs = 60_000, logger = console } = {}) {
  if (!enabled) return null;

  const baseUrl =
    process.env.BACKEND_URL ||
    process.env.API_URL ||
    `http://localhost:${process.env.PORT || 5000}`;

  const adminToken = process.env.NEWSLETTER_SCHEDULER_ADMIN_TOKEN;

  if (!adminToken) {
    logger.error('❌ [NEWSLETTER SCHEDULER] NEWSLETTER_SCHEDULER_ADMIN_TOKEN manquant. Scheduler désactivé.');
    return null;
  }

  const endpoint = `${baseUrl.replace(/\/$/, '')}/api/newsletters/admin/send-scheduled`;

  logger.log(`⏱️  [NEWSLETTER SCHEDULER] Activé (intervalle: ${intervalMs}ms) -> ${endpoint}`);

  const tick = async () => {
    try {
      const res = await axios.post(
        endpoint,
        {},
        { headers: { Authorization: `Bearer ${adminToken}` }, timeout: 60_000 }
      );
      const processed = res?.data?.processed ?? 0;
      if (processed > 0) {
        logger.log(`✅ [NEWSLETTER SCHEDULER] Traitement OK: processed=${processed}`);
      }
    } catch (e) {
      logger.error('❌ [NEWSLETTER SCHEDULER] Erreur:', e?.response?.data || e?.message || e);
    }
  };

  // première exécution rapide
  setTimeout(tick, 5_000);
  const timer = setInterval(tick, intervalMs);
  return timer;
}

module.exports = { startNewsletterScheduler };

