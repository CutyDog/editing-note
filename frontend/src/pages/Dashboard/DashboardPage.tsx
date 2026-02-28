import React from 'react';
import { PageSidebar } from '../../features/pages/components/PageSidebar';
import { PageEditor } from '../../features/pages/components/PageEditor';

const DashboardPage: React.FC = () => {
  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <PageSidebar />
      <PageEditor />
    </div>
  );
};

export default DashboardPage;
