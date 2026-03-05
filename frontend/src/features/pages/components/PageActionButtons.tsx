import React from 'react';
import { Star, Plus, Trash2 } from 'lucide-react';
import type { PageSummary } from '../types';

interface PageActionButtonsProps {
  page: PageSummary;
  onFavorite: (e: React.MouseEvent, page: PageSummary) => void;
  onCreateChild: (e: React.MouseEvent, parentId: number) => void;
  onDelete: (e: React.MouseEvent, id: number) => void;
  isVisible: boolean;
}

export const PageActionButtons: React.FC<PageActionButtonsProps> = ({
  page,
  onFavorite,
  onCreateChild,
  onDelete,
  isVisible,
}) => {
  return (
    <div
      className="sidebar-action-group"
      style={{
        display: 'flex',
        gap: '2px',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.2s',
      }}
    >
      <button
        onClick={(e) => onFavorite(e, page)}
        style={{ padding: '4px', borderRadius: '4px', background: 'transparent', border: 'none', outline: 'none', boxShadow: 'none', cursor: 'pointer' }}
        title={page.is_favorited ? 'Unfavorite' : 'Favorite'}
      >
        <Star
          size={14}
          color={page.is_favorited ? 'var(--accent-primary)' : 'var(--text-secondary)'}
          fill={page.is_favorited ? 'var(--accent-primary)' : 'none'}
        />
      </button>
      <button
        onClick={(e) => onCreateChild(e, page.id)}
        style={{ padding: '4px', borderRadius: '4px', background: 'transparent', border: 'none', outline: 'none', boxShadow: 'none', cursor: 'pointer' }}
        title="Add child page"
      >
        <Plus size={14} color="var(--text-secondary)" />
      </button>
      <button
        onClick={(e) => onDelete(e, page.id)}
        className="delete-icon-btn"
        style={{ padding: '4px', borderRadius: '4px', background: 'transparent', border: 'none', outline: 'none', boxShadow: 'none', cursor: 'pointer' }}
        title="Delete page"
      >
        <Trash2 size={14} color="var(--text-secondary)" />
      </button>
    </div>
  );
};
