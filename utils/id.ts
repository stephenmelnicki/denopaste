const CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function getRandomCharacter() {
  return CHARS.charAt(Math.floor(Math.random() * CHARS.length));
}

export function createId(length = 8) {
  return Array.from({ length }, getRandomCharacter).join("");
}
