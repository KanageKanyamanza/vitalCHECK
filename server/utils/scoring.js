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

// Generate recommendations based on pillar scores and specific answers
function generateRecommendations(answers, pillarScores, questionsData) {
  const recommendations = [];

  pillarScores.forEach((pillar, index) => {
    const pillarData = questionsData.pillars[index];
    let selectedRecommendations = [];

    // 1. Look for specific recommendations based on answers in this pillar
    pillarData.questions.forEach(question => {
      const answer = answers.find(a => a.questionId === question.id);
      if (answer) {
        // Find the selected option
        const selectedOption = question.options.find(opt => opt.score === answer.answer);
        
        // If the option has a specific recommendation, add it
        if (selectedOption && selectedOption.recommendation) {
          selectedRecommendations.push(selectedOption.recommendation);
        }
      }
    });

    // 2. If we don't have enough specific recommendations, add from the pillar pool
    const pillarPool = pillarData.recommendations[pillar.status] || [];
    const remainingCount = 2 - selectedRecommendations.length;

    if (remainingCount > 0 && pillarPool.length > 0) {
      const additionalRecs = pillarPool
        .filter(rec => !selectedRecommendations.includes(rec))
        .sort(() => 0.5 - Math.random())
        .slice(0, remainingCount);
      
      selectedRecommendations = [...selectedRecommendations, ...additionalRecs];
    }

    // Ensure we have at least some recommendations, and limit to 2
    if (selectedRecommendations.length === 0 && pillarPool.length > 0) {
      selectedRecommendations = pillarPool.slice(0, 2);
    }

    recommendations.push(selectedRecommendations.slice(0, 2));
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
