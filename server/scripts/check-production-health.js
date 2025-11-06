#!/usr/bin/env node

/**
 * Script pour vérifier l'état du serveur backend en production
 * Usage: node scripts/check-production-health.js
 */

const axios = require('axios');

async function checkProductionHealth() {
  console.log('🔍 [HEALTH CHECK] Vérification de l\'état du serveur backend en production...\n');

  const productionUrl = 'https://ubb-enterprise-health-check.onrender.com';
  
  const endpoints = [
    { path: '/api/health', name: 'Health Check' },
    { path: '/api/test', name: 'Test Endpoint' },
    { path: '/api/admin/stats', name: 'Admin Stats' },
    { path: '/api/blogs', name: 'Blogs API' }
  ];

  const results = [];

  for (const endpoint of endpoints) {
    try {
      console.log(`📡 [HEALTH CHECK] Test de ${endpoint.name}...`);
      
      const response = await axios.get(`${productionUrl}${endpoint.path}`, {
        timeout: 10000,
        headers: {
          'User-Agent': 'vitalCHECK-Health-Check/1.0'
        }
      });

      results.push({
        endpoint: endpoint.name,
        url: `${productionUrl}${endpoint.path}`,
        status: '✅ Succès',
        statusCode: response.status,
        responseTime: response.headers['x-response-time'] || 'N/A',
        data: response.data ? 'Données reçues' : 'Pas de données'
      });

      console.log(`✅ [HEALTH CHECK] ${endpoint.name}: ${response.status} - ${response.statusText}`);

    } catch (error) {
      results.push({
        endpoint: endpoint.name,
        url: `${productionUrl}${endpoint.path}`,
        status: '❌ Échec',
        error: error.message,
        statusCode: error.response?.status || 'N/A',
        responseData: error.response?.data || 'N/A'
      });

      console.log(`❌ [HEALTH CHECK] ${endpoint.name}: ${error.message}`);
      
      if (error.response) {
        console.log(`   Status: ${error.response.status} - ${error.response.statusText}`);
        console.log(`   Data:`, error.response.data);
      }
    }
  }

  // Test CORS
  console.log('\n🌐 [HEALTH CHECK] Test CORS...');
  try {
    const corsResponse = await axios.options(`${productionUrl}/api/health`, {
      headers: {
        'Origin': 'https://www.checkmyenterprise.com',
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type,Authorization'
      }
    });

    console.log('✅ [HEALTH CHECK] CORS: Headers reçus');
    console.log('   Access-Control-Allow-Origin:', corsResponse.headers['access-control-allow-origin']);
    console.log('   Access-Control-Allow-Methods:', corsResponse.headers['access-control-allow-methods']);
    console.log('   Access-Control-Allow-Headers:', corsResponse.headers['access-control-allow-headers']);

  } catch (error) {
    console.log('❌ [HEALTH CHECK] CORS: Erreur', error.message);
  }

  // Résumé
  console.log('\n' + '='.repeat(60));
  console.log('📊 [HEALTH CHECK] RÉSUMÉ');
  console.log('='.repeat(60));

  const successCount = results.filter(r => r.status === '✅ Succès').length;
  const failureCount = results.filter(r => r.status === '❌ Échec').length;

  results.forEach((result, index) => {
    console.log(`${index + 1}. ${result.status} ${result.endpoint}`);
    console.log(`   URL: ${result.url}`);
    if (result.status === '✅ Succès') {
      console.log(`   Status Code: ${result.statusCode}`);
      console.log(`   Response Time: ${result.responseTime}`);
    } else {
      console.log(`   Erreur: ${result.error}`);
      console.log(`   Status Code: ${result.statusCode}`);
    }
    console.log('');
  });

  console.log('📈 [HEALTH CHECK] STATISTIQUES:');
  console.log(`   ✅ Succès: ${successCount}/${results.length}`);
  console.log(`   ❌ Échecs: ${failureCount}/${results.length}`);
  console.log(`   📊 Taux de réussite: ${Math.round((successCount / results.length) * 100)}%`);

  if (successCount === results.length) {
    console.log('\n🎉 [HEALTH CHECK] Tous les endpoints fonctionnent correctement !');
  } else {
    console.log('\n⚠️  [HEALTH CHECK] Certains endpoints ont des problèmes.');
    console.log('   Vérifiez les logs du serveur et la configuration.');
  }

  return { successCount, failureCount, total: results.length };
}

// Exécuter le test si appelé directement
if (require.main === module) {
  checkProductionHealth()
    .then((results) => {
      console.log('\n🏁 [HEALTH CHECK] Vérification terminée');
      process.exit(results.failureCount > 0 ? 1 : 0);
    })
    .catch((error) => {
      console.error('\n💥 [HEALTH CHECK] Erreur fatale:', error);
      process.exit(1);
    });
}

module.exports = { checkProductionHealth };
