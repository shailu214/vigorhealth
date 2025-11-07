import React, { useState, useEffect } from 'react';
import AdminDashboard from './AdminDashboard';
import UserManagement from './UserManagement';
import AssessmentManagement from './AssessmentManagement';
import ReportGeneration from './ReportGeneration';
import SystemSettings from './SystemSettings';
import APIConfigManagement from './APIConfigManagement';

const AdminRouter: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('dashboard');

  useEffect(() => {
    // Listen for hash changes to handle navigation
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const page = hash.split('/')[2] || 'dashboard';
      setCurrentPage(page);
    };

    // Set initial page based on hash
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'users':
        return <UserManagement />;
      case 'assessments':
        return <AssessmentManagement />;
      case 'reports':
        return <ReportGeneration />;
      case 'api-config':
        return <APIConfigManagement />;
      case 'settings':
        return <SystemSettings />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div>
      {renderPage()}
    </div>
  );
};

export default AdminRouter;