/**
 * Calculate the approximate size of a string in bytes or kilobytes
 *
 * @example Usage
 * ```ts
 * import { expect } from "jsr:@std/expect";
 *
 * expect(byteSize("Hello, world!")).toEqual("13 Bytes");
 * expect(byteSize("A".repeat(1024))).toEqual("1.00 KB");
 * ```
 *
 * @param contents The string to approximate the size of
 * @returns The approximate size of the file contents in bytes or kilobytes
 */
export function byteSize(contents: string): string {
  const size = new TextEncoder().encode(contents).length;
  return size < 1024 ? `${size} Bytes` : `${(size / 1024).toFixed(2)} KB`;
}
