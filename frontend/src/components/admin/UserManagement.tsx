import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  isActive: boolean;
  lastAssessment?: string;
  totalAssessments: number;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (data.success) {
        // Mock data for demo
        const mockUsers: User[] = [
          {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            createdAt: '2024-01-15',
            isActive: true,
            lastAssessment: '2024-01-20',
            totalAssessments: 3
          },
          {
            id: '2',
            name: 'Jane Smith',
            email: 'jane@example.com',
            createdAt: '2024-01-16',
            isActive: true,
            lastAssessment: '2024-01-19',
            totalAssessments: 2
          },
          {
            id: '3',
            name: 'Bob Johnson',
            email: 'bob@example.com',
            createdAt: '2024-01-17',
            isActive: false,
            lastAssessment: '2024-01-18',
            totalAssessments: 1
          }
        ];
        setUsers(mockUsers);
      } else {
        setError(data.message || 'Failed to fetch users');
      }
    } catch (err) {
      setError('Network error while fetching users');
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isActive: !currentStatus })
      });

      const data = await response.json();
      
      if (data.success) {
        setUsers(users.map(user => 
          user.id === userId ? { ...user, isActive: !currentStatus } : user
        ));
      } else {
        setError(data.message || 'Failed to update user');
      }
    } catch (err) {
      setError('Network error while updating user');
    }
  };

  const deleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setUsers(users.filter(user => user.id !== userId));
      } else {
        setError(data.message || 'Failed to delete user');
      }
    } catch (err) {
      setError('Network error while deleting user');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterActive === 'all' || 
                         (filterActive === 'active' && user.isActive) ||
                         (filterActive === 'inactive' && !user.isActive);
    
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ fontSize: '18px' }}>Loading users...</div>
      </div>
    );
  }

  return (
    <AdminLayout currentPage="Users">
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

      {/* Search and Filter Controls */}
      <div style={{ 
        display: 'flex', 
        gap: '20px', 
        marginBottom: '30px',
        flexWrap: 'wrap'
      }}>
        <div style={{ flex: '1', minWidth: '300px' }}>
          <input
            type="text"
            placeholder="Search users by name or email..."
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
          value={filterActive}
          onChange={(e) => setFilterActive(e.target.value)}
          style={{
            padding: '12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            minWidth: '150px'
          }}
        >
          <option value="all">All Users</option>
          <option value="active">Active Only</option>
          <option value="inactive">Inactive Only</option>
        </select>
      </div>

      {/* Users Table */}
      <div style={{ 
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f9fafb' }}>
              <th style={{ 
                padding: '15px', 
                textAlign: 'left', 
                fontWeight: '600',
                color: '#374151',
                borderBottom: '1px solid #e5e7eb'
              }}>
                User
              </th>
              <th style={{ 
                padding: '15px', 
                textAlign: 'left', 
                fontWeight: '600',
                color: '#374151',
                borderBottom: '1px solid #e5e7eb'
              }}>
                Status
              </th>
              <th style={{ 
                padding: '15px', 
                textAlign: 'left', 
                fontWeight: '600',
                color: '#374151',
                borderBottom: '1px solid #e5e7eb'
              }}>
                Assessments
              </th>
              <th style={{ 
                padding: '15px', 
                textAlign: 'left', 
                fontWeight: '600',
                color: '#374151',
                borderBottom: '1px solid #e5e7eb'
              }}>
                Last Assessment
              </th>
              <th style={{ 
                padding: '15px', 
                textAlign: 'left', 
                fontWeight: '600',
                color: '#374151',
                borderBottom: '1px solid #e5e7eb'
              }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '15px' }}>
                  <div>
                    <div style={{ fontWeight: '500', color: '#111827' }}>
                      {user.name}
                    </div>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>
                      {user.email}
                    </div>
                    <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                      Joined: {user.createdAt}
                    </div>
                  </div>
                </td>
                <td style={{ padding: '15px' }}>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '500',
                    backgroundColor: user.isActive ? '#dcfce7' : '#fee2e2',
                    color: user.isActive ? '#166534' : '#dc2626'
                  }}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td style={{ padding: '15px', color: '#374151' }}>
                  {user.totalAssessments}
                </td>
                <td style={{ padding: '15px', color: '#6b7280', fontSize: '14px' }}>
                  {user.lastAssessment || 'Never'}
                </td>
                <td style={{ padding: '15px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => toggleUserStatus(user.id, user.isActive)}
                      style={{
                        padding: '6px 12px',
                        fontSize: '12px',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        backgroundColor: user.isActive ? '#fbbf24' : '#10b981',
                        color: 'white'
                      }}
                    >
                      {user.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => deleteUser(user.id)}
                      style={{
                        padding: '6px 12px',
                        fontSize: '12px',
                        backgroundColor: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div style={{ 
            padding: '40px', 
            textAlign: 'center', 
            color: '#6b7280' 
          }}>
            No users found matching your criteria.
          </div>
        )}
      </div>

      {/* Summary */}
      <div style={{ 
        marginTop: '30px', 
        padding: '20px',
        backgroundColor: '#f9fafb',
        borderRadius: '8px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ color: '#374151' }}>
          Total Users: <strong>{users.length}</strong> | 
          Active: <strong>{users.filter(u => u.isActive).length}</strong> | 
          Inactive: <strong>{users.filter(u => !u.isActive).length}</strong>
        </div>
        <div style={{ color: '#6b7280', fontSize: '14px' }}>
          Showing {filteredUsers.length} of {users.length} users
        </div>
      </div>
      </div>
    </AdminLayout>
  );
};

export default UserManagement;