import React, { useEffect } from 'react';
import { useEditor, EditorContent, BubbleMenu, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold, Italic, Strikethrough, Heading1, Heading2, List, ListOrdered } from 'lucide-react';

interface TipTapEditorProps {
  content: Record<string, unknown>[] | undefined;
  onBlur: (content: Record<string, unknown>[]) => void;
}

export const TipTapEditor: React.FC<TipTapEditorProps> = ({ content, onBlur }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Placeholder.configure({
        placeholder: 'コンテンツを入力するか «/» を入力してコマンドを呼び出します...',
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    // DBは中身の配列を保持しているので、TipTapにはドキュメント全体として渡す
    content: content && content.length > 0 ? { type: 'doc', content } : '',
    onBlur: ({ editor }: { editor: Editor }) => {
      const json = editor.getJSON();
      // DB保存用にコンテンツの配列を抽出して渡す
      onBlur((json.content as Record<string, unknown>[]) || []);
    },
    editorProps: {
      attributes: {
        class: 'prose-editor focus:outline-none',
      },
    },
  });

  useEffect(() => {
    return () => {
      if (editor) {
        editor.destroy();
      }
    };
  }, [editor]);

  if (!editor) {
    return null;
  }

  // BubbleMenu用のボタンスタイルヘルパー
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
  });

  return (
    <div style={{ position: 'relative' }}>
      <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
        <div className="card" style={{
          display: 'flex',
          gap: '4px',
          padding: '4px',
          borderRadius: '8px',
          background: 'var(--glass-bg)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
          border: '1px solid var(--border-color)',
        }}>
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            style={getMenuBtnStyle(editor.isActive('bold'))}
            title="Bold"
          >
            <Bold size={16} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            style={getMenuBtnStyle(editor.isActive('italic'))}
            title="Italic"
          >
            <Italic size={16} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            style={getMenuBtnStyle(editor.isActive('strike'))}
            title="Strikethrough"
          >
            <Strikethrough size={16} />
          </button>
          <div style={{ width: '1px', background: 'var(--border-color)', margin: '0 4px' }} />
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            style={getMenuBtnStyle(editor.isActive('heading', { level: 1 }))}
            title="Heading 1"
          >
            <Heading1 size={16} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            style={getMenuBtnStyle(editor.isActive('heading', { level: 2 }))}
            title="Heading 2"
          >
            <Heading2 size={16} />
          </button>
          <div style={{ width: '1px', background: 'var(--border-color)', margin: '0 4px' }} />
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            style={getMenuBtnStyle(editor.isActive('bulletList'))}
            title="Bullet List"
          >
            <List size={16} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            style={getMenuBtnStyle(editor.isActive('orderedList'))}
            title="Ordered List"
          >
            <ListOrdered size={16} />
          </button>
        </div>
      </BubbleMenu>

      <EditorContent editor={editor} />
    </div>
  );
};
