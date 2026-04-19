'use client';

import * as React from 'react';
import { Slot } from 'radix-ui';

type TooltipPlacementProps = {
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
};

type TooltipProviderProps = React.ComponentProps<'div'> & {
  openDelay?: number;
};

function TooltipProvider({ children }: TooltipProviderProps) {
  return <>{children}</>;
}

function Tooltip({
  children,
  side: _side,
  align: _align,
  sideOffset: _sideOffset,
}: React.ComponentProps<'div'> & TooltipPlacementProps) {
  return <>{children}</>;
}

type TooltipTriggerProps = React.ComponentProps<'button'> & {
  asChild?: boolean;
};

function TooltipTrigger({
  asChild = false,
  children,
  ...props
}: TooltipTriggerProps) {
  const Comp = asChild ? Slot.Root : 'button';
  return <Comp {...props}>{children}</Comp>;
}

type TooltipContentProps = React.ComponentProps<'div'>;

function TooltipContent({
  children,
  side: _side,
  align: _align,
  sideOffset: _sideOffset,
  ...props
}: TooltipContentProps & TooltipPlacementProps) {
  return <div {...props}>{children}</div>;
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
