export function createTitle(str: string, length: number = 64) {
  const truncated = str.length > length ? `${str.substring(0, length)}…` : str;
  return `${truncated} | Denopaste`;
}
