import { useCallback } from "preact/hooks";
import { useSignal } from "@preact/signals";
import { GoCheck, GoCopy } from "@preact-icons/go";

interface Props {
  contents: string;
}

export default function CopyToClipboardButton({ contents }: Props) {
  const title = useSignal<"Copy" | "Copied">("Copy");

  const writeToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(contents);
      title.value = "Copied";
      setTimeout(() => title.value = "Copy", 1250);
    } catch (err) {
      console.error("error copying paste to clipboard", err);
    }
  }, [title, contents]);

  return (
    <button
      title={title.value}
      data-testid="copy"
      type="button"
      class="px-2 py-2 rounded-md hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
      onClick={writeToClipboard}
    >
      <span class="sr-only">Copy to Clipboard</span>
      {title.value === "Copy"
        ? <GoCopy class="w-5 h-5" />
        : <GoCheck class="w-5 h-5 text-green-700" />}
    </button>
  );
}
