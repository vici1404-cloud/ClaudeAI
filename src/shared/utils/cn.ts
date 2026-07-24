import { clsx, type ClassValue } from 'clsx';

/** Composes NativeWind class names conditionally. */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
