import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';

interface APIProvider {
  enabled: boolean;
  apiKey: string;
  model: string;
  maxTokens: number;
  temperature: number;
}

interface SystemConfig {
  defaultProvider: string;
  fallbackEnabled: boolean;
  rateLimitPerMinute: number;
  maxRetries: number;
  timeout: number;
}

interface APIConfig {
  openai: APIProvider;
  gemini: APIProvider;
  claude: APIProvider;
  huggingface: APIProvider;
  system: SystemConfig;
}

interface UsageStats {
  today: {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    averageResponseTime: number;
  };
  thisMonth: {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    averageResponseTime: number;
  };
  byProvider: {
    [key: string]: number;
  };
}

const APIConfigManagement: React.FC = () => {
  const [config, setConfig] = useState<APIConfig | null>(null);
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null);
  // Database configuration removed - now managed in .env file
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState<'providers' | 'system' | 'usage' | 'woocommerce'>('providers');

  const providerInfo = {
    openai: {
      name: 'OpenAI',
      description: 'GPT models from OpenAI',
      models: ['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo']
    },
    gemini: {
      name: 'Google Gemini',
      description: 'Google\'s Gemini AI models',
      models: ['gemini-pro', 'gemini-pro-vision']
    },
    claude: {
      name: 'Anthropic Claude',
      description: 'Claude AI models from Anthropic',
      models: ['claude-3-sonnet-20240229', 'claude-3-opus-20240229']
    },
    huggingface: {
      name: 'Hugging Face',
      description: 'Open source models from Hugging Face',
      models: ['microsoft/DialoGPT-medium', 'facebook/blenderbot-400M-distill']
    }
  };

  useEffect(() => {
    loadConfig();
    loadUsageStats();
    // Database configuration removed - now managed in .env file
  }, []);

  const loadConfig = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/config/ai-providers', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        setConfig(data.data);
      } else {
        setError(data.message || 'Failed to load configuration');
      }
    } catch (err) {
      setError('Network error while loading configuration');
    } finally {
      setLoading(false);
    }
  };

  const loadUsageStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/usage-stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        setUsageStats(data.data);
      }
    } catch (err) {
      console.error('Failed to load usage stats:', err);
    }
  };

  const updateProvider = async (provider: string, updates: Partial<APIProvider>) => {
    if (!config) return;

    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/config/ai-providers/${provider}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });

      const data = await response.json();
      if (data.success) {
        setSuccess(`${providerInfo[provider as keyof typeof providerInfo].name} updated successfully!`);
        loadConfig(); // Reload config
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message || 'Failed to update provider');
      }
    } catch (err) {
      setError('Network error while updating provider');
    } finally {
      setSaving(false);
    }
  };

  const updateSystemConfig = async (updates: Partial<SystemConfig>) => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/config/system', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });

      const data = await response.json();
      if (data.success) {
        setSuccess('System configuration updated successfully!');
        loadConfig(); // Reload config
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message || 'Failed to update system configuration');
      }
    } catch (err) {
      setError('Network error while updating system configuration');
    } finally {
      setSaving(false);
    }
  };

  const testProvider = async (provider: string) => {
    setTesting(provider);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/config/test-provider/${provider}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        setSuccess(`${providerInfo[provider as keyof typeof providerInfo].name} test successful! Response time: ${data.data.responseTime}ms`);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message || 'Provider test failed');
      }
    } catch (err) {
      setError('Network error while testing provider');
    } finally {
      setTesting(null);
    }
  };

  const handleProviderChange = (provider: string, field: keyof APIProvider, value: any) => {
    if (!config) return;

    const updatedConfig = {
      ...config,
      [provider]: {
        ...config[provider as keyof APIConfig],
        [field]: value
      }
    };
    setConfig(updatedConfig);
  };

  // Database configuration functions removed - now managed in .env file

  if (loading) {
    return (
      <AdminLayout currentPage="API Configuration">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '400px',
          fontSize: '18px',
          color: '#64748b'
        }}>
          Loading API configuration...
        </div>
      </AdminLayout>
    );
  }

  if (!config) {
    return (
      <AdminLayout currentPage="API Configuration">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '400px',
          fontSize: '18px',
          color: '#ef4444'
        }}>
          Failed to load API configuration
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout currentPage="API Configuration">
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          marginBottom: '32px',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#1e293b',
            marginBottom: '12px',
            margin: '0 0 12px 0'
          }}>
            🤖 API Configuration Management
          </h1>
          <p style={{
            fontSize: '18px',
            color: '#64748b',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Configure AI providers, system settings, and monitor usage analytics for your health assessment platform.
          </p>
        </div>

        {/* Alert Messages */}
        {error && (
          <div style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fca5a5',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '24px',
            color: '#dc2626',
            fontSize: '14px'
          }}>
            ❌ {error}
          </div>
        )}

        {success && (
          <div style={{
            backgroundColor: '#f0fdf4',
            border: '1px solid #86efac',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '24px',
            color: '#16a34a',
            fontSize: '14px'
          }}>
            ✅ {success}
          </div>
        )}

        {/* Tab Navigation */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '8px',
          marginBottom: '32px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
          display: 'flex',
          gap: '4px',
          overflowX: 'auto'
        }}>
          {[
            { id: 'providers' as const, label: 'AI Providers', icon: '🤖' },
            { id: 'system' as const, label: 'System Config', icon: '⚙️' },
            { id: 'woocommerce' as const, label: 'WooCommerce', icon: '🛒' },
            { id: 'usage' as const, label: 'Usage Stats', icon: '📊' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '12px 24px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: activeTab === tab.id ? '#3b82f6' : 'transparent',
                color: activeTab === tab.id ? 'white' : '#64748b',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap'
              }}
            >
              <span style={{ fontSize: '16px' }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        
        {/* AI Providers Tab */}
        {activeTab === 'providers' && (
          <div style={{ display: 'grid', gap: '24px' }}>
            {Object.entries(config).filter(([key]) => key !== 'system').map(([provider, providerConfig]) => {
              const info = providerInfo[provider as keyof typeof providerInfo];
              if (!info) return null;

              return (
                <div
                  key={provider}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '20px',
                    padding: '30px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    border: providerConfig.enabled ? '2px solid #10b981' : '2px solid #e5e7eb'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '24px'
                  }}>
                    <div>
                      <h3 style={{
                        fontSize: '24px',
                        fontWeight: '600',
                        color: '#1e293b',
                        marginBottom: '8px',
                        margin: '0 0 8px 0'
                      }}>
                        {info.name}
                      </h3>
                      <p style={{
                        fontSize: '16px',
                        color: '#64748b',
                        marginBottom: '12px',
                        margin: '0 0 12px 0'
                      }}>
                        {info.description}
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '500',
                        backgroundColor: providerConfig.enabled ? '#dcfce7' : '#fef2f2',
                        color: providerConfig.enabled ? '#166534' : '#dc2626'
                      }}>
                        {providerConfig.enabled ? 'Enabled' : 'Disabled'}
                      </span>

                      <button
                        onClick={() => testProvider(provider)}
                        disabled={!providerConfig.enabled || !providerConfig.apiKey || testing === provider}
                        style={{
                          padding: '8px 16px',
                          backgroundColor: providerConfig.enabled && providerConfig.apiKey ? '#10b981' : '#9ca3af',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: '500',
                          cursor: providerConfig.enabled && providerConfig.apiKey ? 'pointer' : 'not-allowed',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        {testing === provider ? (
                          <>
                            <div style={{
                              width: '12px',
                              height: '12px',
                              border: '2px solid transparent',
                              borderTop: '2px solid white',
                              borderRadius: '50%',
                              animation: 'spin 1s linear infinite'
                            }}></div>
                            Testing...
                          </>
                        ) : (
                          '🧪 Test'
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Configuration Form */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '20px'
                  }}>
                    {/* Enable/Disable */}
                    <div>
                      <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        cursor: 'pointer',
                        padding: '12px',
                        backgroundColor: '#f8fafc',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0'
                      }}>
                        <input
                          type="checkbox"
                          checked={providerConfig.enabled}
                          onChange={(e) => {
                            handleProviderChange(provider, 'enabled', e.target.checked);
                            updateProvider(provider, { enabled: e.target.checked });
                          }}
                          style={{ width: '18px', height: '18px' }}
                        />
                        <span style={{ fontSize: '14px', fontWeight: '500', color: '#1e293b' }}>
                          Enable this provider
                        </span>
                      </label>
                    </div>

                    {/* API Key */}
                    <div>
                      <label style={{ 
                        display: 'block', 
                        marginBottom: '8px', 
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#374151'
                      }}>
                        API Key
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="password"
                          value={providerConfig.apiKey}
                          onChange={(e) => handleProviderChange(provider, 'apiKey', e.target.value)}
                          onBlur={(e) => {
                            if (e.target.value !== providerConfig.apiKey) {
                              updateProvider(provider, { apiKey: e.target.value });
                            }
                          }}
                          placeholder={`Enter ${info.name} API key...`}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px',
                            fontSize: '14px',
                            backgroundColor: '#fff'
                          }}
                        />
                      </div>
                    </div>

                    {/* Model Selection */}
                    <div>
                      <label style={{ 
                        display: 'block', 
                        marginBottom: '8px', 
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#374151'
                      }}>
                        Model
                      </label>
                      <select
                        value={providerConfig.model}
                        onChange={(e) => {
                          handleProviderChange(provider, 'model', e.target.value);
                          updateProvider(provider, { model: e.target.value });
                        }}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '14px',
                          backgroundColor: '#fff'
                        }}
                      >
                        {info.models.map((model) => (
                          <option key={model} value={model}>
                            {model}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Max Tokens */}
                    <div>
                      <label style={{ 
                        display: 'block', 
                        marginBottom: '8px', 
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#374151'
                      }}>
                        Max Tokens
                      </label>
                      <input
                        type="number"
                        value={providerConfig.maxTokens}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          handleProviderChange(provider, 'maxTokens', value);
                        }}
                        onBlur={(e) => {
                          const value = parseInt(e.target.value);
                          if (value !== providerConfig.maxTokens) {
                            updateProvider(provider, { maxTokens: value });
                          }
                        }}
                        min="1"
                        max="4000"
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '14px',
                          backgroundColor: '#fff'
                        }}
                      />
                    </div>

                    {/* Temperature */}
                    <div>
                      <label style={{ 
                        display: 'block', 
                        marginBottom: '8px', 
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#374151'
                      }}>
                        Temperature ({providerConfig.temperature})
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={providerConfig.temperature}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          handleProviderChange(provider, 'temperature', value);
                        }}
                        onMouseUp={(e) => {
                          const value = parseFloat((e.target as HTMLInputElement).value);
                          updateProvider(provider, { temperature: value });
                        }}
                        style={{
                          width: '100%',
                          height: '6px',
                          backgroundColor: '#e5e7eb',
                          borderRadius: '3px',
                          outline: 'none'
                        }}
                      />
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        fontSize: '12px', 
                        color: '#6b7280',
                        marginTop: '4px'
                      }}>
                        <span>Conservative</span>
                        <span>Creative</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* System Configuration Tab */}
        {activeTab === 'system' && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            padding: '30px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            <h2 style={{ 
              fontSize: '24px', 
              fontWeight: '600', 
              color: '#1e293b',
              marginBottom: '24px',
              margin: '0 0 24px 0'
            }}>
              ⚙️ System Configuration
            </h2>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px'
            }}>
              {/* Default Provider */}
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  Default AI Provider
                </label>
                <select
                  value={config.system.defaultProvider}
                  onChange={(e) => updateSystemConfig({ defaultProvider: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    backgroundColor: '#fff'
                  }}
                >
                  {Object.entries(config).filter(([key, provider]) => 
                    key !== 'system' && provider.enabled
                  ).map(([key, provider]) => (
                    <option key={key} value={key}>
                      {providerInfo[key as keyof typeof providerInfo]?.name || key}
                    </option>
                  ))}
                </select>
              </div>

              {/* Fallback Enabled */}
              <div>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  padding: '12px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0'
                }}>
                  <input
                    type="checkbox"
                    checked={config.system.fallbackEnabled}
                    onChange={(e) => updateSystemConfig({ fallbackEnabled: e.target.checked })}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#1e293b' }}>
                    Enable fallback to other providers
                  </span>
                </label>
              </div>

              {/* Rate Limit */}
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  Rate Limit (requests per minute)
                </label>
                <input
                  type="number"
                  value={config.system.rateLimitPerMinute}
                  onChange={(e) => updateSystemConfig({ rateLimitPerMinute: parseInt(e.target.value) })}
                  min="1"
                  max="1000"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    backgroundColor: '#fff'
                  }}
                />
              </div>

              {/* Max Retries */}
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  Max Retries
                </label>
                <input
                  type="number"
                  value={config.system.maxRetries}
                  onChange={(e) => updateSystemConfig({ maxRetries: parseInt(e.target.value) })}
                  min="0"
                  max="10"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    backgroundColor: '#fff'
                  }}
                />
              </div>

              {/* Timeout */}
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  Request Timeout (seconds)
                </label>
                <input
                  type="number"
                  value={config.system.timeout}
                  onChange={(e) => updateSystemConfig({ timeout: parseInt(e.target.value) })}
                  min="5"
                  max="300"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    backgroundColor: '#fff'
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* WooCommerce Configuration Tab */}
        {activeTab === 'woocommerce' && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            padding: '30px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            <h2 style={{ 
              fontSize: '24px', 
              fontWeight: '600', 
              color: '#1e293b',
              marginBottom: '24px',
              margin: '0 0 24px 0'
            }}>
              🛒 WooCommerce Integration
            </h2>
            <p style={{ 
              fontSize: '16px', 
              color: '#64748b', 
              marginBottom: '24px',
              lineHeight: '1.6'
            }}>
              Configure WooCommerce integration for seamless e-commerce functionality.
            </p>
            
            <div style={{
              backgroundColor: '#f0f9ff',
              border: '2px solid #3b82f6',
              borderRadius: '12px',
              padding: '24px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚧</div>
              <h3 style={{ fontSize: '20px', color: '#1e40af', marginBottom: '12px', margin: '0 0 12px 0' }}>
                WooCommerce Integration Coming Soon
              </h3>
              <p style={{ fontSize: '16px', color: '#374151' }}>
                This feature is currently under development. It will allow seamless integration with WooCommerce stores for health product sales.
              </p>
            </div>
          </div>
        )}

        {/* Usage Stats Tab */}
        {activeTab === 'usage' && usageStats && (
          <div style={{ display: 'grid', gap: '24px' }}>
            {/* Stats Cards */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px'
            }}>
              {/* Today Stats */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.06)'
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#374151', marginBottom: '16px', margin: '0 0 16px 0' }}>
                  📊 Today's Usage
                </h3>
                <div style={{ display: 'grid', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#6b7280' }}>Total Requests:</span>
                    <span style={{ fontWeight: '600', color: '#1e293b' }}>{usageStats.today.totalRequests}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#6b7280' }}>Successful:</span>
                    <span style={{ fontWeight: '600', color: '#10b981' }}>{usageStats.today.successfulRequests}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#6b7280' }}>Failed:</span>
                    <span style={{ fontWeight: '600', color: '#ef4444' }}>{usageStats.today.failedRequests}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#6b7280' }}>Avg Response:</span>
                    <span style={{ fontWeight: '600', color: '#3b82f6' }}>{usageStats.today.averageResponseTime}ms</span>
                  </div>
                </div>
              </div>

              {/* Monthly Stats */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.06)'
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#374151', marginBottom: '16px', margin: '0 0 16px 0' }}>
                  📈 This Month
                </h3>
                <div style={{ display: 'grid', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#6b7280' }}>Total Requests:</span>
                    <span style={{ fontWeight: '600', color: '#1e293b' }}>{usageStats.thisMonth.totalRequests}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#6b7280' }}>Successful:</span>
                    <span style={{ fontWeight: '600', color: '#10b981' }}>{usageStats.thisMonth.successfulRequests}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#6b7280' }}>Failed:</span>
                    <span style={{ fontWeight: '600', color: '#ef4444' }}>{usageStats.thisMonth.failedRequests}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#6b7280' }}>Avg Response:</span>
                    <span style={{ fontWeight: '600', color: '#3b82f6' }}>{usageStats.thisMonth.averageResponseTime}ms</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Provider Usage Chart */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.06)'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#374151', marginBottom: '20px', margin: '0 0 20px 0' }}>
                🔄 Usage by Provider
              </h3>
              <div style={{ display: 'grid', gap: '16px' }}>
                {Object.entries(usageStats.byProvider).map(([provider, count]) => {
                  const total = Object.values(usageStats.byProvider).reduce((a, b) => a + b, 0);
                  const percentage = total > 0 ? (count / total) * 100 : 0;
                  
                  return (
                    <div key={provider} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ 
                        minWidth: '100px', 
                        fontSize: '14px', 
                        fontWeight: '500',
                        color: '#374151'
                      }}>
                        {providerInfo[provider as keyof typeof providerInfo]?.name || provider}
                      </div>
                      <div style={{ 
                        flex: 1, 
                        height: '8px', 
                        backgroundColor: '#e5e7eb', 
                        borderRadius: '4px',
                        overflow: 'hidden'
                      }}>
                        <div style={{ 
                          width: `${percentage}%`, 
                          height: '100%', 
                          backgroundColor: '#3b82f6',
                          borderRadius: '4px'
                        }}></div>
                      </div>
                      <div style={{ 
                        minWidth: '60px', 
                        fontSize: '14px', 
                        fontWeight: '600',
                        color: '#1e293b',
                        textAlign: 'right'
                      }}>
                        {count} ({percentage.toFixed(1)}%)
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default APIConfigManagement;