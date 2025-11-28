'use client';

import { RootProvider } from 'fumadocs-ui/provider';
import type { ReactNode } from 'react';

export function ClientRootProvider({ 
  children,
  ...props
}: { 
  children: ReactNode;
  i18n?: any;
}) {
  return (
    <RootProvider {...props}>
      {children}
    </RootProvider>
  );
}
