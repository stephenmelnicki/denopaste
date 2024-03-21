import { useSignal } from "@preact/signals";

interface Props {
  contents: string;
}

export default function CopyToClipboardButton({ contents }: Props) {
  const text = useSignal("Copy to clipboard");

  async function writeToClipboard() {
    try {
      await navigator.clipboard.writeText(contents);
      text.value = "Copied!";
      setTimeout(() => text.value = "Copy to clipboard", 750);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <button
      id="copy-btn"
      class="px-4 py-2 font-semibold rounded-md bg-blue-600 text-white hover:bg-blue-500"
      type="button"
      onClick={writeToClipboard}
    >
      {text}
    </button>
  );
}
