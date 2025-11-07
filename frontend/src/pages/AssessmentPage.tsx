import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { addMessage, setTyping, setCurrentStep, updateUserProfile } from '../store/slices/chatSlice';
import ChatInterface from '../components/assessment/ChatInterface';
import ProgressBar from '../components/assessment/ProgressBar';
import HealthDataForm from '../components/assessment/HealthDataForm';
import LifestyleForm from '../components/assessment/LifestyleForm';
import ResultsView from '../components/assessment/ResultsView';

const AssessmentPage: React.FC = () => {
  const dispatch = useDispatch();
  const { currentStep, userProfile, isAssessmentComplete } = useSelector((state: RootState) => state.chat);
  const [assessmentData, setAssessmentData] = useState({
    personalInfo: {},
    bloodWork: {},
    lifestyle: {},
    mentalHealth: {}
  });

  const steps = [
    { id: 'welcome', title: 'Welcome', description: 'AI Health Assessment Introduction' },
    { id: 'personal', title: 'Personal Info', description: 'Basic information about you' },
    { id: 'bloodwork', title: 'Health Data', description: 'Blood work and lab results' },
    { id: 'lifestyle', title: 'Lifestyle', description: 'Diet, exercise, and habits' },
    { id: 'mental', title: 'Mental Health', description: 'Mood, stress, and wellbeing' },
    { id: 'analysis', title: 'AI Analysis', description: 'Processing your data' },
    { id: 'results', title: 'Results', description: 'Your personalized health insights' }
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  useEffect(() => {
    // Initialize with welcome message
    if (currentStep === 'welcome') {
      dispatch(addMessage({
        type: 'bot',
        content: `Welcome to your AI Health Assessment! 🌟\n\nI'm your personal health assistant, and I'll guide you through a comprehensive evaluation of your health profile. This assessment will take about 10-15 minutes and will help us provide you with:\n\n✨ Personalized health insights\n🩺 AI-powered recommendations\n💊 Supplement suggestions\n📋 Professional health report\n\nLet's start with some basic information about you. What's your name?`
      }));
      dispatch(setCurrentStep('personal'));
    }
  }, [dispatch, currentStep]);

  const handlePersonalInfoSubmit = (data: any) => {
    dispatch(updateUserProfile(data));
    setAssessmentData(prev => ({ ...prev, personalInfo: data }));
    dispatch(setCurrentStep('bloodwork'));
    
    dispatch(addMessage({
      type: 'bot',
      content: `Great to meet you, ${data.name}! 👋\n\nNow let's gather your health data. You can either:\n\n📤 Upload your lab reports (I'll extract the data automatically)\n✍️ Enter your blood work values manually\n\nThis information helps me provide accurate health insights. Don't worry if you don't have all values - we'll work with what you have!`
    }));
  };

  const handleBloodWorkSubmit = (data: any) => {
    setAssessmentData(prev => ({ ...prev, bloodWork: data }));
    dispatch(setCurrentStep('lifestyle'));
    
    dispatch(addMessage({
      type: 'bot',
      content: `Excellent! I've recorded your health data. 📊\n\nNow let's talk about your lifestyle. Your daily habits play a huge role in your overall health and can significantly impact your biomarkers.\n\nI'll ask about:\n🍎 Diet and nutrition\n🏃‍♂️ Exercise and activity\n😴 Sleep patterns\n🧘‍♀️ Stress management\n\nLet's start with your diet - how would you describe your eating habits?`
    }));
  };

  const handleLifestyleSubmit = (data: any) => {
    setAssessmentData(prev => ({ ...prev, lifestyle: data }));
    dispatch(setCurrentStep('mental'));
    
    dispatch(addMessage({
      type: 'bot',
      content: `Thank you for sharing your lifestyle information! 🌱\n\nNow, let's discuss your mental health and wellbeing. Mental health is just as important as physical health and can significantly impact your biomarkers and overall wellness.\n\nI'll ask about:\n😊 Overall mood and energy\n😰 Stress levels and sources\n🧠 Cognitive function\n😴 Sleep quality\n\nHow would you rate your overall mood and energy levels lately?`
    }));
  };

  const handleMentalHealthSubmit = (data: any) => {
    setAssessmentData(prev => ({ ...prev, mentalHealth: data }));
    dispatch(setCurrentStep('analysis'));
    
    dispatch(addMessage({
      type: 'bot',
      content: `Perfect! I now have all the information I need. 🧬\n\nI'm analyzing your complete health profile using advanced AI algorithms. This includes:\n\n🔬 Your biomarker analysis\n🥗 Lifestyle factor correlations\n🧠 Mental health impact assessment\n💊 Personalized recommendations\n\nThis will take just a moment...`
    }));

    // Simulate AI analysis
    setTimeout(() => {
      dispatch(setCurrentStep('results'));
      dispatch(addMessage({
        type: 'bot',
        content: `🎉 Your AI Health Assessment is complete!\n\nI've generated a comprehensive analysis of your health profile with personalized recommendations. You can view your detailed report below, which includes:\n\n📊 Health score breakdown\n⚠️ Risk factor analysis\n💊 Supplement recommendations\n🎯 Lifestyle optimization tips\n📋 Professional summary for your doctor\n\nWould you like me to explain any specific part of your results?`
      }));
    }, 3000);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'personal':
        return <HealthDataForm onSubmit={handlePersonalInfoSubmit} type="personal" />;
      case 'bloodwork':
        return <HealthDataForm onSubmit={handleBloodWorkSubmit} type="bloodwork" />;
      case 'lifestyle':
        return <LifestyleForm onSubmit={handleLifestyleSubmit} />;
      case 'mental':
        return <HealthDataForm onSubmit={handleMentalHealthSubmit} type="mental" />;
      case 'analysis':
        return (
          <div className="flex flex-col items-center justify-center p-8">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-700">Analyzing Your Health Data...</h3>
            <p className="text-gray-500 text-center mt-2">Our AI is processing your information to generate personalized insights</p>
          </div>
        );
      case 'results':
        return (
          <ResultsView 
            assessmentData={assessmentData}
            aiRecommendations="AI recommendations based on your health data..."
            onGenerateReport={() => console.log('Generate report')}
            onStartNewAssessment={() => dispatch(setCurrentStep('welcome'))}
          />
        );
      default:
        return <ChatInterface />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              AI Health Assessment
            </span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Get personalized health insights powered by advanced AI analysis
          </p>
        </div>

        {/* Progress Bar */}
        <ProgressBar steps={steps} currentStep={currentStepIndex} />

        {/* Main Content */}
        <div className="max-w-7xl mx-auto mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Chat Interface */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden h-full">
                <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-3">
                      <span className="text-lg font-bold">AI</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Health Assessment Assistant</h3>
                      <p className="text-sm text-purple-100">Powered by advanced AI</p>
                    </div>
                  </div>
                </div>
                
                <div className="h-96 overflow-y-auto">
                  <ChatInterface />
                </div>
              </div>
            </div>

            {/* Form/Step Content */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 h-full">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  {steps[currentStepIndex]?.title || 'Assessment'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {steps[currentStepIndex]?.description || 'Complete your health assessment'}
                </p>
                
                <div className="flex-1">
                  {renderCurrentStep()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentPage;