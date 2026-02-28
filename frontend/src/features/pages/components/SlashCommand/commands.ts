import { type Editor, type Range } from '@tiptap/react';
import {
  Heading1, Heading2, Heading3,
  List, ListOrdered,
  Quote, Code
} from 'lucide-react';

export interface CommandItem {
  title: string;
  description: string;
  icon: any;
  command: (props: { editor: Editor; range: Range }) => void;
}

export const getSuggestionItems = ({ query }: { query: string }): CommandItem[] => {
  return [
    {
      title: '見出し 1',
      description: '大きな見出しを作成します',
      icon: Heading1,
      command: ({ editor, range }: { editor: Editor; range: Range }) => {
        editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run();
      },
    },
    {
      title: '見出し 2',
      description: '中くらいの見出しを作成します',
      icon: Heading2,
      command: ({ editor, range }: { editor: Editor; range: Range }) => {
        editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run();
      },
    },
    {
      title: '見出し 3',
      description: '小さな見出しを作成します',
      icon: Heading3,
      command: ({ editor, range }: { editor: Editor; range: Range }) => {
        editor.chain().focus().deleteRange(range).setNode('heading', { level: 3 }).run();
      },
    },
    {
      title: '箇条書き',
      description: 'シンプルな箇条書きリストを作成します',
      icon: List,
      command: ({ editor, range }: { editor: Editor; range: Range }) => {
        editor.chain().focus().deleteRange(range).toggleBulletList().run();
      },
    },
    {
      title: '番号付きリスト',
      description: '番号付きのリストを作成します',
      icon: ListOrdered,
      command: ({ editor, range }: { editor: Editor; range: Range }) => {
        editor.chain().focus().deleteRange(range).toggleOrderedList().run();
      },
    },
    {
      title: '引用',
      description: '引用文を作成します',
      icon: Quote,
      command: ({ editor, range }: { editor: Editor; range: Range }) => {
        editor.chain().focus().deleteRange(range).toggleBlockquote().run();
      },
    },
    {
      title: 'コードブロック',
      description: 'ソースコードのブロックを作成します',
      icon: Code,
      command: ({ editor, range }: { editor: Editor; range: Range }) => {
        editor.chain().focus().deleteRange(range).toggleCodeBlock().run();
      },
    },
  ].filter(item =>
    item.title.toLowerCase().startsWith(query.toLowerCase()) ||
    item.description.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 10);
};
