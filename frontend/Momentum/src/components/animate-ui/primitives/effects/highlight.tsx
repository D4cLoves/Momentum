'use client';

import * as React from 'react';
import { motion, type Transition } from 'motion/react';

import { cn } from '@/lib/utils';

type HighlightProps = React.ComponentProps<'div'> & {
  enabled?: boolean;
  hover?: boolean;
  controlledItems?: boolean;
  mode?: 'parent' | 'child';
  containerClassName?: string;
  forceUpdateBounds?: boolean;
  transition?: Transition;
};

type HighlightContextType = {
  enabled: boolean;
  transition?: Transition;
  activeId: string | null;
  setActive: (id: string, el: HTMLDivElement | null) => void;
};

const HighlightContext = React.createContext<HighlightContextType | null>(null);

function Highlight({
  children,
  containerClassName,
  enabled = true,
  transition = { type: 'spring', stiffness: 250, damping: 28 },
}: HighlightProps) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [rect, setRect] = React.useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  const setActive = React.useCallback((id: string, el: HTMLDivElement | null) => {
    setActiveId(id);

    if (!enabled || !el || !containerRef.current) return;

    const itemRect = el.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();

    setRect({
      x: itemRect.left - containerRect.left,
      y: itemRect.top - containerRect.top,
      width: itemRect.width,
      height: itemRect.height,
    });
  }, [enabled]);

  const contextValue = React.useMemo<HighlightContextType>(
    () => ({
      enabled,
      transition,
      activeId,
      setActive,
    }),
    [enabled, transition, activeId, setActive],
  );

  return (
    <HighlightContext.Provider value={contextValue}>
      <div ref={containerRef} className={cn('relative', containerClassName)}>
        {enabled && rect ? (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute z-0 rounded-md bg-sidebar-accent"
            animate={{
              x: rect.x,
              y: rect.y,
              width: rect.width,
              height: rect.height,
            }}
            transition={transition}
          />
        ) : null}
        <div className="relative z-10">{children}</div>
      </div>
    </HighlightContext.Provider>
  );
}

type HighlightItemProps = React.ComponentProps<'div'> & {
  activeClassName?: string;
};

function HighlightItem({ children, activeClassName, className }: HighlightItemProps) {
  const context = React.useContext(HighlightContext);
  const id = React.useId();
  const ref = React.useRef<HTMLDivElement | null>(null);

  const isActive = context?.activeId === id;

  const activate = React.useCallback(() => {
    context?.setActive(id, ref.current);
  }, [context, id]);

  return (
    <div
      ref={ref}
      className={cn('relative', className, isActive && activeClassName)}
      onMouseEnter={activate}
      onFocus={activate}
    >
      {children}
    </div>
  );
}

export { Highlight, HighlightItem };
