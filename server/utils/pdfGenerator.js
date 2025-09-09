const puppeteer = require('puppeteer');
const path = require('path');

async function generatePDFReport(assessment) {
  let browser;
  
  try {
    // Configuration pour Render.com
    const launchOptions = {
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu'
      ]
    };

    // Configuration pour Render.com - essayer Chrome système d'abord, puis Puppeteer
    if (process.env.NODE_ENV === 'production' || process.env.RENDER) {
      const fs = require('fs');
      
      // Essayer d'abord Chrome système (installé via Dockerfile)
      const systemChromePaths = [
        '/usr/bin/google-chrome-stable',
        '/usr/bin/google-chrome',
        '/usr/bin/chromium-browser',
        '/usr/bin/chromium'
      ];
      
      let chromeFound = false;
      for (const chromePath of systemChromePaths) {
        if (fs.existsSync(chromePath)) {
          launchOptions.executablePath = chromePath;
          console.log(`Using system Chrome at: ${chromePath}`);
          chromeFound = true;
          break;
        }
      }
      
      // Si Chrome système n'est pas trouvé, utiliser Puppeteer Chrome
      if (!chromeFound) {
        const puppeteer = require('puppeteer');
        const executablePath = puppeteer.executablePath();
        
        if (executablePath) {
          launchOptions.executablePath = executablePath;
          console.log(`Using Puppeteer Chrome at: ${executablePath}`);
        } else {
          console.warn('Neither system Chrome nor Puppeteer Chrome found, using default configuration');
        }
      }
    }

    browser = await puppeteer.launch(launchOptions);
    
    const page = await browser.newPage();
    
    // Generate HTML content for the PDF
    const htmlContent = generateHTMLContent(assessment);
    
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '15mm',
        bottom: '20mm',
        left: '15mm'
      }
    });
    
    return pdfBuffer;
    
  } catch (error) {
    console.error('PDF generation error:', error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

function generateHTMLContent(assessment) {
  const { user, overallScore, overallStatus, pillarScores, completedAt, language = 'fr' } = assessment;
  
  const statusColors = {
    red: '#EF4444',
    amber: '#F59E0B',
    green: '#10B981'
  };
  
  // Templates multilingues
  const templates = {
    en: {
      statusTexts: {
        red: 'Critical',
        amber: 'Needs Improvement',
        green: 'Healthy'
      },
      title: 'UBB Enterprise Health Check Report',
      subtitle: 'Free Self-Assessment Report',
      companyName: 'Company Name',
      assessmentDate: 'Assessment Date',
      overallScore: 'Overall Health Score',
      pillarScores: 'Pillar Breakdown',
      recommendations: 'Recommendations',
      generatedOn: 'Generated on'
    },
    fr: {
      statusTexts: {
        red: 'Critique',
        amber: 'À améliorer',
        green: 'En bonne santé'
      },
      title: 'Rapport UBB Enterprise Health Check',
      subtitle: 'Rapport d\'auto-évaluation gratuit',
      companyName: 'Nom de l\'entreprise',
      assessmentDate: 'Date d\'évaluation',
      overallScore: 'Score de santé global',
      pillarScores: 'Répartition par piliers',
      recommendations: 'Recommandations',
      generatedOn: 'Généré le'
    }
  };
  
  const t = templates[language] || templates.fr;
  const overallText = t.statusTexts[overallStatus];
  const overallColor = statusColors[overallStatus];
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>UBB Enterprise Health Check Report</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
        }
        .header {
          background: linear-gradient(135deg, #FF6B35, #F7931E);
          color: white;
          padding: 30px;
          text-align: center;
          margin-bottom: 30px;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: bold;
        }
        .header h2 {
          margin: 10px 0 0 0;
          font-size: 18px;
          opacity: 0.9;
        }
        .company-info {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 30px;
        }
        .score-section {
          text-align: center;
          margin: 40px 0;
        }
        .score-circle {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          background: ${overallColor};
          color: white;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 20px;
        }
        .score-text {
          font-size: 18px;
          color: ${overallColor};
          font-weight: bold;
        }
        .pillars-table {
          width: 100%;
          border-collapse: collapse;
          margin: 30px 0;
        }
        .pillars-table th,
        .pillars-table td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }
        .pillars-table th {
          background-color: #f8f9fa;
          font-weight: bold;
        }
        .status-badge {
          padding: 4px 12px;
          border-radius: 20px;
          color: white;
          font-size: 12px;
          font-weight: bold;
          text-transform: uppercase;
        }
        .status-red { background-color: #EF4444; }
        .status-amber { background-color: #F59E0B; }
        .status-green { background-color: #10B981; }
        .recommendations {
          margin: 30px 0;
        }
        .recommendations h3 {
          color: #FF6B35;
          border-bottom: 2px solid #FF6B35;
          padding-bottom: 10px;
        }
        .recommendations ul {
          list-style-type: none;
          padding: 0;
        }
        .recommendations li {
          background: #f8f9fa;
          margin: 10px 0;
          padding: 15px;
          border-left: 4px solid #FF6B35;
          border-radius: 4px;
        }
        .footer {
          margin-top: 50px;
          padding: 20px;
          background: #f8f9fa;
          text-align: center;
          border-radius: 8px;
        }
        .premium-teaser {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          padding: 30px;
          border-radius: 8px;
          text-align: center;
          margin: 30px 0;
        }
        .premium-teaser h3 {
          margin-top: 0;
        }
        .cta-button {
          background: white;
          color: #667eea;
          padding: 12px 30px;
          border: none;
          border-radius: 25px;
          font-weight: bold;
          text-decoration: none;
          display: inline-block;
          margin-top: 15px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>UBB ENTERPRISE HEALTH CHECK</h1>
        <h2>${t.subtitle}</h2>
      </div>
      
      <div class="company-info">
        <h3>${t.companyName}</h3>
        <p><strong>${t.companyName}:</strong> ${user.companyName}</p>
        <p><strong>Secteur:</strong> ${user.sector}</p>
        <p><strong>Taille:</strong> ${user.companySize}</p>
        <p><strong>${t.assessmentDate}:</strong> ${new Date(completedAt).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}</p>
      </div>
      
      <div class="score-section">
        <div class="score-circle">${overallScore}/100</div>
        <div class="score-text">${overallText}</div>
        <p>${language === 'fr' ? 
          `Votre entreprise est ${overallStatus === 'green' ? 'en bonne santé et bien positionnée pour la croissance' : 
            overallStatus === 'amber' ? 'en développement mais a besoin de renforcement dans certains domaines' : 
            'confrontée à des défis critiques qui nécessitent une attention immédiate'}.` :
          `Your enterprise is ${overallStatus === 'green' ? 'healthy and well-positioned for growth' : 
            overallStatus === 'amber' ? 'developing but needs strengthening in some areas' : 
            'facing critical challenges that require immediate attention'}.`
        }</p>
      </div>
      
      <h3>${t.pillarScores}</h3>
      <table class="pillars-table">
        <thead>
          <tr>
            <th>Pillar</th>
            <th>Score</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${pillarScores.map(pillar => `
            <tr>
              <td>${pillar.pillarName}</td>
              <td>${pillar.score}/100</td>
              <td><span class="status-badge status-${pillar.status}">${t.statusTexts[pillar.status]}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      
      <div class="recommendations">
        <h3>Key Recommendations</h3>
        <ul>
          ${pillarScores.filter(p => p.recommendations && p.recommendations.length > 0)
            .flatMap(p => p.recommendations.slice(0, 2))
            .map(rec => `<li>${rec}</li>`).join('')}
        </ul>
      </div>
      
      <div class="premium-teaser">
        <h3>Unlock Your Full Enterprise Health Report</h3>
        <p>Get detailed insights, tailored recommendations, benchmarking against peers, and a consultation call with our experts.</p>
        <a href="#" class="cta-button">Book Your Full Report</a>
      </div>
      
      <div class="footer">
        <p>This report was generated by UBB Enterprise Health Check</p>
        <p>For more information, visit our website or contact our team</p>
      </div>
    </body>
    </html>
  `;
}

module.exports = {
  generatePDFReport
};
