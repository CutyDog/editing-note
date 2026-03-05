import React, { useState } from 'react';
import { FileText, ChevronRight, ChevronDown } from 'lucide-react';
import type { PageSummary } from '../types';
import { PageActionButtons } from './PageActionButtons';

export interface PageTreeItemProps {
  page: PageSummary;
  allPages: PageSummary[];
  level: number;
  activeId?: string;
  onNavigate: (id: number) => void;
  onDelete: (e: React.MouseEvent, id: number) => void;
  onCreateChild: (e: React.MouseEvent, parentId: number) => void;
  onFavorite: (e: React.MouseEvent, page: PageSummary) => void;
}

export const PageTreeItem: React.FC<PageTreeItemProps> = ({
  page,
  allPages,
  level,
  activeId,
  onNavigate,
  onDelete,
  onCreateChild,
  onFavorite,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const children = allPages.filter(p => p.parent_id === page.id).sort((a, b) => a.position - b.position);
  const hasChildren = children.length > 0;

  return (
    <li>
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          display: 'flex',
          alignItems: 'center',
          paddingRight: '8px',
          background: activeId === String(page.id) ? 'var(--bg-card-hover)' : 'transparent',
        }}>
        <div style={{ width: `${level * 16 + 24}px`, display: 'flex', justifyContent: 'flex-end', paddingRight: '4px' }}>
          {hasChildren ? (
            <button
              onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
              style={{ padding: '0px 2px', background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-secondary)' }}
            >
              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
          ) : (
            <div style={{ width: '18px' }} />
          )}
        </div>

        <button
          onClick={() => onNavigate(page.id)}
          style={{
            flex: 1,
            padding: '8px 4px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            borderRadius: 0,
            boxShadow: 'none',
            textAlign: 'left',
            overflow: 'hidden'
          }}
        >
          <FileText size={16} color={activeId === String(page.id) ? 'var(--accent-primary)' : 'var(--text-secondary)'} />
          <span style={{
            fontSize: '0.95rem',
            color: activeId === String(page.id) ? 'var(--text-primary)' : 'var(--text-secondary)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {page.title || 'Untitled'}
          </span>
        </button>

        <PageActionButtons
          page={page}
          onFavorite={onFavorite}
          onCreateChild={onCreateChild}
          onDelete={onDelete}
          isVisible={isHovered || page.is_favorited}
        />
      </div>

      {isExpanded && hasChildren && (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {children.map(child => (
            <PageTreeItem
              key={child.id}
              page={child}
              allPages={allPages}
              level={level + 1}
              activeId={activeId}
              onNavigate={onNavigate}
              onDelete={onDelete}
              onCreateChild={onCreateChild}
              onFavorite={onFavorite}
            />
          ))}
        </ul>
      )}
    </li>
  );
};
