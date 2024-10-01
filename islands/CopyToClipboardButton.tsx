import { useSignal } from "@preact/signals";

const COPY_TO_CLIPBOARD = "Copy to Clipboard";
const COPIED = "Copied!";

interface Props {
  contents: string;
}

export default function CopyToClipboardButton({ contents }: Props) {
  const text = useSignal<string>(COPY_TO_CLIPBOARD);

  async function writeToClipboard() {
    try {
      await navigator.clipboard.writeText(contents);
      text.value = COPIED;
      setTimeout(() => text.value = COPY_TO_CLIPBOARD, 750);
    } catch (err) {
      console.error("error copying to clipboard", err);
    }
  }

  return (
    <button
      id="copy-btn"
      type="button"
      class={`py-2 font-semibold rounded-md bg-green-600 text-white hover:bg-green-500 ${
        text.value === COPY_TO_CLIPBOARD ? "px-4" : "px-[3.37rem]"
      }`}
      onClick={writeToClipboard}
    >
      {text}
    </button>
  );
}
