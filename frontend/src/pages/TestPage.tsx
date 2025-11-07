import React from 'react';

const TestPage: React.FC = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontFamily: 'system-ui'
    }}>
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
          🎉 React App is Working!
        </h1>
        <p style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>
          If you see this, the frontend is successfully running.
        </p>
        <button 
          onClick={() => window.location.href = '/'}
          style={{
            padding: '1rem 2rem',
            fontSize: '1.2rem',
            background: 'white',
            color: '#667eea',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Go to Landing Page
        </button>
      </div>
    </div>
  );
};

export default TestPage;