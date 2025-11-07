import React, { useState, useEffect } from 'react';

interface ResultsViewProps {
  assessmentData: any;
  aiRecommendations: string;
  onGenerateReport: () => void;
  onStartNewAssessment: () => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({ 
  assessmentData, 
  aiRecommendations, 
  onGenerateReport, 
  onStartNewAssessment 
}) => {
  const [healthScore, setHealthScore] = useState(0);
  const [riskFactors, setRiskFactors] = useState<string[]>([]);
  const [strengths, setStrengths] = useState<string[]>([]);

  useEffect(() => {
    // Calculate health score based on assessment data
    calculateHealthScore();
    identifyRiskFactors();
    identifyStrengths();
  }, [assessmentData]);

  const calculateHealthScore = () => {
    let score = 70; // Base score

    // BMI assessment
    if (assessmentData.personal) {
      const { height, weight } = assessmentData.personal;
      if (height && weight) {
        const bmi = (weight / ((height / 100) ** 2));
        if (bmi >= 18.5 && bmi <= 24.9) score += 10;
        else if (bmi >= 25 && bmi <= 29.9) score -= 5;
        else score -= 15;
      }
    }

    // Exercise assessment
    if (assessmentData.lifestyle?.exercise) {
      const { frequency, duration } = assessmentData.lifestyle.exercise;
      if (frequency === 'daily' || frequency === '5-6_times') score += 15;
      else if (frequency === '3-4_times') score += 10;
      else if (frequency === '1-2_times') score += 5;
      else score -= 10;

      if (duration >= 30) score += 5;
    }

    // Smoking/alcohol assessment
    if (assessmentData.lifestyle?.habits) {
      const { smoking, alcohol } = assessmentData.lifestyle.habits;
      if (smoking === 'current') score -= 20;
      else if (smoking === 'former') score -= 5;
      
      if (alcohol === 'daily') score -= 10;
      else if (alcohol === 'weekly') score -= 5;
    }

    // Mental health assessment
    if (assessmentData.mental) {
      const { mood, stressLevel, sleepQuality } = assessmentData.mental;
      if (mood === 'excellent' || mood === 'good') score += 10;
      else if (mood === 'poor' || mood === 'very_poor') score -= 15;

      if (stressLevel === 'low') score += 5;
      else if (stressLevel === 'high' || stressLevel === 'very_high') score -= 10;

      if (sleepQuality === 'excellent' || sleepQuality === 'good') score += 5;
      else if (sleepQuality === 'poor') score -= 10;
    }

    setHealthScore(Math.max(0, Math.min(100, score)));
  };

  const identifyRiskFactors = () => {
    const factors: string[] = [];

    // Check bloodwork if available
    if (assessmentData.bloodwork) {
      const { totalCholesterol, ldlCholesterol, fastingGlucose, hba1c } = assessmentData.bloodwork;
      if (totalCholesterol > 240) factors.push('High cholesterol');
      if (ldlCholesterol > 160) factors.push('High LDL cholesterol');
      if (fastingGlucose > 125) factors.push('Elevated blood sugar');
      if (hba1c > 6.5) factors.push('Poor diabetes control');
    }

    // Check lifestyle factors
    if (assessmentData.lifestyle?.habits?.smoking === 'current') {
      factors.push('Current smoking');
    }
    if (assessmentData.lifestyle?.exercise?.frequency === 'rarely' || 
        assessmentData.lifestyle?.exercise?.frequency === 'never') {
      factors.push('Sedentary lifestyle');
    }
    if (assessmentData.mental?.stressLevel === 'high' || 
        assessmentData.mental?.stressLevel === 'very_high') {
      factors.push('High stress levels');
    }

    setRiskFactors(factors);
  };

  const identifyStrengths = () => {
    const positives: string[] = [];

    if (assessmentData.lifestyle?.exercise?.frequency === 'daily' || 
        assessmentData.lifestyle?.exercise?.frequency === '5-6_times') {
      positives.push('Regular exercise routine');
    }
    if (assessmentData.lifestyle?.habits?.smoking === 'never') {
      positives.push('Non-smoker');
    }
    if (assessmentData.mental?.sleepQuality === 'excellent' || 
        assessmentData.mental?.sleepQuality === 'good') {
      positives.push('Good sleep quality');
    }
    if (assessmentData.lifestyle?.diet?.waterIntake >= 8) {
      positives.push('Adequate hydration');
    }

    setStrengths(positives);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-green-500 to-green-600';
    if (score >= 60) return 'from-yellow-500 to-yellow-600';
    return 'from-red-500 to-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Health Score */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Health Score</h2>
        <div className={`text-6xl font-bold mb-2 ${getScoreColor(healthScore)}`}>
          {healthScore}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
          <div 
            className={`h-4 rounded-full bg-gradient-to-r ${getScoreGradient(healthScore)} transition-all duration-1000`}
            style={{ width: `${healthScore}%` }}
          ></div>
        </div>
        <p className="text-gray-600">
          {healthScore >= 80 && "Excellent! Your health is in great shape."}
          {healthScore >= 60 && healthScore < 80 && "Good health with room for improvement."}
          {healthScore < 60 && "Consider making some lifestyle changes for better health."}
        </p>
      </div>

      {/* Risk Factors */}
      {riskFactors.length > 0 && (
        <div className="bg-red-50 p-6 rounded-lg border border-red-200">
          <h3 className="text-lg font-semibold text-red-800 mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Risk Factors to Address
          </h3>
          <ul className="space-y-2">
            {riskFactors.map((factor, index) => (
              <li key={index} className="flex items-center text-red-700">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                {factor}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Strengths */}
      {strengths.length > 0 && (
        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <h3 className="text-lg font-semibold text-green-800 mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Your Health Strengths
          </h3>
          <ul className="space-y-2">
            {strengths.map((strength, index) => (
              <li key={index} className="flex items-center text-green-700">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                {strength}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* AI Recommendations */}
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          AI-Powered Recommendations
        </h3>
        <div className="text-blue-800 whitespace-pre-wrap">
          {aiRecommendations || 'Generating personalized recommendations...'}
        </div>
      </div>

      {/* Key Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {assessmentData.personal ? 
              Math.round((assessmentData.personal.weight / ((assessmentData.personal.height / 100) ** 2)) * 10) / 10 : 
              'N/A'
            }
          </div>
          <div className="text-sm text-gray-600">BMI</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {assessmentData.lifestyle?.exercise?.frequency || 'Not specified'}
          </div>
          <div className="text-sm text-gray-600">Exercise Frequency</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <div className="text-2xl font-bold text-green-600">
            {assessmentData.mental?.sleepQuality || 'Not specified'}
          </div>
          <div className="text-sm text-gray-600">Sleep Quality</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={onGenerateReport}
          className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200 font-medium flex items-center justify-center"
        >
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
          </svg>
          Download PDF Report
        </button>
        
        <button
          onClick={onStartNewAssessment}
          className="flex-1 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-200 font-medium flex items-center justify-center"
        >
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
          Take New Assessment
        </button>
      </div>
    </div>
  );
};

export default ResultsView;