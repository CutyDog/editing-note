import React from 'react';
import { PageSidebar, PageEditor } from '../../features/pages';
import { useSidebarResize } from '../../hooks/useSidebarResize';

const DashboardPage: React.FC = () => {
  const { sidebarWidth, isResizing, handleMouseDown } = useSidebarResize();

  return (
    <div
      style={{
        display: 'flex',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        userSelect: isResizing ? 'none' : 'auto',
        cursor: isResizing ? 'col-resize' : 'auto',
      }}
    >
      <PageSidebar width={sidebarWidth} />

      {/* リサイズハンドル */}
      <div
        onMouseDown={handleMouseDown}
        style={{
          width: '4px',
          flexShrink: 0,
          cursor: 'col-resize',
          backgroundColor: 'transparent',
          transition: 'background-color 0.15s ease',
          zIndex: 10,
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.backgroundColor = 'var(--accent-primary)';
        }}
        onMouseLeave={(e) => {
          if (!isResizing) {
            (e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent';
          }
        }}
      />

      <PageEditor />
    </div>
  );
};

export default DashboardPage;
