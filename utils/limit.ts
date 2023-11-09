export function exceedsStorageLimit(input: string) {
  // Values in KV have a maximum size of 64 KiB
  return new TextEncoder().encode(input).length > (64 * 1024);
}
