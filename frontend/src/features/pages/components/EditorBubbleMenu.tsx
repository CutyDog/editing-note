import React from 'react';
import { BubbleMenu } from '@tiptap/react/menus';
import { type Editor } from '@tiptap/react';
import { Bold, Italic, Strikethrough, Heading1, Heading2, List, ListOrdered } from 'lucide-react';

interface EditorBubbleMenuProps {
  editor: Editor;
}

export const EditorBubbleMenu: React.FC<EditorBubbleMenuProps> = ({ editor }) => {
  const getMenuBtnStyle = (isActive: boolean): React.CSSProperties => ({
    background: isActive ? 'var(--accent-primary)' : 'transparent',
    color: isActive ? '#000' : 'var(--text-primary)',
    border: 'none',
    boxShadow: 'none',
    padding: '6px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  });

  return (
    <BubbleMenu editor={editor}>
      <div style={{
        display: 'flex',
        gap: '4px',
        padding: '4px',
        borderRadius: '8px',
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
        border: '1px solid var(--border-color)',
      }}>
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          style={getMenuBtnStyle(editor.isActive('bold'))}
        >
          <Bold size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          style={getMenuBtnStyle(editor.isActive('italic'))}
        >
          <Italic size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          style={getMenuBtnStyle(editor.isActive('strike'))}
        >
          <Strikethrough size={16} />
        </button>
        <div style={{ width: '1px', background: 'var(--border-color)', margin: '0 4px' }} />
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          style={getMenuBtnStyle(editor.isActive('heading', { level: 1 }))}
        >
          <Heading1 size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          style={getMenuBtnStyle(editor.isActive('heading', { level: 2 }))}
        >
          <Heading2 size={16} />
        </button>
        <div style={{ width: '1px', background: 'var(--border-color)', margin: '0 4px' }} />
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          style={getMenuBtnStyle(editor.isActive('bulletList'))}
        >
          <List size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          style={getMenuBtnStyle(editor.isActive('orderedList'))}
        >
          <ListOrdered size={16} />
        </button>
      </div>
    </BubbleMenu>
  );
};
