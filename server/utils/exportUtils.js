const ExcelJS = require('exceljs');
const htmlPdf = require('html-pdf-node');

// Export des utilisateurs en Excel
const exportUsersToExcel = async (users) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Utilisateurs');

  // Configuration des colonnes
  worksheet.columns = [
    { header: 'Email', key: 'email', width: 30 },
    { header: 'Nom de l\'entreprise', key: 'companyName', width: 30 },
    { header: 'Secteur', key: 'sector', width: 20 },
    { header: 'Taille', key: 'companySize', width: 15 },
    { header: 'Évaluations', key: 'assessmentsCount', width: 12 },
    { header: 'Score moyen', key: 'avgScore', width: 12 },
    { header: 'Statut moyen', key: 'avgStatus', width: 15 },
    { header: 'Date de création', key: 'createdAt', width: 20 },
    { header: 'Premium', key: 'isPremium', width: 10 }
  ];

  // Style de l'en-tête
  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE6F3FF' }
  };

  // Ajouter les données
  users.forEach(user => {
    const assessments = user.assessments || [];
    const avgScore = assessments.length > 0 
      ? Math.round(assessments.reduce((sum, a) => sum + a.overallScore, 0) / assessments.length)
      : 'N/A';
    const avgStatus = assessments.length > 0 
      ? assessments[0].overallStatus 
      : 'N/A';
    
    worksheet.addRow({
      email: user.email,
      companyName: user.companyName,
      sector: user.sector,
      companySize: user.companySize,
      assessmentsCount: assessments.length,
      avgScore: avgScore,
      avgStatus: avgStatus,
      createdAt: user.createdAt.toISOString().split('T')[0],
      isPremium: user.isPremium ? 'Oui' : 'Non'
    });
  });

  // Auto-fit des colonnes
  worksheet.columns.forEach(column => {
    column.width = Math.max(column.width, 10);
  });

  return await workbook.xlsx.writeBuffer();
};

// Export des évaluations en Excel
const exportAssessmentsToExcel = async (assessments) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Évaluations');

  // Configuration des colonnes
  worksheet.columns = [
    { header: 'ID Évaluation', key: 'id', width: 25 },
    { header: 'Entreprise', key: 'companyName', width: 30 },
    { header: 'Email', key: 'email', width: 30 },
    { header: 'Secteur', key: 'sector', width: 20 },
    { header: 'Taille', key: 'companySize', width: 15 },
    { header: 'Score global', key: 'overallScore', width: 12 },
    { header: 'Statut global', key: 'overallStatus', width: 15 },
    { header: 'Langue', key: 'language', width: 10 },
    { header: 'Date de complétion', key: 'completedAt', width: 20 },
    { header: 'Rapport généré', key: 'reportGenerated', width: 15 },
    { header: 'Type de rapport', key: 'reportType', width: 15 }
  ];

  // Style de l'en-tête
  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE6F3FF' }
  };

  // Ajouter les données
  assessments.forEach(assessment => {
    worksheet.addRow({
      id: assessment._id.toString(),
      companyName: assessment.user.companyName,
      email: assessment.user.email,
      sector: assessment.user.sector,
      companySize: assessment.user.companySize,
      overallScore: assessment.overallScore,
      overallStatus: assessment.overallStatus,
      language: assessment.language || 'fr',
      completedAt: assessment.completedAt.toISOString().split('T')[0],
      reportGenerated: assessment.reportGenerated ? 'Oui' : 'Non',
      reportType: assessment.reportType || 'freemium'
    });
  });

  // Auto-fit des colonnes
  worksheet.columns.forEach(column => {
    column.width = Math.max(column.width, 10);
  });

  return await workbook.xlsx.writeBuffer();
};

// Export des statistiques en Excel
const exportStatsToExcel = async (stats) => {
  const workbook = new ExcelJS.Workbook();
  
  // Feuille des statistiques générales
  const generalSheet = workbook.addWorksheet('Statistiques Générales');
  generalSheet.columns = [
    { header: 'Métrique', key: 'metric', width: 30 },
    { header: 'Valeur', key: 'value', width: 15 }
  ];
  
  generalSheet.getRow(1).font = { bold: true };
  generalSheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE6F3FF' }
  };

  generalSheet.addRows([
    { metric: 'Total Utilisateurs', value: stats.totalUsers },
    { metric: 'Total Évaluations', value: stats.totalAssessments },
    { metric: 'Évaluations Complétées', value: stats.completedAssessments },
    { metric: 'Utilisateurs Récents (7j)', value: stats.recentUsers },
    { metric: 'Évaluations Récentes (7j)', value: stats.recentAssessments }
  ]);

  // Feuille des statistiques par secteur
  if (stats.sectorStats && stats.sectorStats.length > 0) {
    const sectorSheet = workbook.addWorksheet('Par Secteur');
    sectorSheet.columns = [
      { header: 'Secteur', key: 'sector', width: 30 },
      { header: 'Nombre', key: 'count', width: 15 }
    ];
    
    sectorSheet.getRow(1).font = { bold: true };
    sectorSheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE6F3FF' }
    };

    stats.sectorStats.forEach(stat => {
      sectorSheet.addRow({
        sector: stat._id || 'Non spécifié',
        count: stat.count
      });
    });
  }

  // Feuille des statistiques par taille
  if (stats.sizeStats && stats.sizeStats.length > 0) {
    const sizeSheet = workbook.addWorksheet('Par Taille');
    sizeSheet.columns = [
      { header: 'Taille', key: 'size', width: 20 },
      { header: 'Nombre', key: 'count', width: 15 }
    ];
    
    sizeSheet.getRow(1).font = { bold: true };
    sizeSheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE6F3FF' }
    };

    stats.sizeStats.forEach(stat => {
      const sizeLabels = {
        'micro': 'Micro (1-9)',
        'sme': 'PME (10-49)',
        'large-sme': 'Grande PME (50-249)'
      };
      sizeSheet.addRow({
        size: sizeLabels[stat._id] || stat._id,
        count: stat.count
      });
    });
  }

  return await workbook.xlsx.writeBuffer();
};

// Export PDF des statistiques
const exportStatsToPDF = async (stats) => {
  try {
    // Configuration pour html-pdf-node (même que dans pdfGenerator.js)
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

    const html = generateStatsHTML(stats);
    
    const options = {
      ...pdfOptions,
      args: launchOptions.args
    };
    
    const file = {
      content: html
    };
    
    const pdfBuffer = await htmlPdf.generatePdf(file, options);
    return pdfBuffer;
    
  } catch (error) {
    console.error('PDF generation error:', error);
    throw error;
  }
};

// Génération du contenu HTML pour les statistiques
const generateStatsHTML = (stats) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Rapport Statistiques UBB</title>
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
        
        .section {
          margin-bottom: 30px;
          background: white;
          border-radius: 12px;
          padding: 25px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        
        .section h2 {
          color: #2d3748;
          margin: 0 0 20px 0;
          font-size: 18px;
          font-weight: 600;
          display: flex;
          align-items: center;
          border-bottom: 2px solid #fbc350;
          padding-bottom: 10px;
        }
        
        .section h2::before {
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
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin: 20px 0;
        }
        
        .stat-card {
          background: #f8fafc;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          border: 1px solid #e2e8f0;
        }
        
        .stat-value {
          font-size: 2em;
          font-weight: bold;
          color: #fbc350;
        }
        
        .stat-label {
          color: #6b7280;
          margin-top: 5px;
          font-weight: 500;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        
        th, td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #e2e8f0;
        }
        
        th {
          background-color: #f8fafc;
          font-weight: 600;
          color: #2d3748;
        }
        
        .footer {
          margin-top: 50px;
          text-align: center;
          color: #6b7280;
          font-size: 0.9em;
          background: #f8fafc;
          padding: 20px;
          border-radius: 8px;
        }
        
        @media print {
          body { -webkit-print-color-adjust: exact; }
          .header { break-inside: avoid; }
          .section { break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="header-content">
          <div class="logo-container">
            <img src="https://ubb-enterprise-health-check.vercel.app/icons/ms-icon-310x310.png" alt="UBB Logo" class="logo" />
          </div>
          <h1>UBB Enterprise Health Check</h1>
          <p>Rapport Statistiques Administrateur</p>
          <p>Généré le ${new Date().toLocaleDateString('fr-FR')}</p>
        </div>
      </div>

      <div class="section">
        <h2>Statistiques Générales</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">${stats.totalUsers}</div>
            <div class="stat-label">Utilisateurs</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${stats.totalAssessments}</div>
            <div class="stat-label">Évaluations</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${stats.completedAssessments}</div>
            <div class="stat-label">Complétées</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${stats.recentUsers}</div>
            <div class="stat-label">Nouveaux (7j)</div>
          </div>
        </div>
      </div>

      ${stats.sectorStats && stats.sectorStats.length > 0 ? `
      <div class="section">
        <h2>Répartition par Secteur</h2>
        <table>
          <thead>
            <tr>
              <th>Secteur</th>
              <th>Nombre d'entreprises</th>
            </tr>
          </thead>
          <tbody>
            ${stats.sectorStats.map(stat => `
              <tr>
                <td>${stat._id || 'Non spécifié'}</td>
                <td>${stat.count}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      ` : ''}

      ${stats.sizeStats && stats.sizeStats.length > 0 ? `
      <div class="section">
        <h2>Répartition par Taille</h2>
        <table>
          <thead>
            <tr>
              <th>Taille d'entreprise</th>
              <th>Nombre</th>
            </tr>
          </thead>
          <tbody>
            ${stats.sizeStats.map(stat => {
              const sizeLabels = {
                'micro': 'Micro (1-9 employés)',
                'sme': 'PME (10-49 employés)',
                'large-sme': 'Grande PME (50-249 employés)'
              };
              return `
                <tr>
                  <td>${sizeLabels[stat._id] || stat._id}</td>
                  <td>${stat.count}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
      ` : ''}

      <div class="footer">
        <p>Rapport généré automatiquement par UBB Enterprise Health Check</p>
        <p>© ${new Date().getFullYear()} UBB. Tous droits réservés.</p>
      </div>
    </body>
    </html>
  `;
};

// Export PDF des utilisateurs
const exportUsersToPDF = async (users) => {
  try {
    // Configuration pour html-pdf-node (même que dans pdfGenerator.js)
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

    const html = generateUsersHTML(users);
    
    const options = {
      ...pdfOptions,
      args: launchOptions.args
    };
    
    const file = {
      content: html
    };
    
    const pdfBuffer = await htmlPdf.generatePdf(file, options);
    return pdfBuffer;
    
  } catch (error) {
    console.error('PDF generation error:', error);
    throw error;
  }
};

// Génération du contenu HTML pour les utilisateurs
const generateUsersHTML = (users) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Rapport Utilisateurs UBB</title>
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
        
        .summary {
          background: white;
          border-radius: 12px;
          padding: 25px;
          margin: 30px 0;
          border: 1px solid #e2e8f0;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        
        .summary h3 {
          color: #2d3748;
          margin: 0 0 20px 0;
          font-size: 18px;
          font-weight: 600;
          display: flex;
          align-items: center;
          border-bottom: 2px solid #fbc350;
          padding-bottom: 10px;
        }
        
        .summary h3::before {
          content: '👥';
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
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin: 20px 0;
        }
        
        .stat-card {
          background: #f8fafc;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          border: 1px solid #e2e8f0;
        }
        
        .stat-value {
          font-size: 2em;
          font-weight: bold;
          color: #fbc350;
        }
        
        .stat-label {
          color: #6b7280;
          margin-top: 5px;
          font-weight: 500;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 30px 0;
          font-size: 12px;
        }
        
        th, td {
          padding: 8px;
          text-align: left;
          border-bottom: 1px solid #e2e8f0;
        }
        
        th {
          background-color: #f8fafc;
          font-weight: 600;
          color: #2d3748;
          font-size: 11px;
          text-transform: uppercase;
        }
        
        .status-badge {
          padding: 2px 8px;
          border-radius: 12px;
          color: white;
          font-size: 10px;
          font-weight: bold;
          text-transform: uppercase;
        }
        
        .status-premium { background-color: #10B981; }
        .status-freemium { background-color: #6B7280; }
        
        .footer {
          margin-top: 50px;
          text-align: center;
          color: #6b7280;
          font-size: 0.9em;
          background: #f8fafc;
          padding: 20px;
          border-radius: 8px;
        }
        
        @media print {
          body { -webkit-print-color-adjust: exact; }
          .header { break-inside: avoid; }
          .summary { break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="header-content">
          <div class="logo-container">
            <img src="https://ubb-enterprise-health-check.vercel.app/icons/ms-icon-310x310.png" alt="UBB Logo" class="logo" />
          </div>
          <h1>UBB Enterprise Health Check</h1>
          <p>Rapport Utilisateurs Administrateur</p>
          <p>Généré le ${new Date().toLocaleDateString('fr-FR')}</p>
        </div>
      </div>

      <div class="summary">
        <h3>Résumé</h3>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">${users.length}</div>
            <div class="stat-label">Total Utilisateurs</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${users.filter(u => u.isPremium).length}</div>
            <div class="stat-label">Utilisateurs Premium</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${users.reduce((sum, u) => sum + (u.assessments?.length || 0), 0)}</div>
            <div class="stat-label">Total Évaluations</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${Math.round(users.reduce((sum, u) => {
              const assessments = u.assessments || [];
              if (assessments.length === 0) return sum;
              const avgScore = assessments.reduce((s, a) => s + a.overallScore, 0) / assessments.length;
              return sum + avgScore;
            }, 0) / users.filter(u => u.assessments?.length > 0).length) || 0}</div>
            <div class="stat-label">Score Moyen</div>
          </div>
        </div>
      </div>

      <div class="summary">
        <h3>Liste des Utilisateurs</h3>
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Entreprise</th>
              <th>Secteur</th>
              <th>Taille</th>
              <th>Évaluations</th>
              <th>Score Moyen</th>
              <th>Type</th>
              <th>Inscription</th>
            </tr>
          </thead>
          <tbody>
            ${users.map(user => {
              const assessments = user.assessments || [];
              const avgScore = assessments.length > 0 
                ? Math.round(assessments.reduce((sum, a) => sum + a.overallScore, 0) / assessments.length)
                : 'N/A';
              return `
                <tr>
                  <td>${user.email}</td>
                  <td>${user.companyName}</td>
                  <td>${user.sector}</td>
                  <td>${user.companySize}</td>
                  <td>${assessments.length}</td>
                  <td>${avgScore}</td>
                  <td><span class="status-badge status-${user.isPremium ? 'premium' : 'freemium'}">${user.isPremium ? 'Premium' : 'Freemium'}</span></td>
                  <td>${user.createdAt.toISOString().split('T')[0]}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>

      <div class="footer">
        <p>Rapport généré automatiquement par UBB Enterprise Health Check</p>
        <p>© ${new Date().getFullYear()} UBB. Tous droits réservés.</p>
      </div>
    </body>
    </html>
  `;
};

// Export PDF des évaluations
const exportAssessmentsToPDF = async (assessments) => {
  try {
    // Configuration pour html-pdf-node (même que dans pdfGenerator.js)
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

    const html = generateAssessmentsHTML(assessments);
    
    const options = {
      ...pdfOptions,
      args: launchOptions.args
    };
    
    const file = {
      content: html
    };
    
    const pdfBuffer = await htmlPdf.generatePdf(file, options);
    return pdfBuffer;
    
  } catch (error) {
    console.error('PDF generation error:', error);
    throw error;
  }
};

// Génération du contenu HTML pour les évaluations
const generateAssessmentsHTML = (assessments) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Rapport Évaluations UBB</title>
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
        
        .summary {
          background: white;
          border-radius: 12px;
          padding: 25px;
          margin: 30px 0;
          border: 1px solid #e2e8f0;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        
        .summary h3 {
          color: #2d3748;
          margin: 0 0 20px 0;
          font-size: 18px;
          font-weight: 600;
          display: flex;
          align-items: center;
          border-bottom: 2px solid #fbc350;
          padding-bottom: 10px;
        }
        
        .summary h3::before {
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
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin: 20px 0;
        }
        
        .stat-card {
          background: #f8fafc;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          border: 1px solid #e2e8f0;
        }
        
        .stat-value {
          font-size: 2em;
          font-weight: bold;
          color: #fbc350;
        }
        
        .stat-label {
          color: #6b7280;
          margin-top: 5px;
          font-weight: 500;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 30px 0;
          font-size: 11px;
        }
        
        th, td {
          padding: 8px;
          text-align: left;
          border-bottom: 1px solid #e2e8f0;
        }
        
        th {
          background-color: #f8fafc;
          font-weight: 600;
          color: #2d3748;
          font-size: 10px;
          text-transform: uppercase;
        }
        
        .status-badge {
          padding: 2px 8px;
          border-radius: 12px;
          color: white;
          font-size: 9px;
          font-weight: bold;
          text-transform: uppercase;
        }
        
        .status-red { background-color: #EF4444; }
        .status-amber { background-color: #F59E0B; }
        .status-green { background-color: #10B981; }
        
        .footer {
          margin-top: 50px;
          text-align: center;
          color: #6b7280;
          font-size: 0.9em;
          background: #f8fafc;
          padding: 20px;
          border-radius: 8px;
        }
        
        @media print {
          body { -webkit-print-color-adjust: exact; }
          .header { break-inside: avoid; }
          .summary { break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="header-content">
          <div class="logo-container">
            <img src="https://ubb-enterprise-health-check.vercel.app/icons/ms-icon-310x310.png" alt="UBB Logo" class="logo" />
          </div>
          <h1>UBB Enterprise Health Check</h1>
          <p>Rapport Évaluations Administrateur</p>
          <p>Généré le ${new Date().toLocaleDateString('fr-FR')}</p>
        </div>
      </div>

      <div class="summary">
        <h3>Résumé</h3>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">${assessments.length}</div>
            <div class="stat-label">Total Évaluations</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${assessments.filter(a => a.reportGenerated).length}</div>
            <div class="stat-label">Rapports Générés</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${Math.round(assessments.reduce((sum, a) => sum + a.overallScore, 0) / assessments.length) || 0}</div>
            <div class="stat-label">Score Moyen</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${assessments.filter(a => a.overallStatus === 'green').length}</div>
            <div class="stat-label">Statut Vert</div>
          </div>
        </div>
      </div>

      <div class="summary">
        <h3>Liste des Évaluations</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Entreprise</th>
              <th>Email</th>
              <th>Secteur</th>
              <th>Taille</th>
              <th>Score</th>
              <th>Statut</th>
              <th>Langue</th>
              <th>Date</th>
              <th>Rapport</th>
            </tr>
          </thead>
          <tbody>
            ${assessments.map(assessment => `
              <tr>
                <td>${assessment._id.toString().substring(0, 8)}...</td>
                <td>${assessment.user.companyName}</td>
                <td>${assessment.user.email}</td>
                <td>${assessment.user.sector}</td>
                <td>${assessment.user.companySize}</td>
                <td>${assessment.overallScore}</td>
                <td><span class="status-badge status-${assessment.overallStatus}">${assessment.overallStatus}</span></td>
                <td>${assessment.language || 'fr'}</td>
                <td>${assessment.completedAt.toISOString().split('T')[0]}</td>
                <td>${assessment.reportGenerated ? 'Oui' : 'Non'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div class="footer">
        <p>Rapport généré automatiquement par UBB Enterprise Health Check</p>
        <p>© ${new Date().getFullYear()} UBB. Tous droits réservés.</p>
      </div>
    </body>
    </html>
  `;
};

module.exports = {
  exportUsersToExcel,
  exportAssessmentsToExcel,
  exportStatsToExcel,
  exportStatsToPDF,
  exportUsersToPDF,
  exportAssessmentsToPDF
};
