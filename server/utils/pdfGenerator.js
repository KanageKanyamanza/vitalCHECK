const htmlPdf = require('html-pdf-node');
const path = require('path');

// Configuration pour html-pdf-node
const pdfOptions = {
  format: 'A4',
  margin: {
    top: '20mm',
    right: '15mm',
    bottom: '20mm',
    left: '15mm'
  },
  printBackground: true,
  displayHeaderFooter: false,
  preferCSSPageSize: true
};

// Configuration pour Render.com et autres environnements
const launchOptions = {
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu',
    '--single-process',
    '--no-zygote',
    '--disable-setuid-sandbox'
  ]
};

// Fonction principale de génération PDF
async function generatePDFReport(assessment) {
  try {
    const { user, overallScore, overallStatus, pillarScores, completedAt, language = 'fr' } = assessment;
    
    // Générer le contenu HTML
    const htmlContent = generateHTMLContent(assessment);
    
    // Options pour html-pdf-node
    const options = {
      ...pdfOptions,
      args: launchOptions.args
    };
    
    // Créer le fichier HTML temporaire
    const file = {
      content: htmlContent
    };
    
    // Générer le PDF
    const pdfBuffer = await htmlPdf.generatePdf(file, options);
    
    return pdfBuffer;
    
  } catch (error) {
    console.error('PDF generation error:', error);
    throw error;
  }
}

// Fonction de génération simple (fallback)
async function generateSimplePDFReport(assessment) {
  try {
    const { user, overallScore, overallStatus, pillarScores, completedAt, language = 'fr' } = assessment;
    
    // HTML simplifié sans dépendances externes
    const htmlContent = generateSimpleHTMLContent(assessment);
    
    const options = {
      format: 'A4',
      margin: '10mm',
      printBackground: true,
      args: launchOptions.args
    };
    
    const file = {
      content: htmlContent
    };
    
    const pdfBuffer = await htmlPdf.generatePdf(file, options);
    
    return pdfBuffer;
    
  } catch (error) {
    console.error('Simple PDF generation error:', error);
    throw error;
  }
}

// Génération du contenu HTML (version complète) - Design comme l'email
function generateHTMLContent(assessment) {
  const { user, overallScore, overallStatus, pillarScores, completedAt, language = 'fr' } = assessment;
  
  const statusColors = {
    red: '#EF4444',
    amber: '#F59E0B',
    green: '#10B981'
  };
  
  const templates = {
    en: {
      statusTexts: {
        red: 'Critical Attention Required',
        amber: 'Needs Improvement',
        green: 'Healthy & Well-Positioned'
      },
      title: 'UBB Enterprise Health Check',
      subtitle: 'Professional Business Assessment Report',
      companyName: 'Company',
      sector: 'Sector',
      companySize: 'Company Size',
      assessmentDate: 'Assessment Date',
      overallScore: 'Overall Health Score',
      pillarScores: 'Pillar Breakdown',
      recommendations: 'Recommendations',
      generatedOn: 'Generated on',
      contact: 'Contact Information',
      email: 'Email',
      phone: 'Phone'
    },
    fr: {
      statusTexts: {
        red: 'Attention critique requise',
        amber: 'Nécessite des améliorations',
        green: 'En bonne santé et bien positionnée'
      },
      title: 'UBB Enterprise Health Check',
      subtitle: 'Rapport d\'Évaluation Professionnelle d\'Entreprise',
      companyName: 'Entreprise',
      sector: 'Secteur',
      companySize: 'Taille',
      assessmentDate: 'Date d\'Évaluation',
      overallScore: 'Score de Santé Global',
      pillarScores: 'Répartition par Piliers',
      recommendations: 'Recommandations',
      generatedOn: 'Généré le',
      contact: 'Informations de Contact',
      email: 'Email',
      phone: 'Téléphone'
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
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          background: white;
        }
        
        .header {
          background: linear-gradient(135deg, #fbc350 0%, #f59e0b 100%);
          color: white;
          padding: 40px 30px;
          text-align: center;
          position: relative;
          overflow: hidden;
          margin-bottom: 30px;
        }
        
        .header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48Y2lyY2xlIGN4PSI4MCIgY3k9IjQwIiByPSIxLjUiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjxjaXJjbGUgY3g9IjQwIiBjeT0iODAiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==') repeat;
          opacity: 0.3;
        }
        
        .header-content {
          position: relative;
          z-index: 2;
        }
        
        .logo-container {
          display: inline-block;
          background: rgba(255, 255, 255, 0.2);
          padding: 20px;
          border-radius: 50%;
          margin-bottom: 20px;
          backdrop-filter: blur(10px);
        }
        
         .logo {
           width: 80px;
           height: 80px;
           border-radius: 50%;
           object-fit: contain;
           margin: 0;
         }
        
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 700;
        }
        
        .header p {
          margin: 10px 0 0 0;
          font-size: 16px;
          font-weight: 300;
          opacity: 0.9;
        }
        
        .score-section {
          text-align: center;
          margin: 40px 0;
          background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
          border-radius: 16px;
          padding: 30px;
          border: 1px solid #e2e8f0;
        }
        
        .score-circle {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: ${overallColor};
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          font-weight: 700;
          margin: 0 auto 20px auto;
        }
        
        .score-text {
          font-size: 20px;
          color: #2d3748;
          font-weight: 600;
          margin-bottom: 10px;
        }
        
        .score-status {
          font-size: 16px;
          color: #4a5568;
        }
        
        .company-details {
          background: white;
          border-radius: 12px;
          padding: 25px;
          margin: 30px 0;
          border: 1px solid #e2e8f0;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        
        .company-details h3 {
          color: #2d3748;
          margin: 0 0 20px 0;
          font-size: 18px;
          font-weight: 600;
          display: flex;
          align-items: center;
        }
        
        .company-details h3::before {
          content: '📊';
          background: #fbc350;
          color: white;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-right: 10px;
          font-size: 12px;
        }
        
        .company-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }
        
        .company-item {
          padding: 12px;
          background: #f8fafc;
          border-radius: 8px;
        }
        
        .company-label {
          color: #718096;
          font-size: 12px;
          font-weight: 500;
          text-transform: uppercase;
          margin-bottom: 4px;
        }
        
        .company-value {
          color: #2d3748;
          font-weight: 600;
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
          border-bottom: 1px solid #e2e8f0;
        }
        
        .pillars-table th {
          background-color: #f8fafc;
          font-weight: 600;
          color: #2d3748;
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
          color: #fbc350;
          border-bottom: 2px solid #fbc350;
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
           border-left: 4px solid #fbc350;
           border-radius: 4px;
         }
         
         .premium-teaser {
           background: linear-gradient(135deg, #fbc350 0%, #f59e0b 100%);
           color: white;
           padding: 30px;
           border-radius: 12px;
           text-align: center;
           margin: 30px 0;
         }
         
         .premium-teaser h3 {
           color: white;
           margin: 0 0 15px 0;
           font-size: 20px;
           font-weight: 600;
         }
         
         .premium-teaser p {
           color: rgba(255, 255, 255, 0.9);
           margin: 0 0 20px 0;
           font-size: 16px;
           line-height: 1.5;
         }
         
         .premium-button {
           background: white;
           color: #f59e0b;
           padding: 12px 24px;
           text-decoration: none;
           border-radius: 8px;
           font-weight: 600;
           font-size: 16px;
           display: inline-block;
           transition: all 0.3s ease;
         }
         
         .premium-button:hover {
           background: #f8f9fa;
           transform: translateY(-2px);
         }
         
         .generation-info {
           background: #f8f9fa;
           padding: 20px;
           border-radius: 8px;
           text-align: center;
           margin: 30px 0;
         }
         
         .generation-info p {
           margin: 5px 0;
           color: #6b7280;
           font-size: 14px;
         }
        
        @media print {
          body { -webkit-print-color-adjust: exact; }
          .header { break-inside: avoid; }
          .score-section { break-inside: avoid; }
        }
      </style>
    </head>
    <body>
       <div class="header">
         <div class="header-pattern"></div>
         <div class="header-content">
           <div class="logo-container">
             <img src="https://www.checkmyenterprise.com/ms-icon-310x310.png" alt="UBB Logo" class="logo" />
           </div>
           <h1>Enterprise Health Check</h1>
           <p>${language === 'fr' ? 'Rapport d\'Évaluation Professionnelle d\'Entreprise' : 'Professional Business Assessment Report'}</p>
         </div>
       </div>
      
      <div class="score-section">
        <div class="score-circle">${overallScore}</div>
        <div class="score-text">${t.overallScore}</div>
        <div class="score-status">${overallText}</div>
      </div>
      
      <div class="company-details">
        <h3>${language === 'fr' ? 'Détails de l\'Évaluation' : 'Assessment Details'}</h3>
        <div class="company-grid">
          <div class="company-item">
            <div class="company-label">${t.companyName}</div>
            <div class="company-value">${user.companyName}</div>
          </div>
          <div class="company-item">
            <div class="company-label">${t.sector}</div>
            <div class="company-value">${user.sector}</div>
          </div>
          <div class="company-item">
            <div class="company-label">${t.companySize}</div>
            <div class="company-value">${user.companySize}</div>
          </div>
          <div class="company-item">
            <div class="company-label">${t.assessmentDate}</div>
            <div class="company-value">${new Date(completedAt).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}</div>
          </div>
        </div>
      </div>
      
      <h3>${t.pillarScores}</h3>
      <table class="pillars-table">
        <thead>
          <tr>
            <th>${language === 'fr' ? 'Pilier' : 'Pillar'}</th>
            <th>${language === 'fr' ? 'Score' : 'Score'}</th>
            <th>${language === 'fr' ? 'Statut' : 'Status'}</th>
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
         <h3>${t.recommendations}</h3>
         <ul>
           ${pillarScores.filter(p => p.recommendations && p.recommendations.length > 0)
             .flatMap(p => p.recommendations.slice(0, 2))
             .map(rec => `<li>${rec}</li>`).join('')}
         </ul>
       </div>
       
       <!-- Section premium teaser -->
       <div class="premium-teaser">
         <h3>${language === 'fr' ? 'Débloquez Votre Rapport Complet de Santé d\'Entreprise' : 'Unlock Your Full Enterprise Health Report'}</h3>
         <p>${language === 'fr' ? 'Obtenez des insights détaillés, des recommandations personnalisées, un benchmarking par rapport aux pairs, et un appel de consultation avec nos experts.' : 'Get detailed insights, tailored recommendations, benchmarking against peers, and a consultation call with our experts.'}</p>
         <a href="mailto:ambrose.nzeyi@gmail.com?subject=Full%20Report%20Request" class="premium-button">
           ${language === 'fr' ? 'Réservez Votre Rapport Complet' : 'Book Your Full Report'}
         </a>
       </div>
       
       <!-- Section génération -->
       <div class="generation-info">
         <p>${language === 'fr' ? 'Ce rapport a été généré par UBB Enterprise Health Check' : 'This report was generated by UBB Enterprise Health Check'}</p>
         <p>${language === 'fr' ? 'Pour plus d\'informations, visitez notre site web ou contactez notre équipe' : 'For more information, visit our website or contact our team'}</p>
       </div>
      
    </body>
    </html>
  `;
}

// Génération du contenu HTML simple (fallback)
function generateSimpleHTMLContent(assessment) {
  const { user, overallScore, overallStatus, pillarScores, completedAt, language = 'fr' } = assessment;
  
  const statusColors = {
    red: '#EF4444',
    amber: '#F59E0B',
    green: '#10B981'
  };
  
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
          font-family: Arial, sans-serif;
          line-height: 1.4;
          color: #333;
          margin: 0;
          padding: 20px;
        }
        .header {
          background: #FF6B35;
          color: white;
          padding: 20px;
          text-align: center;
          margin-bottom: 20px;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
        }
        .header h2 {
          margin: 5px 0 0 0;
          font-size: 16px;
          opacity: 0.9;
        }
        .company-info {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 5px;
          margin-bottom: 20px;
        }
        .score-section {
          text-align: center;
          margin: 30px 0;
        }
        .score-circle {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: ${overallColor};
          color: white;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 15px;
        }
        .score-text {
          font-size: 16px;
          color: ${overallColor};
          font-weight: bold;
        }
        .pillars-table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        .pillars-table th,
        .pillars-table td {
          padding: 8px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }
        .pillars-table th {
          background-color: #f8f9fa;
          font-weight: bold;
        }
        .status-badge {
          padding: 2px 8px;
          border-radius: 15px;
          color: white;
          font-size: 10px;
          font-weight: bold;
          text-transform: uppercase;
        }
        .status-red { background-color: #EF4444; }
        .status-amber { background-color: #F59E0B; }
        .status-green { background-color: #10B981; }
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
      
      <!-- Section premium teaser -->
      <div class="premium-teaser">
        <h3>${language === 'fr' ? 'Débloquez Votre Rapport Complet de Santé d\'Entreprise' : 'Unlock Your Full Enterprise Health Report'}</h3>
        <p>${language === 'fr' ? 'Obtenez des insights détaillés, des recommandations personnalisées, un benchmarking par rapport aux pairs, et un appel de consultation avec nos experts.' : 'Get detailed insights, tailored recommendations, benchmarking against peers, and a consultation call with our experts.'}</p>
        <a href="mailto:ambrose.nzeyi@gmail.com?subject=Full%20Report%20Request" class="premium-button">
          ${language === 'fr' ? 'Réservez Votre Rapport Complet' : 'Book Your Full Report'}
        </a>
      </div>
      
      <!-- Section génération -->
      <div class="generation-info">
        <p>${language === 'fr' ? 'Ce rapport a été généré par UBB Enterprise Health Check' : 'This report was generated by UBB Enterprise Health Check'}</p>
        <p>${language === 'fr' ? 'Pour plus d\'informations, visitez notre site web ou contactez notre équipe' : 'For more information, visit our website or contact our team'}</p>
      </div>
      
    </body>
    </html>
  `;
}

module.exports = {
  generatePDFReport,
  generateSimplePDFReport
};
