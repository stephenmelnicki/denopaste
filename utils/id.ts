export const CHARS =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function getRandomCharacter(): string {
  return CHARS.charAt(Math.floor(Math.random() * CHARS.length));
}

export function createId(length = 8): string {
  return Array.from({ length }, getRandomCharacter).join("");
}
