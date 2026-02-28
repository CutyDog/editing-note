import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { type CommandItem } from './commands';

interface CommandListProps {
  items: CommandItem[];
  command: (item: CommandItem) => void;
}

export const CommandList = forwardRef((props: CommandListProps, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index: number) => {
    const item = props.items[index];
    if (item) {
      props.command(item);
    }
  };

  useEffect(() => setSelectedIndex(0), [props.items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === 'ArrowUp') {
        setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length);
        return true;
      }

      if (event.key === 'ArrowDown') {
        setSelectedIndex((selectedIndex + 1) % props.items.length);
        return true;
      }

      if (event.key === 'Enter') {
        selectItem(selectedIndex);
        return true;
      }

      return false;
    },
  }));

  if (props.items.length === 0) {
    return null;
  }

  return (
    <div style={{
      background: 'var(--glass-bg)',
      backdropFilter: 'blur(16px)',
      border: '1px solid var(--border-color)',
      borderRadius: '8px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
      padding: '4px',
      display: 'flex',
      flexDirection: 'column',
      width: '280px',
      overflow: 'hidden',
    }}>
      {props.items.map((item, index) => (
        <button
          key={index}
          onClick={() => selectItem(index)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '8px 12px',
            background: index === selectedIndex ? 'rgba(88, 166, 255, 0.15)' : 'transparent',
            border: 'none',
            borderRadius: '6px',
            width: '100%',
            textAlign: 'left',
            cursor: 'pointer',
            transition: 'all 0.1s ease',
            color: index === selectedIndex ? 'var(--accent-primary)' : 'var(--text-primary)',
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '6px',
            flexShrink: 0,
          }}>
            <item.icon size={18} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.title}</span>
            <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>{item.description}</span>
          </div>
        </button>
      ))}
    </div>
  );
});

CommandList.displayName = 'CommandList';
