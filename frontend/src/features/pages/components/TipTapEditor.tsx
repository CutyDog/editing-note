import { useEffect } from 'react';
import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { EditorBubbleMenu } from './EditorBubbleMenu';
import { SlashCommand } from './SlashCommand';

interface TipTapEditorProps {
  content: Record<string, unknown>[] | undefined;
  onBlur: (content: Record<string, unknown>[]) => void;
  onChange?: (content: Record<string, unknown>[]) => void;
}

export const TipTapEditor: React.FC<TipTapEditorProps> = ({ content, onBlur, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Placeholder.configure({
        placeholder: '「/」を入力してメニューを呼び出す',
        emptyEditorClass: 'is-editor-empty',
      }),
      SlashCommand,
    ],
    content: content && content.length > 0 ? { type: 'doc', content } : '',
    onUpdate: ({ editor }: { editor: Editor }) => {
      const json = editor.getJSON();
      if (onChange) {
        onChange((json.content as Record<string, unknown>[]) || []);
      }
    },
    onBlur: ({ editor }: { editor: Editor }) => {
      const json = editor.getJSON();
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

  return (
    <div style={{ position: 'relative' }}>
      <EditorBubbleMenu editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};
