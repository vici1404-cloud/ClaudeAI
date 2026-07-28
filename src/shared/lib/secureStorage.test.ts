import { describe, expect, it } from 'vitest';

import { chunkCountFor } from './chunk';

describe('chunkCountFor', () => {
  it('uses a single chunk for short values', () => {
    expect(chunkCountFor('x', 2000)).toBe(1);
    expect(chunkCountFor('a'.repeat(2000), 2000)).toBe(1);
  });

  it('splits values that exceed the chunk size', () => {
    expect(chunkCountFor('a'.repeat(2001), 2000)).toBe(2);
    expect(chunkCountFor('a'.repeat(5000), 2000)).toBe(3);
  });

  it('handles empty input without demanding a chunk', () => {
    expect(chunkCountFor('', 2000)).toBe(0);
  });
});
