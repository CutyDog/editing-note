import { useCallback, useEffect, useRef, useState } from 'react';

const MIN_WIDTH = 180;
const MAX_WIDTH = 480;
const DEFAULT_WIDTH = 280;
const STORAGE_KEY = 'sidebar_width';

export const useSidebarResize = () => {
  const [sidebarWidth, setSidebarWidth] = useState<number>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? parseInt(stored, 10) : DEFAULT_WIDTH;
  });
  const [isResizing, setIsResizing] = useState(false);
  const startXRef = useRef<number>(0);
  const startWidthRef = useRef<number>(0);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsResizing(true);
      startXRef.current = e.clientX;
      startWidthRef.current = sidebarWidth;
    },
    [sidebarWidth]
  );

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const delta = e.clientX - startXRef.current;
      const newWidth = Math.min(
        MAX_WIDTH,
        Math.max(MIN_WIDTH, startWidthRef.current + delta)
      );
      setSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      // 幅を localStorage に永続化
      localStorage.setItem(STORAGE_KEY, String(sidebarWidth));
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, sidebarWidth]);

  // localStorage への書き込みはドラッグ終了時に確実に最新値で行う
  const handleMouseUp = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, String(sidebarWidth));
  }, [sidebarWidth]);

  return { sidebarWidth, isResizing, handleMouseDown, handleMouseUp };
};
