export const LENGTH = 8;
export const CHARS =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    .split("");

function getRandomCharacter(): string {
  const index = Math.floor(Math.random() * CHARS.length - 1) + 1;
  return CHARS[index];
}

export function createId(length = LENGTH): string {
  return Array.from({ length }, getRandomCharacter).join("");
}
