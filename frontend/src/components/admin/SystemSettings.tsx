import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';

interface SystemSettings {
  siteName: string;
  maintenanceMode: boolean;
  maxAssessmentDuration: number;
  emailNotifications: boolean;
  dataRetentionDays: number;
  allowGuestAccess: boolean;
  maxUploadSize: number;
  aiServiceEnabled: boolean;
  ocrServiceEnabled: boolean;
  adminEmailAlerts: boolean;
  securityLevel: 'low' | 'medium' | 'high';
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  logLevel: 'error' | 'warn' | 'info' | 'debug';
}

const SystemSettings: React.FC = () => {
  const [settings, setSettings] = useState<SystemSettings>({
    siteName: 'Health Assessment Platform',
    maintenanceMode: false,
    maxAssessmentDuration: 30,
    emailNotifications: true,
    dataRetentionDays: 365,
    allowGuestAccess: true,
    maxUploadSize: 10,
    aiServiceEnabled: true,
    ocrServiceEnabled: true,
    adminEmailAlerts: true,
    securityLevel: 'medium',
    backupFrequency: 'daily',
    logLevel: 'info'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      // In a real app, this would fetch from API
      // For demo, we'll use the default settings
      console.log('Settings loaded');
    } catch (err) {
      setError('Failed to load settings');
    }
  };

  const saveSettings = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('adminToken');
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, this would save to API
      console.log('Saving settings:', settings);
      
      setSuccess('Settings saved successfully!');
      setUnsavedChanges(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const resetSettings = () => {
    if (window.confirm('Are you sure you want to reset all settings to default values?')) {
      setSettings({
        siteName: 'Health Assessment Platform',
        maintenanceMode: false,
        maxAssessmentDuration: 30,
        emailNotifications: true,
        dataRetentionDays: 365,
        allowGuestAccess: true,
        maxUploadSize: 10,
        aiServiceEnabled: true,
        ocrServiceEnabled: true,
        adminEmailAlerts: true,
        securityLevel: 'medium',
        backupFrequency: 'daily',
        logLevel: 'info'
      });
      setUnsavedChanges(true);
    }
  };

  const updateSetting = (key: keyof SystemSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    setUnsavedChanges(true);
    setSuccess('');
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'system-settings.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target?.result as string);
          setSettings(imported);
          setUnsavedChanges(true);
          setSuccess('Settings imported successfully!');
          setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
          setError('Invalid settings file format');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <AdminLayout currentPage="Settings">
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

      {error && (
        <div style={{
          backgroundColor: '#fee2e2',
          color: '#dc2626',
          padding: '12px',
          borderRadius: '6px',
          marginBottom: '20px',
          border: '1px solid #fecaca'
        }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{
          backgroundColor: '#dcfce7',
          color: '#166534',
          padding: '12px',
          borderRadius: '6px',
          marginBottom: '20px',
          border: '1px solid #bbf7d0'
        }}>
          {success}
        </div>
      )}

      {unsavedChanges && (
        <div style={{
          backgroundColor: '#fef3c7',
          color: '#d97706',
          padding: '12px',
          borderRadius: '6px',
          marginBottom: '20px',
          border: '1px solid #fde68a',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>You have unsaved changes</span>
          <button
            onClick={saveSettings}
            disabled={loading}
            style={{
              padding: '6px 12px',
              backgroundColor: '#d97706',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '12px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Saving...' : 'Save Now'}
          </button>
        </div>
      )}

      <div style={{ 
        display: 'grid', 
        gap: '30px',
        gridTemplateColumns: '1fr'
      }}>
        {/* General Settings */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '25px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ 
            fontSize: '20px', 
            fontWeight: '600', 
            marginBottom: '20px',
            color: '#111827',
            borderBottom: '1px solid #e5e7eb',
            paddingBottom: '10px'
          }}>
            🏢 General Settings
          </h2>
          
          <div style={{ display: 'grid', gap: '20px' }}>
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '500',
                color: '#374151'
              }}>
                Site Name
              </label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => updateSetting('siteName', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <input
                type="checkbox"
                id="maintenanceMode"
                checked={settings.maintenanceMode}
                onChange={(e) => updateSetting('maintenanceMode', e.target.checked)}
                style={{ width: '16px', height: '16px' }}
              />
              <label htmlFor="maintenanceMode" style={{ 
                fontSize: '14px', 
                color: '#374151',
                cursor: 'pointer'
              }}>
                Maintenance Mode (Prevents new assessments)
              </label>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <input
                type="checkbox"
                id="allowGuestAccess"
                checked={settings.allowGuestAccess}
                onChange={(e) => updateSetting('allowGuestAccess', e.target.checked)}
                style={{ width: '16px', height: '16px' }}
              />
              <label htmlFor="allowGuestAccess" style={{ 
                fontSize: '14px', 
                color: '#374151',
                cursor: 'pointer'
              }}>
                Allow Guest Access (No registration required)
              </label>
            </div>
          </div>
        </div>

        {/* Assessment Settings */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '25px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ 
            fontSize: '20px', 
            fontWeight: '600', 
            marginBottom: '20px',
            color: '#111827',
            borderBottom: '1px solid #e5e7eb',
            paddingBottom: '10px'
          }}>
            📋 Assessment Settings
          </h2>
          
          <div style={{ display: 'grid', gap: '20px' }}>
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '500',
                color: '#374151'
              }}>
                Maximum Assessment Duration (minutes)
              </label>
              <input
                type="number"
                value={settings.maxAssessmentDuration}
                onChange={(e) => updateSetting('maxAssessmentDuration', parseInt(e.target.value))}
                min="5"
                max="120"
                style={{
                  width: '200px',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '500',
                color: '#374151'
              }}>
                Maximum Upload Size (MB)
              </label>
              <input
                type="number"
                value={settings.maxUploadSize}
                onChange={(e) => updateSetting('maxUploadSize', parseInt(e.target.value))}
                min="1"
                max="100"
                style={{
                  width: '200px',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
            </div>
          </div>
        </div>

        {/* Service Settings */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '25px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ 
            fontSize: '20px', 
            fontWeight: '600', 
            marginBottom: '20px',
            color: '#111827',
            borderBottom: '1px solid #e5e7eb',
            paddingBottom: '10px'
          }}>
            🤖 Service Settings
          </h2>
          
          <div style={{ display: 'grid', gap: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <input
                type="checkbox"
                id="aiServiceEnabled"
                checked={settings.aiServiceEnabled}
                onChange={(e) => updateSetting('aiServiceEnabled', e.target.checked)}
                style={{ width: '16px', height: '16px' }}
              />
              <label htmlFor="aiServiceEnabled" style={{ 
                fontSize: '14px', 
                color: '#374151',
                cursor: 'pointer'
              }}>
                AI Chat Service Enabled
              </label>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <input
                type="checkbox"
                id="ocrServiceEnabled"
                checked={settings.ocrServiceEnabled}
                onChange={(e) => updateSetting('ocrServiceEnabled', e.target.checked)}
                style={{ width: '16px', height: '16px' }}
              />
              <label htmlFor="ocrServiceEnabled" style={{ 
                fontSize: '14px', 
                color: '#374151',
                cursor: 'pointer'
              }}>
                OCR Document Processing Enabled
              </label>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <input
                type="checkbox"
                id="emailNotifications"
                checked={settings.emailNotifications}
                onChange={(e) => updateSetting('emailNotifications', e.target.checked)}
                style={{ width: '16px', height: '16px' }}
              />
              <label htmlFor="emailNotifications" style={{ 
                fontSize: '14px', 
                color: '#374151',
                cursor: 'pointer'
              }}>
                Email Notifications Enabled
              </label>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <input
                type="checkbox"
                id="adminEmailAlerts"
                checked={settings.adminEmailAlerts}
                onChange={(e) => updateSetting('adminEmailAlerts', e.target.checked)}
                style={{ width: '16px', height: '16px' }}
              />
              <label htmlFor="adminEmailAlerts" style={{ 
                fontSize: '14px', 
                color: '#374151',
                cursor: 'pointer'
              }}>
                Admin Email Alerts for High-Risk Cases
              </label>
            </div>
          </div>
        </div>

        {/* Security & Data Settings */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '25px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ 
            fontSize: '20px', 
            fontWeight: '600', 
            marginBottom: '20px',
            color: '#111827',
            borderBottom: '1px solid #e5e7eb',
            paddingBottom: '10px'
          }}>
            🔒 Security & Data Settings
          </h2>
          
          <div style={{ display: 'grid', gap: '20px' }}>
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '500',
                color: '#374151'
              }}>
                Security Level
              </label>
              <select
                value={settings.securityLevel}
                onChange={(e) => updateSetting('securityLevel', e.target.value)}
                style={{
                  width: '200px',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '500',
                color: '#374151'
              }}>
                Data Retention Period (days)
              </label>
              <input
                type="number"
                value={settings.dataRetentionDays}
                onChange={(e) => updateSetting('dataRetentionDays', parseInt(e.target.value))}
                min="30"
                max="2555"
                style={{
                  width: '200px',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
              <p style={{ fontSize: '12px', color: '#6b7280', margin: '5px 0 0 0' }}>
                User data will be automatically deleted after this period
              </p>
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '500',
                color: '#374151'
              }}>
                Backup Frequency
              </label>
              <select
                value={settings.backupFrequency}
                onChange={(e) => updateSetting('backupFrequency', e.target.value)}
                style={{
                  width: '200px',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '500',
                color: '#374151'
              }}>
                Log Level
              </label>
              <select
                value={settings.logLevel}
                onChange={(e) => updateSetting('logLevel', e.target.value)}
                style={{
                  width: '200px',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              >
                <option value="error">Error Only</option>
                <option value="warn">Warning & Error</option>
                <option value="info">Info, Warning & Error</option>
                <option value="debug">Debug (All)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ 
        marginTop: '40px',
        padding: '30px',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        display: 'flex',
        gap: '15px',
        flexWrap: 'wrap',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <button
            onClick={saveSettings}
            disabled={loading || !unsavedChanges}
            style={{
              padding: '12px 24px',
              backgroundColor: !unsavedChanges ? '#9ca3af' : loading ? '#6b7280' : '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: !unsavedChanges || loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {loading ? (
              <>
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid transparent',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                Saving...
              </>
            ) : (
              <>
                💾 Save Settings
              </>
            )}
          </button>

          <button
            onClick={resetSettings}
            style={{
              padding: '12px 24px',
              backgroundColor: '#f59e0b',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            🔄 Reset to Default
          </button>
        </div>

        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <button
            onClick={exportSettings}
            style={{
              padding: '12px 24px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            📤 Export Settings
          </button>

          <label style={{
            padding: '12px 24px',
            backgroundColor: '#8b5cf6',
            color: 'white',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            📥 Import Settings
            <input
              type="file"
              accept=".json"
              onChange={importSettings}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      </div>
    </AdminLayout>
  );
};

export default SystemSettings;