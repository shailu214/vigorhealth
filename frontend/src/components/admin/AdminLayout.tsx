import React, { useState } from 'react';

interface AdminLayoutProps {
  children: React.ReactNode;
  currentPage?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, currentPage = 'Dashboard' }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '🏠',
      path: '/admin',
      active: currentPage === 'Dashboard'
    },
    {
      id: 'users',
      label: 'User Management',
      icon: '👥',
      path: '/admin/users',
      active: currentPage === 'Users'
    },
    {
      id: 'assessments',
      label: 'Assessments',
      icon: '📋',
      path: '/admin/assessments',
      active: currentPage === 'Assessments'
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: '📊',
      path: '/admin/reports',
      active: currentPage === 'Reports'
    },
    {
      id: 'api-config',
      label: 'API Configuration',
      icon: '🤖',
      path: '/admin/api-config',
      active: currentPage === 'API Configuration'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: '⚙️',
      path: '/admin/settings',
      active: currentPage === 'Settings'
    }
  ];

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('adminToken');
      window.location.href = '/admin/login';
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Sidebar */}
      <div style={{
        width: sidebarCollapsed ? '70px' : '280px',
        backgroundColor: '#1e293b',
        color: 'white',
        transition: 'width 0.3s ease',
        position: 'relative',
        boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
        zIndex: 1000
      }}>
        {/* Logo Section */}
        <div style={{
          padding: sidebarCollapsed ? '20px 10px' : '20px 24px',
          borderBottom: '1px solid #334155',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            backgroundColor: '#3b82f6',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            flexShrink: 0
          }}>
            🏥
          </div>
          {!sidebarCollapsed && (
            <div>
              <h2 style={{ 
                margin: 0, 
                fontSize: '18px', 
                fontWeight: '700',
                color: 'white'
              }}>
                Health Admin
              </h2>
              <p style={{ 
                margin: 0, 
                fontSize: '12px', 
                color: '#94a3b8' 
              }}>
                Management Panel
              </p>
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <nav style={{ padding: '20px 0' }}>
          {menuItems.map((item) => (
            <div
              key={item.id}
                                    onClick={() => window.location.hash = item.path}
              style={{
                padding: sidebarCollapsed ? '12px 0' : '12px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                backgroundColor: item.active ? '#3b82f6' : 'transparent',
                borderRight: item.active ? '3px solid #60a5fa' : '3px solid transparent',
                transition: 'all 0.2s ease',
                justifyContent: sidebarCollapsed ? 'center' : 'flex-start'
              }}
              onMouseEnter={(e) => {
                if (!item.active) {
                  e.currentTarget.style.backgroundColor = '#334155';
                }
              }}
              onMouseLeave={(e) => {
                if (!item.active) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <span style={{ 
                fontSize: '18px',
                minWidth: '18px',
                textAlign: 'center'
              }}>
                {item.icon}
              </span>
              {!sidebarCollapsed && (
                <span style={{ 
                  fontSize: '14px',
                  fontWeight: item.active ? '600' : '400'
                }}>
                  {item.label}
                </span>
              )}
            </div>
          ))}
        </nav>

        {/* Sidebar Toggle */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          style={{
            position: 'absolute',
            top: '50%',
            right: '-12px',
            transform: 'translateY(-50%)',
            width: '24px',
            height: '24px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
          }}
        >
          {sidebarCollapsed ? '→' : '←'}
        </button>
      </div>

      {/* Main Content Area */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        minHeight: '100vh'
      }}>
        {/* Header */}
        <header style={{
          backgroundColor: 'white',
          padding: '16px 32px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          position: 'sticky',
          top: 0,
          zIndex: 999
        }}>
          <div>
            <h1 style={{ 
              margin: 0, 
              fontSize: '24px', 
              fontWeight: '700',
              color: '#1e293b'
            }}>
              {currentPage}
            </h1>
            <p style={{ 
              margin: 0, 
              fontSize: '14px', 
              color: '#64748b',
              marginTop: '4px'
            }}>
              Welcome to the admin panel
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {/* Notifications */}
            <button style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#f1f5f9',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              🔔
              <span style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                width: '8px',
                height: '8px',
                backgroundColor: '#ef4444',
                borderRadius: '50%',
                border: '2px solid white'
              }}></span>
            </button>

            {/* User Profile Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '8px 16px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#1e293b'
                }}
              >
                <div style={{
                  width: '36px',
                  height: '36px',
                  backgroundColor: '#3b82f6',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600'
                }}>
                  👤
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div>Administrator</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>admin@health.com</div>
                </div>
                <span style={{ color: '#64748b', fontSize: '12px' }}>
                  {userDropdownOpen ? '▲' : '▼'}
                </span>
              </button>

              {/* Dropdown Menu */}
              {userDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '8px',
                  width: '220px',
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                  zIndex: 1000,
                  overflow: 'hidden'
                }}>
                  <div style={{ padding: '16px', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ fontWeight: '600', fontSize: '14px' }}>Administrator</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>admin@health.com</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                      Last login: {new Date().toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div style={{ padding: '8px 0' }}>
                    <button
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        textAlign: 'left',
                        border: 'none',
                        backgroundColor: 'transparent',
                        cursor: 'pointer',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      👤 Profile Settings
                    </button>
                    
                    <button
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        textAlign: 'left',
                        border: 'none',
                        backgroundColor: 'transparent',
                        cursor: 'pointer',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      🔐 Security
                    </button>
                    
                    <button
                      onClick={() => window.location.href = '/'}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        textAlign: 'left',
                        border: 'none',
                        backgroundColor: 'transparent',
                        cursor: 'pointer',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      🌐 View Website
                    </button>
                  </div>
                  
                  <div style={{ padding: '8px 0', borderTop: '1px solid #f1f5f9' }}>
                    <button
                      onClick={handleLogout}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        textAlign: 'left',
                        border: 'none',
                        backgroundColor: 'transparent',
                        cursor: 'pointer',
                        fontSize: '14px',
                        color: '#ef4444',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      🚪 Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main style={{ 
          flex: 1, 
          padding: '32px',
          backgroundColor: '#f8fafc',
          overflow: 'auto'
        }}>
          {children}
        </main>

        {/* Footer */}
        <footer style={{
          backgroundColor: 'white',
          borderTop: '1px solid #e2e8f0',
          padding: '20px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '14px',
          color: '#64748b'
        }}>
          <div>
            <span>© 2024 Health Assessment Platform. All rights reserved.</span>
          </div>
          <div style={{ display: 'flex', gap: '24px' }}>
            <span style={{ cursor: 'pointer' }} onClick={() => alert('Help Center')}>
              ❓ Help
            </span>
            <span style={{ cursor: 'pointer' }} onClick={() => alert('Support')}>
              💬 Support
            </span>
            <span style={{ cursor: 'pointer' }} onClick={() => alert('Documentation')}>
              📚 Docs
            </span>
          </div>
        </footer>
      </div>

      {/* Overlay for mobile sidebar */}
      {userDropdownOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 998
          }}
          onClick={() => setUserDropdownOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;