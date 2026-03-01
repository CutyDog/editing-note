import React from 'react';
import { usePages, useCreatePage, useDeletePage } from '../hooks';
import { Plus, Loader2, Library, User as UserIcon } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageTreeItem } from './PageTreeItem';
import { useMe, ProfileModal } from '../../auth';

export const PageSidebar: React.FC = () => {
  const { data: pages, isLoading } = usePages();
  const { mutate: createPage, isPending: isCreating } = useCreatePage();
  const { mutate: deletePage } = useDeletePage();
  const navigate = useNavigate();
  const { id: activeId } = useParams<{ id: string }>();
  const { data: me } = useMe();
  const [isProfileModalOpen, setIsProfileModalOpen] = React.useState(false);

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
      textAlign: 'left'
    }}>
      {/* User settings section */}
      <div
        className="sidebar-header-link"
        onClick={() => setIsProfileModalOpen(true)}
        style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1rem' }}
      >
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: 'rgba(88, 166, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <UserIcon size={18} color="var(--accent-primary)" />
        </div>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {me?.profile?.name || 'Loading...'}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {me?.email}
          </div>
        </div>
      </div>

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

      <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
    </div>
  );
};
