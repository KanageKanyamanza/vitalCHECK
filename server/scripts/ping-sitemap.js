/**
 * Indexation via protocole IndexNow (moderne, 2023+)
 * Supporté par : Bing, Yandex, Naver, Seznam, Yep, DuckDuckGo (via Bing)
 * Google : n'a pas encore adopté IndexNow, utilise Search Console manuellement.
 *
 * Usage : node scripts/ping-sitemap.js
 */

const https = require('https')

const SITE_URL   = 'https://www.checkmyenterprise.com'
const INDEXNOW_KEY = process.env.INDEXNOW_KEY || 'vitalcheck2024indexnowkey'

// URLs prioritaires à soumettre
const URLS_TO_INDEX = [
  `${SITE_URL}/`,
  `${SITE_URL}/assessment`,
  `${SITE_URL}/blog`,
  `${SITE_URL}/about`,
  `${SITE_URL}/contact`,
  `${SITE_URL}/pricing`,
]

// Endpoints IndexNow des moteurs
const INDEXNOW_ENDPOINTS = [
  { name: 'Bing',    host: 'www.bing.com' },
  { name: 'Yandex',  host: 'yandex.com' },
  { name: 'IndexNow (global)', host: 'api.indexnow.org' },
]

function postIndexNow(endpoint) {
  return new Promise((resolve) => {
    const body = JSON.stringify({
      host: new URL(SITE_URL).hostname,
      key: INDEXNOW_KEY,
      keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
      urlList: URLS_TO_INDEX
    })

    const options = {
      hostname: endpoint.host,
      path: '/indexnow',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(body)
      }
    }

    const req = https.request(options, (res) => {
      let data = ''
      res.on('data', chunk => { data += chunk })
      res.on('end', () => {
        const ok = res.statusCode >= 200 && res.statusCode < 300
        console.log(`[${ok ? '✅' : '⚠️'}] ${endpoint.name} — HTTP ${res.statusCode}`)
        if (!ok && data) console.log(`    Réponse: ${data.substring(0, 200)}`)
        resolve({ engine: endpoint.name, status: res.statusCode, ok })
      })
    })

    req.on('error', (err) => {
      console.log(`[❌] ${endpoint.name} — Erreur: ${err.message}`)
      resolve({ engine: endpoint.name, error: err.message, ok: false })
    })

    req.setTimeout(10000, () => {
      req.destroy()
      console.log(`[⏱️] ${endpoint.name} — Timeout`)
      resolve({ engine: endpoint.name, error: 'Timeout', ok: false })
    })

    req.write(body)
    req.end()
  })
}

async function main() {
  console.log('\n🚀 IndexNow — Soumission des URLs à indexer\n')
  console.log('URLs soumises :')
  URLS_TO_INDEX.forEach(u => console.log(`  • ${u}`))
  console.log(`\nClé IndexNow : ${INDEXNOW_KEY}`)
  console.log(`Fichier clé attendu : ${SITE_URL}/${INDEXNOW_KEY}.txt\n`)

  const results = await Promise.all(INDEXNOW_ENDPOINTS.map(postIndexNow))

  const success = results.filter(r => r.ok).length
  console.log(`\n📊 Résultat : ${success}/${results.length} moteurs notifiés`)
  console.log('\n📝 Note Google : Google n\'a pas adopté IndexNow.')
  console.log('   → Soumets le sitemap sur https://search.google.com/search-console')
  console.log(`   → Sitemap URL : ${SITE_URL}/sitemap.xml`)

  if (success > 0) {
    console.log('\n⏳ Bing et Yandex indexent généralement dans 24–48h.')
  }
}

main()
