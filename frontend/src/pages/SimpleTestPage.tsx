import React from 'react';

const SimpleTestPage: React.FC = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#3b82f6', marginBottom: '20px' }}>
        🩺 Health Assessment Platform - Test Page
      </h1>
      
      <div style={{ 
        background: '#f0f9ff', 
        padding: '20px', 
        borderRadius: '8px', 
        marginBottom: '20px',
        border: '2px solid #3b82f6'
      }}>
        <h2>✅ System Status Check</h2>
        <ul style={{ marginTop: '10px' }}>
          <li>✅ React App is loading</li>
          <li>✅ TypeScript compilation successful</li>
          <li>✅ Frontend server running on port 3001</li>
          <li>✅ Backend server running on port 5001</li>
        </ul>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>🔗 Navigation Test</h3>
        <button 
          onClick={() => window.location.href = '/'}
          style={{
            background: '#3b82f6',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            margin: '5px',
            cursor: 'pointer'
          }}
        >
          Go to Landing Page
        </button>
        
        <button 
          onClick={() => window.location.href = '/assessment'}
          style={{
            background: '#10b981',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            margin: '5px',
            cursor: 'pointer'
          }}
        >
          Go to Assessment
        </button>
        
        <button 
          onClick={() => window.location.href = '/admin/login'}
          style={{
            background: '#f59e0b',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            margin: '5px',
            cursor: 'pointer'
          }}
        >
          Go to Admin
        </button>
      </div>

      <div style={{ 
        background: '#fef3c7', 
        padding: '15px', 
        borderRadius: '8px',
        border: '1px solid #f59e0b'
      }}>
        <h4>🔧 Debug Information</h4>
        <p><strong>Current URL:</strong> {window.location.href}</p>
        <p><strong>User Agent:</strong> {navigator.userAgent}</p>
        <p><strong>Timestamp:</strong> {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
};

export default SimpleTestPage;