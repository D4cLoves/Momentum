'use client';

import * as React from 'react';

type SheetProps = React.ComponentProps<'div'> & {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

function Sheet({ open = true, children }: SheetProps) {
  if (!open) return null;
  return <>{children}</>;
}

type SheetContentProps = React.ComponentProps<'div'> & {
  side?: 'left' | 'right' | 'top' | 'bottom';
};

function SheetContent({ children, ...props }: SheetContentProps) {
  return <div {...props}>{children}</div>;
}

function SheetHeader(props: React.ComponentProps<'div'>) {
  return <div {...props} />;
}

function SheetTitle(props: React.ComponentProps<'h2'>) {
  return <h2 {...props} />;
}

function SheetDescription(props: React.ComponentProps<'p'>) {
  return <p {...props} />;
}

export { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle };
