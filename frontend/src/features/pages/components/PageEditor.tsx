import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { usePage, useUpdatePage } from '../hooks';
import { Loader2, Globe, Clock, MoreVertical, FileText } from 'lucide-react';
import type { Page, UpdatePageParams } from '../types';
import { TipTapEditor } from './TipTapEditor';

interface InternalEditorProps {
  page: Page;
  updatePage: (args: { id: number; params: UpdatePageParams }) => void;
}

const getRelativeTimeString = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  return date.toLocaleDateString();
};

const InternalEditor: React.FC<InternalEditorProps> = ({ page, updatePage }) => {
  const [title, setTitle] = useState(page.title);
  const [isSaving, setIsSaving] = useState(false);
  const saveTimeoutRef = React.useRef<number | null>(null);

  const debounceUpdate = (params: UpdatePageParams) => {
    setIsSaving(true);
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = window.setTimeout(() => {
      updatePage({ id: page.id, params });
      saveTimeoutRef.current = null;
      setIsSaving(false);
    }, 1000);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    debounceUpdate({ title: newTitle });
  };

  const handleTitleBlur = () => {
    if (title !== page.title) {
      updatePage({ id: page.id, params: { title } });
    }
  };

  const handleContentBlur = (content: Record<string, unknown>[]) => {
    updatePage({ id: page.id, params: { content } });
  };

  const handleContentChange = (content: Record<string, unknown>[]) => {
    debounceUpdate({ content });
  };

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

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
            <span style={{ minWidth: '80px' }}>
              {isSaving ? 'Saving...' : `Edited ${getRelativeTimeString(new Date(page.updated_at))}`}
            </span>
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
          onChange={handleTitleChange}
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

        <div style={{ fontSize: '1.1rem', minHeight: '300px' }}>
          <TipTapEditor content={page.content} onBlur={handleContentBlur} onChange={handleContentChange} />
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
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-main)',
        color: 'var(--text-secondary)'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', opacity: 0.5 }}>
          <FileText size={48} />
          <p style={{ margin: 0, fontSize: '1rem', fontWeight: 500 }}>Select a page from the sidebar</p>
        </div>
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
