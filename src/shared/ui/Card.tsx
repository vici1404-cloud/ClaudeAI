import type { ReactNode } from 'react';
import { View } from 'react-native';

import { cn } from '@/shared/utils/cn';

export interface CardProps {
  children: ReactNode;
  className?: string;
  raised?: boolean;
}

/** Opaque content card for dense lists where blur would cost performance. */
export function Card({ children, className, raised = false }: CardProps) {
  return (
    <View
      className={cn(
        'rounded-card border border-glass-border p-4',
        raised ? 'bg-surface-raised' : 'bg-surface',
        className,
      )}
    >
      {children}
    </View>
  );
}
