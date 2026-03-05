import React from 'react';
import type { PageSummary } from '../types';
import { PageTreeItem } from './PageTreeItem';

interface PageSidebarSectionProps {
  title: string;
  icon: React.ReactNode;
  pages: PageSummary[];
  allPages: PageSummary[];
  activeId?: string;
  itemKeyPrefix: string;
  onNavigate: (id: number) => void;
  onDelete: (e: React.MouseEvent, id: number) => void;
  onCreateChild: (e: React.MouseEvent, parentId: number) => void;
  onFavorite: (e: React.MouseEvent, page: PageSummary) => void;
}

export const PageSidebarSection: React.FC<PageSidebarSectionProps> = ({
  title,
  icon,
  pages,
  allPages,
  activeId,
  itemKeyPrefix,
  onNavigate,
  onDelete,
  onCreateChild,
  onFavorite,
}) => {
  if (pages.length === 0) return null;

  return (
    <div style={{ marginBottom: '0.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0 1rem 0.5rem' }}>
        {icon}
        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
          {title}
        </span>
      </div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {pages.map((page) => (
          <PageTreeItem
            key={`${itemKeyPrefix}-${page.id}`}
            page={page}
            allPages={allPages}
            level={0}
            activeId={activeId}
            onNavigate={onNavigate}
            onDelete={onDelete}
            onCreateChild={onCreateChild}
            onFavorite={onFavorite}
          />
        ))}
      </ul>
      <div style={{ borderBottom: '1px solid var(--border-color)', margin: '0.5rem 1rem' }} />
    </div>
  );
};
