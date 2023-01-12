export const MAX_PASTE_CHARACTERS = 2 * 1000 * 10;

export function uploadText(text: string): Promise<void> {
  console.log("UPLOAD TEXT: ", text.length);

  return new Promise((resolve) => {
    setTimeout(() => resolve(), 1000);
  });
}
