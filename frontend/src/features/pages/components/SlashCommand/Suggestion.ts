import { ReactRenderer } from '@tiptap/react';
import tippy, { type Instance, type GetReferenceClientRect } from 'tippy.js';
import { CommandList } from './CommandList';
import { getSuggestionItems, type CommandItem } from './commands';
import { type SuggestionProps, type SuggestionKeyDownProps } from '@tiptap/suggestion';

export default {
  items: getSuggestionItems,

  render: () => {
    let component: ReactRenderer<{ onKeyDown: (props: { event: KeyboardEvent }) => boolean }>;
    let popup: Instance[];

    return {
      onStart: (props: SuggestionProps<CommandItem>) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        component = new ReactRenderer(CommandList as any, {
          props,
          editor: props.editor,
        });

        if (!props.clientRect) {
          return;
        }

        popup = tippy('body', {
          getReferenceClientRect: props.clientRect as GetReferenceClientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start',
        });
      },

      onUpdate(props: SuggestionProps<CommandItem>) {
        component.updateProps(props);

        if (!props.clientRect) {
          return;
        }

        popup[0].setProps({
          getReferenceClientRect: props.clientRect as GetReferenceClientRect,
        });
      },

      onKeyDown(props: SuggestionKeyDownProps) {
        if (props.event.key === 'Escape') {
          popup[0].hide();
          return true;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (component.ref as any)?.onKeyDown(props);
      },

      onExit() {
        popup[0].destroy();
        component.destroy();
      },
    };
  },
};
