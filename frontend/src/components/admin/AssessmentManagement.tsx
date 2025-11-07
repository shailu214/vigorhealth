import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';

interface Assessment {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  healthScore: number;
  riskLevel: 'Low' | 'Moderate' | 'High';
  completedAt: string;
  duration: number; // in minutes
  symptoms: string[];
  recommendations: string[];
  chatMessages: number;
}

const AssessmentManagement: React.FC = () => {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/assessments', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (data.success) {
        // Mock data for demo
        const mockAssessments: Assessment[] = [
          {
            id: '1',
            userId: '1',
            userName: 'John Doe',
            userEmail: 'john@example.com',
            healthScore: 85,
            riskLevel: 'Low',
            completedAt: '2024-01-20T10:30:00Z',
            duration: 12,
            symptoms: ['Headache', 'Fatigue'],
            recommendations: ['Get more sleep', 'Stay hydrated', 'Regular exercise'],
            chatMessages: 15
          },
          {
            id: '2',
            userId: '2',
            userName: 'Jane Smith',
            userEmail: 'jane@example.com',
            healthScore: 65,
            riskLevel: 'Moderate',
            completedAt: '2024-01-19T14:45:00Z',
            duration: 18,
            symptoms: ['Chest pain', 'Shortness of breath', 'Dizziness'],
            recommendations: ['Consult a cardiologist', 'Monitor blood pressure', 'Reduce stress'],
            chatMessages: 23
          },
          {
            id: '3',
            userId: '3',
            userName: 'Bob Johnson',
            userEmail: 'bob@example.com',
            healthScore: 45,
            riskLevel: 'High',
            completedAt: '2024-01-18T09:15:00Z',
            duration: 25,
            symptoms: ['Severe abdominal pain', 'Nausea', 'Fever'],
            recommendations: ['Seek immediate medical attention', 'Emergency room visit recommended'],
            chatMessages: 31
          },
          {
            id: '4',
            userId: '1',
            userName: 'John Doe',
            userEmail: 'john@example.com',
            healthScore: 78,
            riskLevel: 'Low',
            completedAt: '2024-01-17T16:20:00Z',
            duration: 10,
            symptoms: ['Minor headache'],
            recommendations: ['Rest and hydration', 'Monitor symptoms'],
            chatMessages: 8
          }
        ];
        setAssessments(mockAssessments);
      } else {
        setError(data.message || 'Failed to fetch assessments');
      }
    } catch (err) {
      setError('Network error while fetching assessments');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Low': return { bg: '#dcfce7', text: '#166534' };
      case 'Moderate': return { bg: '#fef3c7', text: '#d97706' };
      case 'High': return { bg: '#fee2e2', text: '#dc2626' };
      default: return { bg: '#f3f4f6', text: '#374151' };
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString() + ' ' + 
           new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const filteredAndSortedAssessments = assessments
    .filter(assessment => {
      const matchesSearch = assessment.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           assessment.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           assessment.symptoms.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesFilter = filterRisk === 'all' || assessment.riskLevel === filterRisk;
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
        case 'score':
          return b.healthScore - a.healthScore;
        case 'risk':
          const riskOrder = { 'High': 3, 'Moderate': 2, 'Low': 1 };
          return riskOrder[b.riskLevel] - riskOrder[a.riskLevel];
        case 'duration':
          return b.duration - a.duration;
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ fontSize: '18px' }}>Loading assessments...</div>
      </div>
    );
  }

  return (
    <AdminLayout currentPage="Assessments">
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

      {/* Controls */}
      <div style={{ 
        display: 'flex', 
        gap: '20px', 
        marginBottom: '30px',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <div style={{ flex: '1', minWidth: '300px' }}>
          <input
            type="text"
            placeholder="Search by user, symptoms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />
        </div>
        <select
          value={filterRisk}
          onChange={(e) => setFilterRisk(e.target.value)}
          style={{
            padding: '12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            minWidth: '150px'
          }}
        >
          <option value="all">All Risk Levels</option>
          <option value="Low">Low Risk</option>
          <option value="Moderate">Moderate Risk</option>
          <option value="High">High Risk</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{
            padding: '12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            minWidth: '150px'
          }}
        >
          <option value="date">Sort by Date</option>
          <option value="score">Sort by Score</option>
          <option value="risk">Sort by Risk</option>
          <option value="duration">Sort by Duration</option>
        </select>
      </div>

      {/* Assessments Grid */}
      <div style={{ 
        display: 'grid', 
        gap: '20px',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))'
      }}>
        {filteredAndSortedAssessments.map((assessment) => {
          const riskColors = getRiskColor(assessment.riskLevel);
          return (
            <div
              key={assessment.id}
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                border: '1px solid #e5e7eb',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onClick={() => setSelectedAssessment(assessment)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
              }}
            >
              {/* Header */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                marginBottom: '15px'
              }}>
                <div>
                  <h3 style={{ 
                    margin: '0 0 5px 0', 
                    fontSize: '18px', 
                    fontWeight: '600',
                    color: '#111827'
                  }}>
                    {assessment.userName}
                  </h3>
                  <p style={{ 
                    margin: 0, 
                    fontSize: '14px', 
                    color: '#6b7280' 
                  }}>
                    {assessment.userEmail}
                  </p>
                </div>
                <div style={{
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '500',
                  backgroundColor: riskColors.bg,
                  color: riskColors.text
                }}>
                  {assessment.riskLevel} Risk
                </div>
              </div>

              {/* Score */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                marginBottom: '15px' 
              }}>
                <div style={{ 
                  fontSize: '32px', 
                  fontWeight: 'bold',
                  color: getScoreColor(assessment.healthScore),
                  marginRight: '10px'
                }}>
                  {assessment.healthScore}
                </div>
                <div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>Health Score</div>
                  <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                    {assessment.duration} min assessment
                  </div>
                </div>
              </div>

              {/* Symptoms */}
              <div style={{ marginBottom: '15px' }}>
                <div style={{ 
                  fontSize: '12px', 
                  fontWeight: '500', 
                  color: '#374151',
                  marginBottom: '5px'
                }}>
                  SYMPTOMS
                </div>
                <div style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: '5px' 
                }}>
                  {assessment.symptoms.slice(0, 3).map((symptom, index) => (
                    <span
                      key={index}
                      style={{
                        padding: '2px 8px',
                        backgroundColor: '#f3f4f6',
                        color: '#374151',
                        fontSize: '11px',
                        borderRadius: '12px'
                      }}
                    >
                      {symptom}
                    </span>
                  ))}
                  {assessment.symptoms.length > 3 && (
                    <span style={{
                      padding: '2px 8px',
                      backgroundColor: '#f3f4f6',
                      color: '#6b7280',
                      fontSize: '11px',
                      borderRadius: '12px'
                    }}>
                      +{assessment.symptoms.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                paddingTop: '15px',
                borderTop: '1px solid #f3f4f6'
              }}>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>
                  {formatDate(assessment.completedAt)}
                </div>
                <div style={{ 
                  fontSize: '12px', 
                  color: '#6b7280',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}>
                  💬 {assessment.chatMessages} messages
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredAndSortedAssessments.length === 0 && (
        <div style={{ 
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '40px', 
          textAlign: 'center', 
          color: '#6b7280',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          No assessments found matching your criteria.
        </div>
      )}

      {/* Assessment Detail Modal */}
      {selectedAssessment && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '30px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
                Assessment Details
              </h2>
              <button
                onClick={() => setSelectedAssessment(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                ×
              </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>Patient Information</h3>
              <p><strong>Name:</strong> {selectedAssessment.userName}</p>
              <p><strong>Email:</strong> {selectedAssessment.userEmail}</p>
              <p><strong>Assessment Date:</strong> {formatDate(selectedAssessment.completedAt)}</p>
              <p><strong>Duration:</strong> {selectedAssessment.duration} minutes</p>
              <p><strong>Chat Messages:</strong> {selectedAssessment.chatMessages}</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>Health Score</h3>
              <div style={{ 
                fontSize: '36px', 
                fontWeight: 'bold',
                color: getScoreColor(selectedAssessment.healthScore)
              }}>
                {selectedAssessment.healthScore}/100
              </div>
              <div style={{
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '500',
                backgroundColor: getRiskColor(selectedAssessment.riskLevel).bg,
                color: getRiskColor(selectedAssessment.riskLevel).text,
                display: 'inline-block',
                marginTop: '10px'
              }}>
                {selectedAssessment.riskLevel} Risk Level
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>Reported Symptoms</h3>
              <ul style={{ paddingLeft: '20px' }}>
                {selectedAssessment.symptoms.map((symptom, index) => (
                  <li key={index} style={{ marginBottom: '5px' }}>{symptom}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>Recommendations</h3>
              <ul style={{ paddingLeft: '20px' }}>
                {selectedAssessment.recommendations.map((rec, index) => (
                  <li key={index} style={{ marginBottom: '5px' }}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Summary */}
      <div style={{ 
        marginTop: '30px', 
        padding: '20px',
        backgroundColor: '#f9fafb',
        borderRadius: '8px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px'
      }}>
        <div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>
            {assessments.length}
          </div>
          <div style={{ color: '#6b7280' }}>Total Assessments</div>
        </div>
        <div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ef4444' }}>
            {assessments.filter(a => a.riskLevel === 'High').length}
          </div>
          <div style={{ color: '#6b7280' }}>High Risk</div>
        </div>
        <div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>
            {assessments.filter(a => a.riskLevel === 'Moderate').length}
          </div>
          <div style={{ color: '#6b7280' }}>Moderate Risk</div>
        </div>
        <div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>
            {Math.round(assessments.reduce((sum, a) => sum + a.healthScore, 0) / assessments.length) || 0}
          </div>
          <div style={{ color: '#6b7280' }}>Avg Health Score</div>
        </div>
      </div>
      </div>
    </AdminLayout>
  );
};

export default AssessmentManagement;