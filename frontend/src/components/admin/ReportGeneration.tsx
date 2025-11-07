import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';

interface ReportData {
  id: string;
  title: string;
  type: 'users' | 'assessments' | 'health-trends' | 'risk-analysis';
  period: string;
  generatedAt: string;
  data: any;
  downloadUrl?: string;
}

const ReportGeneration: React.FC = () => {
  const [reports, setReports] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generating, setGenerating] = useState<string | null>(null);
  
  const [reportConfig, setReportConfig] = useState({
    type: 'users' as const,
    period: '30days',
    includeDetails: true,
    format: 'pdf'
  });

  useEffect(() => {
    loadRecentReports();
  }, []);

  const loadRecentReports = () => {
    // Mock recent reports data
    const mockReports: ReportData[] = [
      {
        id: '1',
        title: 'User Activity Report - January 2024',
        type: 'users',
        period: '30days',
        generatedAt: '2024-01-20T10:30:00Z',
        data: {
          totalUsers: 150,
          activeUsers: 89,
          newRegistrations: 23
        }
      },
      {
        id: '2',
        title: 'Health Assessment Trends - Q1 2024',
        type: 'health-trends',
        period: '90days',
        generatedAt: '2024-01-19T14:45:00Z',
        data: {
          totalAssessments: 342,
          avgHealthScore: 72,
          riskDistribution: { low: 60, moderate: 30, high: 10 }
        }
      },
      {
        id: '3',
        title: 'Risk Analysis Report - Last Month',
        type: 'risk-analysis',
        period: '30days',
        generatedAt: '2024-01-18T09:15:00Z',
        data: {
          highRiskPatients: 15,
          commonSymptoms: ['Headache', 'Fatigue', 'Chest pain']
        }
      }
    ];
    setReports(mockReports);
  };

  const generateReport = async () => {
    setGenerating(reportConfig.type);
    setError('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const newReport: ReportData = {
        id: Date.now().toString(),
        title: getReportTitle(reportConfig.type, reportConfig.period),
        type: reportConfig.type,
        period: reportConfig.period,
        generatedAt: new Date().toISOString(),
        data: generateMockData(reportConfig.type),
        downloadUrl: `/reports/${Date.now()}.${reportConfig.format}`
      };
      
      setReports([newReport, ...reports]);
      setGenerating(null);
    } catch (err) {
      setError('Failed to generate report');
      setGenerating(null);
    }
  };

  const getReportTitle = (type: string, period: string) => {
    const typeNames: { [key: string]: string } = {
      users: 'User Activity Report',
      assessments: 'Assessment Summary Report',
      'health-trends': 'Health Trends Analysis',
      'risk-analysis': 'Risk Assessment Report'
    };
    
    const periodNames: { [key: string]: string } = {
      '7days': 'Last 7 Days',
      '30days': 'Last 30 Days',
      '90days': 'Last 90 Days',
      '1year': 'Last Year'
    };
    
    return `${typeNames[type]} - ${periodNames[period]}`;
  };

  const generateMockData = (type: string) => {
    switch (type) {
      case 'users':
        return {
          totalUsers: Math.floor(Math.random() * 200) + 100,
          activeUsers: Math.floor(Math.random() * 150) + 50,
          newRegistrations: Math.floor(Math.random() * 50) + 10,
          avgSessionTime: Math.floor(Math.random() * 20) + 10
        };
      case 'assessments':
        return {
          totalAssessments: Math.floor(Math.random() * 500) + 200,
          completedAssessments: Math.floor(Math.random() * 400) + 150,
          avgCompletionTime: Math.floor(Math.random() * 15) + 10,
          avgHealthScore: Math.floor(Math.random() * 30) + 60
        };
      case 'health-trends':
        return {
          avgHealthScore: Math.floor(Math.random() * 30) + 60,
          scoreImprovement: Math.floor(Math.random() * 10) + 2,
          riskDistribution: {
            low: Math.floor(Math.random() * 30) + 50,
            moderate: Math.floor(Math.random() * 25) + 25,
            high: Math.floor(Math.random() * 15) + 5
          }
        };
      case 'risk-analysis':
        return {
          highRiskPatients: Math.floor(Math.random() * 30) + 10,
          moderateRiskPatients: Math.floor(Math.random() * 50) + 30,
          commonSymptoms: ['Headache', 'Fatigue', 'Chest pain', 'Dizziness'],
          urgentCases: Math.floor(Math.random() * 5) + 1
        };
      default:
        return {};
    }
  };

  const downloadReport = (reportId: string) => {
    // Simulate download
    const report = reports.find(r => r.id === reportId);
    if (report) {
      // In a real app, this would trigger an actual download
      alert(`Downloading ${report.title}`);
    }
  };

  const deleteReport = (reportId: string) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      setReports(reports.filter(r => r.id !== reportId));
    }
  };

  const getReportIcon = (type: string) => {
    switch (type) {
      case 'users': return '👥';
      case 'assessments': return '📋';
      case 'health-trends': return '📈';
      case 'risk-analysis': return '⚠️';
      default: return '📄';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString() + ' ' + 
           new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <AdminLayout currentPage="Reports">
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

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

      {/* Report Generation Form */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '30px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginBottom: '30px'
      }}>
        <h2 style={{ 
          fontSize: '20px', 
          fontWeight: '600', 
          marginBottom: '20px',
          color: '#111827'
        }}>
          Generate New Report
        </h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '500',
              color: '#374151'
            }}>
              Report Type
            </label>
            <select
              value={reportConfig.type}
              onChange={(e) => setReportConfig({
                ...reportConfig, 
                type: e.target.value as any
              })}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            >
              <option value="users">User Activity Report</option>
              <option value="assessments">Assessment Summary</option>
              <option value="health-trends">Health Trends Analysis</option>
              <option value="risk-analysis">Risk Assessment Report</option>
            </select>
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '500',
              color: '#374151'
            }}>
              Time Period
            </label>
            <select
              value={reportConfig.period}
              onChange={(e) => setReportConfig({
                ...reportConfig, 
                period: e.target.value
              })}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="1year">Last Year</option>
            </select>
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '500',
              color: '#374151'
            }}>
              Format
            </label>
            <select
              value={reportConfig.format}
              onChange={(e) => setReportConfig({
                ...reportConfig, 
                format: e.target.value
              })}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            >
              <option value="pdf">PDF</option>
              <option value="excel">Excel</option>
              <option value="csv">CSV</option>
            </select>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            cursor: 'pointer'
          }}>
            <input
              type="checkbox"
              checked={reportConfig.includeDetails}
              onChange={(e) => setReportConfig({
                ...reportConfig, 
                includeDetails: e.target.checked
              })}
            />
            <span style={{ fontSize: '14px', color: '#374151' }}>
              Include detailed data and charts
            </span>
          </label>
        </div>

        <button
          onClick={generateReport}
          disabled={generating !== null}
          style={{
            padding: '12px 24px',
            backgroundColor: generating ? '#9ca3af' : '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: '500',
            cursor: generating ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          {generating ? (
            <>
              <span>Generating...</span>
              <div style={{
                width: '16px',
                height: '16px',
                border: '2px solid transparent',
                borderTop: '2px solid white',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
            </>
          ) : (
            <>
              <span>📊</span>
              Generate Report
            </>
          )}
        </button>
      </div>

      {/* Recent Reports */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '30px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ 
          fontSize: '20px', 
          fontWeight: '600', 
          marginBottom: '20px',
          color: '#111827'
        }}>
          Recent Reports
        </h2>

        {reports.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px',
            color: '#6b7280'
          }}>
            No reports generated yet. Create your first report above.
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gap: '15px'
          }}>
            {reports.map((report) => (
              <div
                key={report.id}
                style={{
                  padding: '20px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: '#fafafa'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ fontSize: '24px' }}>
                    {getReportIcon(report.type)}
                  </div>
                  <div>
                    <h3 style={{ 
                      margin: '0 0 5px 0', 
                      fontSize: '16px', 
                      fontWeight: '500',
                      color: '#111827'
                    }}>
                      {report.title}
                    </h3>
                    <p style={{ 
                      margin: 0, 
                      fontSize: '14px', 
                      color: '#6b7280' 
                    }}>
                      Generated on {formatDate(report.generatedAt)}
                    </p>
                    {/* Report Summary */}
                    <div style={{ 
                      marginTop: '8px',
                      fontSize: '12px',
                      color: '#374151'
                    }}>
                      {report.type === 'users' && (
                        <span>👥 {report.data.totalUsers} users, {report.data.activeUsers} active</span>
                      )}
                      {report.type === 'assessments' && (
                        <span>📋 {report.data.totalAssessments} assessments, avg score: {report.data.avgHealthScore}</span>
                      )}
                      {report.type === 'health-trends' && (
                        <span>📈 Avg health score: {report.data.avgHealthScore}, Risk: {report.data.riskDistribution?.low}% low</span>
                      )}
                      {report.type === 'risk-analysis' && (
                        <span>⚠️ {report.data.highRiskPatients} high-risk patients identified</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => downloadReport(report.id)}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    📥 Download
                  </button>
                  <button
                    onClick={() => deleteReport(report.id)}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
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

export default ReportGeneration;