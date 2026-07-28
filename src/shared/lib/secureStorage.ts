import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import { CHUNK_SIZE } from './chunk';

/**
 * Supabase auth-storage adapter backed by expo-secure-store (Keychain /
 * Keystore) so session tokens are encrypted at rest — never plaintext
 * AsyncStorage.
 *
 * SecureStore caps a value at 2048 bytes; a Supabase session (access +
 * refresh + user) exceeds that, so values are transparently chunked
 * across keys `<key>` (chunk count) + `<key>.0..n`.
 *
 * On web SecureStore is unavailable; fall back to localStorage, which is
 * the browser-appropriate store (web is dev-preview only, not a shipping
 * target).
 */
function isWeb(): boolean {
  return Platform.OS === 'web';
}

async function webGet(key: string): Promise<string | null> {
  if (typeof localStorage === 'undefined') return null;
  return localStorage.getItem(key);
}

export const secureStorage = {
  async getItem(key: string): Promise<string | null> {
    if (isWeb()) return webGet(key);

    const header = await SecureStore.getItemAsync(key);
    if (header === null) return null;

    const chunkCount = Number.parseInt(header, 10);
    if (!Number.isInteger(chunkCount) || chunkCount <= 0) {
      // Legacy/unchunked value stored directly under the key.
      return header;
    }

    const parts: string[] = [];
    for (let i = 0; i < chunkCount; i += 1) {
      const part = await SecureStore.getItemAsync(`${key}.${i}`);
      if (part === null) return null; // corrupt/partial write — treat as absent
      parts.push(part);
    }
    return parts.join('');
  },

  async setItem(key: string, value: string): Promise<void> {
    if (isWeb()) {
      if (typeof localStorage !== 'undefined') localStorage.setItem(key, value);
      return;
    }

    await this.removeItem(key);
    const chunkCount = Math.ceil(value.length / CHUNK_SIZE);
    for (let i = 0; i < chunkCount; i += 1) {
      const slice = value.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
      await SecureStore.setItemAsync(`${key}.${i}`, slice);
    }
    await SecureStore.setItemAsync(key, String(chunkCount));
  },

  async removeItem(key: string): Promise<void> {
    if (isWeb()) {
      if (typeof localStorage !== 'undefined') localStorage.removeItem(key);
      return;
    }

    const header = await SecureStore.getItemAsync(key);
    if (header !== null) {
      const chunkCount = Number.parseInt(header, 10);
      if (Number.isInteger(chunkCount) && chunkCount > 0) {
        for (let i = 0; i < chunkCount; i += 1) {
          await SecureStore.deleteItemAsync(`${key}.${i}`);
        }
      }
    }
    await SecureStore.deleteItemAsync(key);
  },
};
