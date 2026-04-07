'use client';

import * as React from 'react';
import { Slot } from 'radix-ui';

import { cn } from '@/lib/utils';

type BreadcrumbProps = React.ComponentProps<'nav'>;

function Breadcrumb({ className, ...props }: BreadcrumbProps) {
  return <nav aria-label="breadcrumb" className={cn('w-full', className)} {...props} />;
}

type BreadcrumbListProps = React.ComponentProps<'ol'>;

function BreadcrumbList({ className, ...props }: BreadcrumbListProps) {
  return <ol className={cn('flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground', className)} {...props} />;
}

type BreadcrumbItemProps = React.ComponentProps<'li'>;

function BreadcrumbItem({ className, ...props }: BreadcrumbItemProps) {
  return <li className={cn('inline-flex items-center gap-1.5', className)} {...props} />;
}

type BreadcrumbLinkProps = React.ComponentProps<'a'> & { asChild?: boolean };

function BreadcrumbLink({ asChild = false, className, ...props }: BreadcrumbLinkProps) {
  const Comp = asChild ? Slot.Root : 'a';
  return <Comp className={cn('transition-colors hover:text-foreground', className)} {...props} />;
}

type BreadcrumbPageProps = React.ComponentProps<'span'>;

function BreadcrumbPage({ className, ...props }: BreadcrumbPageProps) {
  return <span aria-current="page" className={cn('font-normal text-foreground', className)} {...props} />;
}

type BreadcrumbSeparatorProps = React.ComponentProps<'li'>;

function BreadcrumbSeparator({ className, children = '/', ...props }: BreadcrumbSeparatorProps) {
  return <li aria-hidden="true" className={cn('text-muted-foreground', className)} {...props}>{children}</li>;
}

export {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
};
