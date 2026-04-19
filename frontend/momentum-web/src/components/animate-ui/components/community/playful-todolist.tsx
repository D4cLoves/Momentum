'use client';

import { motion, type Transition } from 'motion/react';
import { Checkbox } from '@/components/animate-ui/primitives/radix/checkbox';

export type PlayfulTodoItem = {
  id: string;
  label: string;
  isCompleted: boolean;
};

type PlayfulTodolistProps = {
  items: PlayfulTodoItem[];
  onToggle?: (id: string, nextChecked: boolean) => void;
  emptyMessage?: string;
  className?: string;
  showDividers?: boolean;
};

const getPathAnimate = (isChecked: boolean) => ({
  pathLength: isChecked ? 1 : 0,
  opacity: isChecked ? 1 : 0,
});

const getPathTransition = (isChecked: boolean): Transition => ({
  pathLength: { duration: 1, ease: 'easeInOut' },
  opacity: {
    duration: 0.01,
    delay: isChecked ? 0 : 1,
  },
});

function PlayfulTodolist({
  items,
  onToggle,
  emptyMessage = 'No tasks yet. Add the first one.',
  className,
  showDividers = true,
}: PlayfulTodolistProps) {
  return (
    <div
      className={`rounded-2xl bg-neutral-100 p-6 dark:bg-neutral-900 ${className ?? ''}`}
    >
      {items.length === 0 ? (
        <div className="rounded-xl border border-neutral-200 bg-white/80 px-4 py-3 text-sm text-neutral-600 dark:border-neutral-700 dark:bg-neutral-800/70 dark:text-neutral-300">
          {emptyMessage}
        </div>
      ) : (
        <div className="space-y-6">
          {items.map((item, idx) => (
            <div key={item.id} className="space-y-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={item.isCompleted}
                  onCheckedChange={(val) => {
                    onToggle?.(item.id, val === true);
                  }}
                  id={`checkbox-${item.id}`}
                  className="flex size-5 items-center justify-center rounded-sm border border-neutral-400 text-neutral-900 dark:border-neutral-500 dark:text-neutral-100"
                >
                  <motion.span
                    aria-hidden
                    className="select-none text-[12px] font-semibold leading-none text-neutral-900 dark:text-neutral-100"
                    initial={false}
                    animate={{
                      opacity: item.isCompleted ? 1 : 0,
                      scale: item.isCompleted ? 1 : 0.4,
                      y: item.isCompleted ? 0 : 1,
                    }}
                    transition={{
                      opacity: { duration: 0.14 },
                      scale: { duration: 0.2, ease: 'easeOut' },
                      y: { duration: 0.2, ease: 'easeOut' },
                    }}
                  >
                    ✓
                  </motion.span>
                </Checkbox>
                <div className="relative inline-block">
                  <label htmlFor={`checkbox-${item.id}`}>{item.label}</label>
                  <motion.svg
                    width="340"
                    height="32"
                    viewBox="0 0 340 32"
                    className="pointer-events-none absolute left-0 top-1/2 z-20 h-10 w-full -translate-y-1/2"
                  >
                    <motion.path
                      d="M 10 16.91 s 79.8 -11.36 98.1 -11.34 c 22.2 0.02 -47.82 14.25 -33.39 22.02 c 12.61 6.77 124.18 -27.98 133.31 -17.28 c 7.52 8.38 -26.8 20.02 4.61 22.05 c 24.55 1.93 113.37 -20.36 113.37 -20.36"
                      vectorEffect="non-scaling-stroke"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeMiterlimit={10}
                      fill="none"
                      initial={false}
                      animate={getPathAnimate(item.isCompleted)}
                      transition={getPathTransition(item.isCompleted)}
                      className="stroke-neutral-900 dark:stroke-neutral-100"
                    />
                  </motion.svg>
                </div>
              </div>
              {showDividers && idx !== items.length - 1 && (
                <div className="border-t border-neutral-300 dark:border-neutral-700" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export { PlayfulTodolist };
