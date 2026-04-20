const emailSyncService = require('./emailSyncService');

/**
 * Scheduler pour la synchronisation périodique des e-mails (IMAP)
 * Déclenché toutes les X minutes si activé
 */
function startEmailSyncScheduler({ enabled = true, intervalMs = 300_000, logger = console } = {}) {
  if (!enabled) {
    logger.log('📩 [EMAIL SYNC SCHEDULER] Désactivé');
    return null;
  }

  logger.log(`📩 [EMAIL SYNC SCHEDULER] Activé (intervalle: ${intervalMs/60000} minutes)`);

  const tick = async () => {
    try {
      await emailSyncService.sync();
    } catch (e) {
      logger.error('❌ [EMAIL SYNC SCHEDULER] Erreur:', e.message);
    }
  };

  // Première exécution après 10 secondes pour ne pas ralentir le démarrage
  setTimeout(tick, 10_000);
  
  const timer = setInterval(tick, intervalMs);
  return timer;
}

module.exports = { startEmailSyncScheduler };
