/** SecureStore caps a stored value at 2048 bytes; we chunk under that. */
export const CHUNK_SIZE = 2000;

/** Number of chunks a value splits into. Pure — unit-tested standalone. */
export function chunkCountFor(value: string, chunkSize = CHUNK_SIZE): number {
  return Math.ceil(value.length / chunkSize);
}
