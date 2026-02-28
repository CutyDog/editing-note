import React, { useEffect } from 'react';
import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';

interface TipTapEditorProps {
  content: Record<string, unknown>[] | undefined;
  onBlur: (content: Record<string, unknown>[]) => void;
}

export const TipTapEditor: React.FC<TipTapEditorProps> = ({ content, onBlur }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
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

  return <EditorContent editor={editor} />;
};
