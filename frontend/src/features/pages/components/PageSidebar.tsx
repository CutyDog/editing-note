import React from 'react';
import { usePages, useCreatePage, useDeletePage } from '../hooks';
import { Plus, Loader2, Library } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageTreeItem } from './PageTreeItem';

export const PageSidebar: React.FC = () => {
  const { data: pages, isLoading } = usePages();
  const { mutate: createPage, isPending: isCreating } = useCreatePage();
  const { mutate: deletePage } = useDeletePage();
  const navigate = useNavigate();
  const { id: activeId } = useParams<{ id: string }>();

  const handleCreatePage = () => {
    createPage({ title: 'Untitled' }, {
      onSuccess: (newPage) => {
        navigate(`/pages/${newPage.id}`);
      }
    });
  };

  const handleCreateChildPage = (e: React.MouseEvent, parentId: number) => {
    e.stopPropagation();
    createPage({ title: 'Untitled', parent_id: parentId }, {
      onSuccess: (newPage) => {
        navigate(`/pages/${newPage.id}`);
      }
    });
  };

  const rootPages = pages?.filter(p => !p.parent_id).sort((a, b) => a.position - b.position) || [];

  const handleDeletePage = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (confirm('このページを削除してもよろしいですか？')) {
      deletePage(id, {
        onSuccess: () => {
          if (activeId === String(id)) {
            navigate('/pages');
          }
        }
      });
    }
  };

  return (
    <div className="page-sidebar" style={{
      width: '280px',
      height: '100vh',
      backgroundColor: 'var(--bg-card)',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      padding: '1rem 0',
      textAlign: 'left'
    }}>
      <div style={{ padding: '0 1rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div
          onClick={() => navigate('/pages')}
          className="sidebar-header-link"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          title="All Pages"
        >
          <Library size={18} color="var(--text-secondary)" style={{ transition: 'color 0.2s ease' }} />
          <h2 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0, transition: 'color 0.2s ease' }}>
            Pages
          </h2>
        </div>
        <button
          onClick={handleCreatePage}
          disabled={isCreating}
          style={{ padding: '4px', borderRadius: '4px', background: 'transparent', boxShadow: 'none', outline: 'none' }}
        >
          {isCreating ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {isLoading ? (
          <div style={{ padding: '1rem', display: 'flex', justifyContent: 'center' }}>
            <Loader2 size={24} className="animate-spin" color="var(--text-secondary)" />
          </div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {rootPages.map((page) => (
              <PageTreeItem
                key={page.id}
                page={page}
                allPages={pages || []}
                level={0}
                activeId={activeId}
                onNavigate={(id) => navigate(`/pages/${id}`)}
                onDelete={handleDeletePage}
                onCreateChild={handleCreateChildPage}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
