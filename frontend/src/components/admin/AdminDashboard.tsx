import React from 'react';
import AdminLayout from './AdminLayout';

const AdminDashboard: React.FC = () => {
  console.log('AdminDashboard rendering...');
  
  return (
    <AdminLayout currentPage="Dashboard">
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Welcome Section */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '20px',
          padding: '40px',
          marginBottom: '30px',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-20px',
            right: '-20px',
            width: '100px',
            height: '100px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '50%'
          }}></div>
          <div style={{
            position: 'absolute',
            bottom: '-30px',
            left: '-30px',
            width: '80px',
            height: '80px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '50%'
          }}></div>
          <h1 style={{ 
            fontSize: '32px', 
            fontWeight: '700', 
            marginBottom: '10px',
            margin: 0
          }}>
            Welcome back, Administrator! 👋
          </h1>
          <p style={{ 
            fontSize: '18px', 
            opacity: 0.9,
            margin: '10px 0 0 0'
          }}>
            Here's what's happening with your health assessment platform today.
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '40px' }}>
          <div style={{ 
            backgroundColor: 'white', 
            padding: '30px', 
            borderRadius: '16px', 
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: '1px solid #f1f5f9',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '0',
              left: '0',
              right: '0',
              height: '4px',
              background: 'linear-gradient(90deg, #3b82f6, #60a5fa)'
            }}></div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                backgroundColor: '#dbeafe',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                marginRight: '16px'
              }}>
                👥
              </div>
              <div>
                <h3 style={{ color: '#64748b', fontSize: '14px', fontWeight: '500', margin: 0 }}>Total Users</h3>
                <p style={{ fontSize: '32px', fontWeight: '700', color: '#1e293b', margin: '4px 0 0 0' }}>1,247</p>
              </div>
            </div>
            <div style={{ fontSize: '14px', color: '#10b981' }}>
              ↗️ +12% from last month
            </div>
          </div>

          <div style={{ 
            backgroundColor: 'white', 
            padding: '30px', 
            borderRadius: '16px', 
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: '1px solid #f1f5f9',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '0',
              left: '0',
              right: '0',
              height: '4px',
              background: 'linear-gradient(90deg, #10b981, #34d399)'
            }}></div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                backgroundColor: '#d1fae5',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                marginRight: '16px'
              }}>
                📋
              </div>
              <div>
                <h3 style={{ color: '#64748b', fontSize: '14px', fontWeight: '500', margin: 0 }}>Assessments</h3>
                <p style={{ fontSize: '32px', fontWeight: '700', color: '#1e293b', margin: '4px 0 0 0' }}>3,891</p>
              </div>
            </div>
            <div style={{ fontSize: '14px', color: '#10b981' }}>
              ↗️ +8% from last month
            </div>
          </div>

          <div style={{ 
            backgroundColor: 'white', 
            padding: '30px', 
            borderRadius: '16px', 
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: '1px solid #f1f5f9',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '0',
              left: '0',
              right: '0',
              height: '4px',
              background: 'linear-gradient(90deg, #8b5cf6, #a78bfa)'
            }}></div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                backgroundColor: '#f3e8ff',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                marginRight: '16px'
              }}>
                📈
              </div>
              <div>
                <h3 style={{ color: '#64748b', fontSize: '14px', fontWeight: '500', margin: 0 }}>Avg Health Score</h3>
                <p style={{ fontSize: '32px', fontWeight: '700', color: '#1e293b', margin: '4px 0 0 0' }}>78.5</p>
              </div>
            </div>
            <div style={{ fontSize: '14px', color: '#10b981' }}>
              ↗️ +3.2 points this month
            </div>
          </div>

          <div style={{ 
            backgroundColor: 'white', 
            padding: '30px', 
            borderRadius: '16px', 
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: '1px solid #f1f5f9',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '0',
              left: '0',
              right: '0',
              height: '4px',
              background: 'linear-gradient(90deg, #f59e0b, #fbbf24)'
            }}></div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                backgroundColor: '#fef3c7',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                marginRight: '16px'
              }}>
                ⚡
              </div>
              <div>
                <h3 style={{ color: '#64748b', fontSize: '14px', fontWeight: '500', margin: 0 }}>Active Today</h3>
                <p style={{ fontSize: '32px', fontWeight: '700', color: '#1e293b', margin: '4px 0 0 0' }}>342</p>
              </div>
            </div>
            <div style={{ fontSize: '14px', color: '#f59e0b' }}>
              ⏱️ Real-time data
            </div>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '40px' }}>
          <div 
            onClick={() => window.location.href = '/admin/users'}
            style={{ 
              backgroundColor: 'white', 
              padding: '30px', 
              borderRadius: '16px', 
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              cursor: 'pointer',
              border: '1px solid #f1f5f9',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{
                width: '56px',
                height: '56px',
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                color: 'white',
                marginRight: '16px'
              }}>
                👥
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', margin: 0 }}>User Management</h3>
                <p style={{ fontSize: '14px', color: '#64748b', margin: '4px 0 0 0' }}>Manage users and permissions</p>
              </div>
            </div>
            <div style={{ fontSize: '14px', color: '#3b82f6', fontWeight: '500' }}>
              View all users →
            </div>
          </div>

          <div 
            onClick={() => window.location.href = '/admin/assessments'}
            style={{ 
              backgroundColor: 'white', 
              padding: '30px', 
              borderRadius: '16px', 
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              cursor: 'pointer',
              border: '1px solid #f1f5f9',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{
                width: '56px',
                height: '56px',
                background: 'linear-gradient(135deg, #10b981, #047857)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                color: 'white',
                marginRight: '16px'
              }}>
                📋
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', margin: 0 }}>Health Assessments</h3>
                <p style={{ fontSize: '14px', color: '#64748b', margin: '4px 0 0 0' }}>Review patient assessments</p>
              </div>
            </div>
            <div style={{ fontSize: '14px', color: '#10b981', fontWeight: '500' }}>
              View assessments →
            </div>
          </div>

          <div 
            onClick={() => window.location.href = '/admin/reports'}
            style={{ 
              backgroundColor: 'white', 
              padding: '30px', 
              borderRadius: '16px', 
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              cursor: 'pointer',
              border: '1px solid #f1f5f9',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{
                width: '56px',
                height: '56px',
                background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                color: 'white',
                marginRight: '16px'
              }}>
                📊
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', margin: 0 }}>Analytics & Reports</h3>
                <p style={{ fontSize: '14px', color: '#64748b', margin: '4px 0 0 0' }}>Generate detailed reports</p>
              </div>
            </div>
            <div style={{ fontSize: '14px', color: '#8b5cf6', fontWeight: '500' }}>
              Create reports →
            </div>
          </div>

          <div 
            onClick={() => window.location.href = '/admin/settings'}
            style={{ 
              backgroundColor: 'white', 
              padding: '30px', 
              borderRadius: '16px', 
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              cursor: 'pointer',
              border: '1px solid #f1f5f9',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{
                width: '56px',
                height: '56px',
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                color: 'white',
                marginRight: '16px'
              }}>
                ⚙️
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', margin: 0 }}>System Settings</h3>
                <p style={{ fontSize: '14px', color: '#64748b', margin: '4px 0 0 0' }}>Configure platform settings</p>
              </div>
            </div>
            <div style={{ fontSize: '14px', color: '#f59e0b', fontWeight: '500' }}>
              Open settings →
            </div>
          </div>
        </div>

        {/* Recent Activity & Quick Links */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          {/* Recent Activity */}
          <div style={{ 
            backgroundColor: 'white', 
            padding: '30px', 
            borderRadius: '16px', 
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: '1px solid #f1f5f9'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b', marginBottom: '20px', margin: '0 0 20px 0' }}>
              Recent Activity
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { icon: '👤', text: 'New user registered: John Doe', time: '5 minutes ago', color: '#3b82f6' },
                { icon: '📋', text: 'Health assessment completed by Jane Smith', time: '12 minutes ago', color: '#10b981' },
                { icon: '⚠️', text: 'High-risk assessment flagged for review', time: '1 hour ago', color: '#ef4444' },
                { icon: '📊', text: 'Monthly report generated successfully', time: '2 hours ago', color: '#8b5cf6' },
                { icon: '🔧', text: 'System maintenance completed', time: '1 day ago', color: '#6b7280' }
              ].map((activity, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', padding: '12px 0', borderBottom: index < 4 ? '1px solid #f1f5f9' : 'none' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: `${activity.color}15`,
                    color: activity.color,
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    marginRight: '16px'
                  }}>
                    {activity.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: '500', color: '#1e293b' }}>{activity.text}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div style={{ 
            backgroundColor: 'white', 
            padding: '30px', 
            borderRadius: '16px', 
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: '1px solid #f1f5f9'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b', marginBottom: '20px', margin: '0 0 20px 0' }}>
              Quick Links
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                onClick={() => window.location.href = '/'}
                style={{
                  padding: '16px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#1e293b',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f1f5f9';
                  e.currentTarget.style.borderColor = '#cbd5e1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }}
              >
                🌐 View Public Website
              </button>
              
              <button
                onClick={() => window.location.href = '/assessment'}
                style={{
                  padding: '16px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#1e293b',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f1f5f9';
                  e.currentTarget.style.borderColor = '#cbd5e1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }}
              >
                🩺 Test Assessment Tool
              </button>

              <div style={{
                padding: '16px',
                backgroundColor: '#dcfce7',
                border: '1px solid #bbf7d0',
                borderRadius: '12px',
                fontSize: '14px'
              }}>
                <div style={{ fontWeight: '600', color: '#166534', marginBottom: '8px' }}>✅ System Status</div>
                <div style={{ fontSize: '12px', color: '#15803d' }}>All services operational</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;