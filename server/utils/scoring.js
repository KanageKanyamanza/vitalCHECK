const questionsData = require('../data/questions');

// Calculate scores for all pillars and overall score
function calculateScores(answers, questionsData) {
  const pillarScores = [];
  let totalScore = 0;

  questionsData.pillars.forEach((pillar, pillarIndex) => {
    let pillarTotal = 0;
    let questionCount = 0;

    pillar.questions.forEach((question, questionIndex) => {
      const answer = answers.find(a => a.questionId === question.id);
      if (answer) {
        pillarTotal += answer.answer;
        questionCount++;
      }
    });

    // Calculate pillar score (average * 25 to get 0-100 scale)
    const pillarScore = questionCount > 0 ? Math.round((pillarTotal / questionCount) * 25) : 0;
    
    // Determine status based on score
    let status = 'red';
    if (pillarScore >= 70) status = 'green';
    else if (pillarScore >= 40) status = 'amber';

    pillarScores.push({
      score: pillarScore,
      status: status
    });

    totalScore += pillarScore;
  });

  // Calculate overall score
  const overallScore = Math.round(totalScore / pillarScores.length);
  
  // Determine overall status
  let overallStatus = 'red';
  if (overallScore >= 70) overallStatus = 'green';
  else if (overallScore >= 40) overallStatus = 'amber';

  return {
    pillarScores,
    overallScore,
    overallStatus
  };
}

// Generate recommendations based on pillar scores
function generateRecommendations(pillarScores, questionsData) {
  const recommendations = [];

  pillarScores.forEach((pillar, index) => {
    const pillarData = questionsData.pillars[index];
    const pillarRecommendations = pillarData.recommendations[pillar.status];
    
    // Select 2-3 random recommendations for freemium version
    const selectedRecommendations = pillarRecommendations
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.min(3, pillarRecommendations.length));

    recommendations.push(selectedRecommendations);
  });

  return recommendations;
}

// Get status color for UI
function getStatusColor(status) {
  const colors = {
    red: '#EF4444',    // Red-500
    amber: '#F59E0B',  // Amber-500
    green: '#10B981'   // Emerald-500
  };
  return colors[status] || colors.amber;
}

// Get status text for UI
function getStatusText(status) {
  const texts = {
    red: 'Critical',
    amber: 'Needs Improvement',
    green: 'Healthy'
  };
  return texts[status] || 'Unknown';
}

module.exports = {
  calculateScores,
  generateRecommendations,
  getStatusColor,
  getStatusText
};
