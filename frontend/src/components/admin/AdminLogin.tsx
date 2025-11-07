import React, { useState } from 'react';

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const handleLogin = () => {
    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem('adminToken', 'demo-token-' + Date.now());
      window.location.hash = '#/admin';
    } else {
      setError('Invalid credentials! Use admin/admin123');
    }
  };
  
  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <h1 style={{ color: 'blue', textAlign: 'center' }}>Admin Login Page</h1>
      <div style={{ maxWidth: '400px', margin: '0 auto', backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
        <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
          <div style={{ marginBottom: '15px' }}>
            <label>Username:</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }} 
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label>Password:</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }} 
            />
          </div>
          {error && (
            <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#ffebee', color: 'red', borderRadius: '4px' }}>
              {error}
            </div>
          )}
          <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: 'blue', color: 'white', border: 'none', borderRadius: '4px' }}>
            Login
          </button>
        </form>
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#e3f2fd', borderRadius: '4px' }}>
          <strong>Demo Credentials:</strong><br />
          Username: admin<br />
          Password: admin123
        </div>
        <div style={{ marginTop: '15px', textAlign: 'center' }}>
          <button 
            onClick={() => window.location.href = '/'}
            style={{ padding: '8px 16px', backgroundColor: '#gray', color: 'black', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;