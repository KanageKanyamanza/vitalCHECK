import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Génération PDF côté client avec jsPDF
export const generateClientPDF = async (assessment, elementId = 'pdf-content') => {
  try {
    const { user, overallScore, overallStatus, pillarScores, completedAt, language = 'fr' } = assessment;
    
    // Créer un élément temporaire pour le PDF
    const pdfElement = createPDFElement(assessment);
    document.body.appendChild(pdfElement);
    
    // Capturer l'élément avec html2canvas
    const canvas = await html2canvas(pdfElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });
    
    // Nettoyer l'élément temporaire
    document.body.removeChild(pdfElement);
    
    // Créer le PDF avec jsPDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 295; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    
    let position = 0;
    
    // Ajouter la première page
    pdf.addImage(canvas, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    
    // Ajouter des pages supplémentaires si nécessaire
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(canvas, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    // Télécharger le PDF
    const filename = `vitalCHECK-Health-Check-${user.companyName}-${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(filename);
    
    return true;
    
  } catch (error) {
    console.error('Client PDF generation error:', error);
    throw error;
  }
};

// Créer un élément HTML pour le PDF
const createPDFElement = (assessment) => {
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
      title: 'vitalCHECK Enterprise Health Check Report',
      subtitle: 'Free Self-Assessment Report',
      companyName: 'Company Name',
      assessmentDate: 'Assessment Date',
      overallScore: 'Overall Health Score',
      pillarScores: 'Pillar Breakdown',
      recommendations: 'Recommendations'
    },
    fr: {
      statusTexts: {
        red: 'Critique',
        amber: 'À améliorer',
        green: 'En bonne santé'
      },
      title: 'Rapport vitalCHECK Enterprise Health Check',
      subtitle: 'Rapport d\'auto-évaluation gratuit',
      companyName: 'Nom de l\'entreprise',
      assessmentDate: 'Date d\'évaluation',
      overallScore: 'Score de santé global',
      pillarScores: 'Répartition par piliers',
      recommendations: 'Recommandations'
    }
  };
  
  const t = templates[language] || templates.fr;
  const overallText = t.statusTexts[overallStatus];
  const overallColor = statusColors[overallStatus];
  
  const element = document.createElement('div');
  element.id = 'pdf-content';
  element.style.cssText = `
    position: absolute;
    top: -9999px;
    left: -9999px;
    width: 800px;
    background: white;
    padding: 20px;
    font-family: Arial, sans-serif;
    color: #333;
  `;
  
  element.innerHTML = `
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="color: #FF6B35; font-size: 28px; margin: 0;">vitalCHECK ENTERPRISE HEALTH CHECK</h1>
      <h2 style="color: #666; font-size: 18px; margin: 10px 0 0 0;">${t.subtitle}</h2>
    </div>
    
    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
      <h3 style="margin: 0 0 15px 0; color: #333;">${t.companyName}</h3>
      <p style="margin: 5px 0;"><strong>${t.companyName}:</strong> ${user.companyName}</p>
      <p style="margin: 5px 0;"><strong>Secteur:</strong> ${user.sector}</p>
      <p style="margin: 5px 0;"><strong>Taille:</strong> ${user.companySize}</p>
      <p style="margin: 5px 0;"><strong>${t.assessmentDate}:</strong> ${new Date(completedAt).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}</p>
    </div>
    
    <div style="text-align: center; margin: 40px 0;">
      <div style="width: 150px; height: 150px; border-radius: 50%; background: ${overallColor}; color: white; display: inline-flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; margin-bottom: 20px;">
        ${overallScore}/100
      </div>
      <div style="font-size: 18px; color: ${overallColor}; font-weight: bold; margin-bottom: 10px;">${overallText}</div>
      <p style="color: #666; font-size: 14px;">
        ${language === 'fr' ? 
          `Votre entreprise est ${overallStatus === 'green' ? 'en bonne santé et bien positionnée pour la croissance' : 
            overallStatus === 'amber' ? 'en développement mais a besoin de renforcement dans certains domaines' : 
            'confrontée à des défis critiques qui nécessitent une attention immédiate'}.` :
          `Your enterprise is ${overallStatus === 'green' ? 'healthy and well-positioned for growth' : 
            overallStatus === 'amber' ? 'developing but needs strengthening in some areas' : 
            'facing critical challenges that require immediate attention'}.`
        }
      </p>
    </div>
    
    <h3 style="color: #FF6B35; border-bottom: 2px solid #FF6B35; padding-bottom: 10px;">${t.pillarScores}</h3>
    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
      <thead>
        <tr style="background: #f8f9fa;">
          <th style="padding: 12px; text-align: left; border-bottom: 1px solid #ddd;">Pillar</th>
          <th style="padding: 12px; text-align: left; border-bottom: 1px solid #ddd;">Score</th>
          <th style="padding: 12px; text-align: left; border-bottom: 1px solid #ddd;">Status</th>
        </tr>
      </thead>
      <tbody>
        ${pillarScores.map(pillar => `
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #ddd;">${pillar.pillarName}</td>
            <td style="padding: 12px; border-bottom: 1px solid #ddd;">${pillar.score}/100</td>
            <td style="padding: 12px; border-bottom: 1px solid #ddd;">
              <span style="padding: 4px 12px; border-radius: 20px; color: white; font-size: 12px; font-weight: bold; text-transform: uppercase; background: ${statusColors[pillar.status]};">${t.statusTexts[pillar.status]}</span>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    
    <div style="margin: 30px 0;">
      <h3 style="color: #FF6B35; border-bottom: 2px solid #FF6B35; padding-bottom: 10px;">Key Recommendations</h3>
      <ul style="list-style: none; padding: 0;">
        ${pillarScores.filter(p => p.recommendations && p.recommendations.length > 0)
          .flatMap(p => p.recommendations.slice(0, 2))
          .map(rec => `
            <li style="background: #f8f9fa; margin: 10px 0; padding: 15px; border-left: 4px solid #FF6B35; border-radius: 4px;">${rec}</li>
          `).join('')}
      </ul>
    </div>
    
    <div style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 30px; border-radius: 8px; text-align: center; margin: 30px 0;">
      <h3 style="margin-top: 0;">Unlock Your Full Enterprise Health Report</h3>
      <p>Get detailed insights, tailored recommendations, benchmarking against peers, and a consultation call with our experts.</p>
    </div>
    
    <div style="margin-top: 50px; padding: 20px; background: #f8f9fa; text-align: center; border-radius: 8px;">
      <p style="margin: 0;">This report was generated by vitalCHECK Enterprise Health Check</p>
      <p style="margin: 5px 0 0 0;">For more information, visit our website or contact our team</p>
    </div>
  `;
  
  return element;
};

// Fonction utilitaire pour générer un PDF simple
export const generateSimpleClientPDF = async (assessment) => {
  try {
    const { user, overallScore, overallStatus, pillarScores, completedAt, language = 'fr' } = assessment;
    
    const pdf = new jsPDF();
    
    // Titre
    pdf.setFontSize(20);
    pdf.setTextColor(255, 107, 53); // Orange
    pdf.text('vitalCHECK ENTERPRISE HEALTH CHECK', 20, 30);
    
    pdf.setFontSize(12);
    pdf.setTextColor(100, 100, 100);
    pdf.text('Rapport d\'auto-évaluation gratuit', 20, 40);
    
    // Informations de l'entreprise
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Informations de l\'entreprise:', 20, 60);
    
    pdf.setFontSize(10);
    pdf.text(`Nom: ${user.companyName}`, 20, 75);
    pdf.text(`Secteur: ${user.sector}`, 20, 85);
    pdf.text(`Taille: ${user.companySize}`, 20, 95);
    pdf.text(`Date: ${new Date(completedAt).toLocaleDateString('fr-FR')}`, 20, 105);
    
    // Score global
    pdf.setFontSize(16);
    pdf.text('Score Global:', 20, 130);
    
    const statusColors = {
      red: [239, 68, 68],
      amber: [245, 158, 11],
      green: [16, 185, 129]
    };
    
    const color = statusColors[overallStatus];
    pdf.setTextColor(color[0], color[1], color[2]);
    pdf.text(`${overallScore}/100`, 20, 145);
    
    // Tableau des piliers
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(12);
    pdf.text('Détail par piliers:', 20, 170);
    
    let y = 185;
    pillarScores.forEach((pillar, index) => {
      if (y > 250) {
        pdf.addPage();
        y = 20;
      }
      
      pdf.setFontSize(10);
      pdf.text(`${pillar.pillarName}: ${pillar.score}/100`, 20, y);
      y += 10;
    });
    
    // Footer
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    pdf.text('Généré par vitalCHECK Enterprise Health Check', 20, 280);
    pdf.text(new Date().toLocaleDateString('fr-FR'), 20, 285);
    
    // Télécharger
    const filename = `vitalCHECK-Health-Check-${user.companyName}-${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(filename);
    
    return true;
    
  } catch (error) {
    console.error('Simple client PDF generation error:', error);
    throw error;
  }
};
