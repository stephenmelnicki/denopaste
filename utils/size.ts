export function bytesSize(contents: string): string {
  const size = new TextEncoder().encode(contents).length;
  return size < 1024 ? `${size} Bytes` : `${(size / 1024).toFixed(2)} KB`;
}
