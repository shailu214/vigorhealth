import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleStartAssessment = () => {
    console.log('🔥 Start Assessment clicked - Button is working!');
    const gdprConsent = localStorage.getItem('gdprConsent');
    console.log('📋 Current GDPR consent:', gdprConsent);
    
    if (!gdprConsent) {
      // Set GDPR consent for demo purposes
      const consent = {
        consentGiven: true,
        consentDate: new Date().toISOString(),
        version: '1.0'
      };
      localStorage.setItem('gdprConsent', JSON.stringify(consent));
      console.log('✅ GDPR consent automatically granted for demo');
    }
    
    console.log('🚀 Navigating to /assessment...');
    navigate('/assessment');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header onStartAssessment={handleStartAssessment} />
      
      {/* Main Content with top padding for fixed header */}
      <main className="medical-main-content">
        <div className="min-h-screen medical-bg-primary" id="home">
          {/* Hero Section */}
          <section className="relative overflow-hidden pt-20 pb-32">
            {/* Medical-themed background elements */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-medical-blue rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
            <div className="absolute top-40 right-10 w-72 h-72 bg-medical-teal rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-2000"></div>
            <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-medical-mint rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
            
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
                  🏥 Your Personal
                  <span className="block medical-gradient-text">
                    Health AI Assistant
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Transform your health journey with AI-powered insights. Get personalized recommendations, 
              comprehensive analysis, and actionable health strategies tailored just for you.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button
                onClick={handleStartAssessment}
                className="px-12 py-4 text-xl font-semibold rounded-xl bg-medical-blue text-white hover:bg-medical-teal transition-all duration-300 transform hover:scale-105 medical-glow-blue hover:medical-glow-teal"
              >
                🩺 Start Your Health Assessment
              </button>
              
              <button
                onClick={() => console.log('Demo clicked')}
                className="group px-8 py-4 text-xl font-semibold text-medical-blue bg-white/90 backdrop-blur-sm border-2 border-medical-blue/30 rounded-xl hover:border-medical-teal hover:bg-medical-blue/5 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                � Watch Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white/80 backdrop-blur-sm" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              <span className="medical-gradient-text">Medical-Grade AI</span> Health Platform
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Experience professional healthcare technology with our advanced AI system designed by medical professionals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: '🧠', title: 'AI-Powered Analysis', description: 'Advanced AI analyzes your health data for personalized insights and recommendations.', color: 'medical-blue' },
              { icon: '📊', title: 'Blood Work Analysis', description: 'Upload lab reports or enter data manually for comprehensive analysis.', color: 'medical-teal' },
              { icon: '🏃‍♂️', title: 'Lifestyle Assessment', description: 'Complete health evaluation including diet, exercise, and lifestyle factors.', color: 'medical-mint' },
              { icon: '💊', title: 'Supplement Recommendations', description: 'Get personalized supplement suggestions based on your health profile.', color: 'medical-lavender' },
              { icon: '📋', title: 'Professional Reports', description: 'Detailed reports you can share with healthcare professionals.', color: 'medical-sage' },
              { icon: '🔒', title: 'HIPAA Compliant', description: 'Your data is secure, encrypted, and follows medical privacy standards.', color: 'medical-blue' },
            ].map((feature, index) => (
              <div
                key={index}
                className={`bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105 transform hover:bg-${feature.color}/5 hover:border-${feature.color}/30`}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className={`text-xl font-semibold text-gray-900 mb-2`}>{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 medical-bg-section relative overflow-hidden" id="how-it-works">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How Our <span className="medical-gradient-text">Medical AI</span> Works
            </h2>
            <p className="text-xl text-gray-700">
              Four simple steps to unlock your personalized health insights
            </p>
          </div>

          <div className="relative">
            {/* Process Flow Line - Hidden on mobile */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-medical-blue via-medical-teal to-medical-mint transform -translate-y-1/2 z-0"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
              {[
                { step: '1', title: 'Medical Profile', description: 'Share your health information and medical history', icon: '👤', color: 'bg-medical-blue', glow: 'medical-glow-blue' },
                { step: '2', title: 'Lab Data Upload', description: 'Upload medical reports or enter lab values manually', icon: '📊', color: 'bg-medical-teal', glow: 'medical-glow-teal' },
                { step: '3', title: 'Health Assessment', description: 'Complete our comprehensive medical questionnaire', icon: '🩺', color: 'bg-medical-mint', glow: 'medical-glow-mint' },
                { step: '4', title: 'AI Medical Analysis', description: 'Get professional health insights and recommendations', icon: '🧠', color: 'bg-medical-lavender', glow: 'medical-glow-blue' },
              ].map((item, index) => (
                <div key={index} className="text-center group medical-step-card">
                  <div className="relative mb-6">
                    <div className={`medical-step-number w-20 h-20 ${item.color} rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110 ${item.glow}`}>
                      {item.step}
                    </div>
                    <div className="medical-step-icon">{item.icon}</div>
                    
                    {/* Process Arrow - Hidden on last item and mobile */}
                    {index < 3 && (
                      <div className="hidden lg:block absolute top-1/2 -right-12 transform -translate-y-1/2">
                        <div className="w-8 h-0.5 bg-medical-teal"></div>
                        <div className="absolute -right-2 -top-1.5 w-0 h-0 border-l-4 border-l-medical-teal border-t-2 border-b-2 border-t-transparent border-b-transparent"></div>
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-700 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 medical-bg-cta relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Ready to Transform Your Health?
          </h2>
          <p className="text-xl md:text-2xl text-blue-100 mb-12 leading-relaxed">
            Join thousands of patients who trust our medical-grade AI for their health insights.
          </p>
          <button
            onClick={handleStartAssessment}
            className="px-12 py-4 text-xl font-semibold text-medical-blue bg-white border-2 border-white rounded-xl hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl medical-glow-blue"
          >
            🩺 Start Medical Assessment Now
          </button>
        </div>
      </section>
        </div>
      </main>

      {/* Footer */}
      <Footer onStartAssessment={handleStartAssessment} />
    </div>
  );
};

export default LandingPage;