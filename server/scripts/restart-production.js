#!/usr/bin/env node

/**
 * Script pour redémarrer le serveur backend en production
 * Usage: node scripts/restart-production.js
 * 
 * Ce script envoie une requête POST à Render pour redémarrer le service
 * Nécessite une variable d'environnement RENDER_API_KEY
 */

const axios = require('axios');

async function restartProductionServer() {
  console.log('🔄 [RESTART] Début du redémarrage du serveur backend en production...\n');

  const renderApiKey = process.env.RENDER_API_KEY;
  const serviceId = process.env.RENDER_SERVICE_ID || 'ubb-enterprise-health-check';

  if (!renderApiKey) {
    console.error('❌ [RESTART] Variable d\'environnement RENDER_API_KEY manquante');
    console.log('   Ajoutez RENDER_API_KEY dans votre fichier .env');
    process.exit(1);
  }

  try {
    console.log('📡 [RESTART] Envoi de la requête de redémarrage à Render...');
    
    const response = await axios.post(
      `https://api.render.com/v1/services/${serviceId}/deploys`,
      {
        clearCache: 'clear'
      },
      {
        headers: {
          'Authorization': `Bearer ${renderApiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    console.log('✅ [RESTART] Redémarrage initié avec succès !');
    console.log('📊 [RESTART] Détails du déploiement:', {
      deployId: response.data.deploy.id,
      status: response.data.deploy.status,
      createdAt: response.data.deploy.createdAt
    });

    console.log('\n⏳ [RESTART] Le serveur va redémarrer dans quelques minutes...');
    console.log('   Vous pouvez suivre le statut sur le dashboard Render');
    console.log('   URL: https://dashboard.render.com/web/' + serviceId);

  } catch (error) {
    console.error('❌ [RESTART] Erreur lors du redémarrage:', error.message);
    
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }

    console.log('\n🔧 [RESTART] Solutions alternatives:');
    console.log('   1. Redémarrez manuellement depuis le dashboard Render');
    console.log('   2. Vérifiez que RENDER_API_KEY est correct');
    console.log('   3. Vérifiez que RENDER_SERVICE_ID est correct');
    
    process.exit(1);
  }
}

// Exécuter le script si appelé directement
if (require.main === module) {
  restartProductionServer()
    .then(() => {
      console.log('\n🏁 [RESTART] Script terminé');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 [RESTART] Erreur fatale:', error);
      process.exit(1);
    });
}

module.exports = { restartProductionServer };
