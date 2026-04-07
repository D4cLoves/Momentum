'use client';

import * as React from 'react';
import { Avatar as AvatarPrimitive } from 'radix-ui';

import { cn } from '@/lib/utils';

type AvatarProps = React.ComponentProps<typeof AvatarPrimitive.Root>;

function Avatar({ className, ...props }: AvatarProps) {
  return <AvatarPrimitive.Root className={cn('relative flex size-10 shrink-0 overflow-hidden rounded-full', className)} {...props} />;
}

type AvatarImageProps = React.ComponentProps<typeof AvatarPrimitive.Image>;

function AvatarImage({ className, ...props }: AvatarImageProps) {
  return <AvatarPrimitive.Image className={cn('aspect-square size-full', className)} {...props} />;
}

type AvatarFallbackProps = React.ComponentProps<typeof AvatarPrimitive.Fallback>;

function AvatarFallback({ className, ...props }: AvatarFallbackProps) {
  return <AvatarPrimitive.Fallback className={cn('bg-muted flex size-full items-center justify-center rounded-full', className)} {...props} />;
}

export { Avatar, AvatarFallback, AvatarImage };
