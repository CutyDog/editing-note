import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { usePage, useUpdatePage } from '../hooks';
import { Loader2, Globe, Clock, MoreVertical } from 'lucide-react';
import type { Page, UpdatePageParams } from '../types';

interface InternalEditorProps {
  page: Page;
  updatePage: (args: { id: number; params: UpdatePageParams }) => void;
}

const InternalEditor: React.FC<InternalEditorProps> = ({ page, updatePage }) => {
  const [title, setTitle] = useState(page.title);

  const handleTitleBlur = () => {
    if (title !== page.title) {
      updatePage({ id: page.id, params: { title } });
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: 'var(--bg-main)' }}>
      {/* Tool bar */}
      <div style={{
        height: '45px',
        padding: '0 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Globe size={14} />
            <span>Public</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Clock size={14} />
            <span>Edited 2 mins ago</span>
          </div>
        </div>
        <button style={{ background: 'transparent', border: 'none', boxShadow: 'none', padding: '4px' }}>
          <MoreVertical size={18} color="var(--text-secondary)" />
        </button>
      </div>

      {/* Content area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '4rem 6rem' }}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleTitleBlur}
          placeholder="Untitled"
          style={{
            width: '100%',
            fontSize: '2.5rem',
            fontWeight: 700,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--text-primary)',
            marginBottom: '1rem'
          }}
        />

        <div style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', minHeight: '200px' }}>
          {/* Editor content will go here */}
          <p>コンテンツの編集機能は現在開発中です...</p>
        </div>
      </div>
    </div>
  );
};

export const PageEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const pageId = id ? parseInt(id, 10) : null;
  const { data: page, isLoading } = usePage(pageId);
  const { mutate: updatePage } = useUpdatePage();

  if (!id) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
        ページを選択するか、新しく作成してください。
      </div>
    );
  }

  if (isLoading) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={32} className="animate-spin" color="var(--accent-primary)" />
      </div>
    );
  }

  if (!page) return null;

  return <InternalEditor key={page.id} page={page} updatePage={updatePage} />;
};
