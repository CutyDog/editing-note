import React from 'react';
import { PageSidebar, PageEditor } from '../../features/pages';

const DashboardPage: React.FC = () => {
  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <PageSidebar />
      <PageEditor />
    </div>
  );
};

export default DashboardPage;
