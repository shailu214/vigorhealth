import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import LandingPage from './pages/LandingPage';
import TestPage from './pages/TestPage';
import AssessmentPage from './pages/AssessmentPage';
import SimpleTestPage from './pages/SimpleTestPage';
import AdminLogin from './components/admin/AdminLogin';
import AdminRouter from './components/admin/AdminRouter';
import ChatWidget from './components/chat/ChatWidget';
// import GDPRModal from './components/modals/GDPRModal';
import './App.css';

function App() {
  React.useEffect(() => {
    // Check GDPR consent
    const gdprConsent = localStorage.getItem('gdprConsent');
    if (!gdprConsent) {
      // Auto-grant GDPR consent for demo purposes
      const consent = {
        consentGiven: true,
        consentDate: new Date().toISOString(),
        version: '1.0'
      };
      localStorage.setItem('gdprConsent', JSON.stringify(consent));
    }
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <div className="App min-h-screen bg-gray-50">
          <Routes>
            <Route path="/simple-test" element={<SimpleTestPage />} />
            <Route path="/test" element={<TestPage />} />
            <Route path="/" element={<LandingPage />} />
            <Route path="/assessment" element={<AssessmentPage />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/*" element={<AdminRouter />} />
            <Route path="/admin-test" element={
              <div className="min-h-screen bg-gray-100 p-8">
                <h1 className="text-4xl font-bold text-center text-blue-600">Admin Test Page</h1>
                <p className="text-center mt-4">This is a test admin page to check routing.</p>
                <div className="text-center mt-8">
                  <button 
                    onClick={() => window.location.href = '/admin/login'}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Go to Admin Login
                  </button>
                </div>
              </div>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          {/* Chat Widget - Available on assessment page */}
          <ChatWidget />
        </div>

        {/* GDPR Modal - Outside main container to ensure proper z-index */}
        {/* Temporarily disabled to debug blank page issue */}
        {/* <GDPRModal 
          isOpen={showGDPRModal} 
          onClose={() => setShowGDPRModal(false)} 
        /> */}
      </Router>
    </Provider>
  );
}

export default App;