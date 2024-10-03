import { useCallback } from "preact/hooks";
import { useSignal } from "@preact/signals";
import { GoCopy } from "@preact-icons/go";

import Tooltip from "../components/Tooltip.tsx";

interface Props {
  contents: string;
}

export default function CopyToClipboardButton({ contents }: Props) {
  const message = useSignal<string>("Copy to Clipboard");

  const writeToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(contents);
      message.value = "Copied!";
      setTimeout(() => message.value = "Copy to Clipboard", 1000);
    } catch (err) {
      console.error("error copying to clipboard", err);
    }
  }, [message]);

  return (
    <Tooltip message={message.value}>
      <button
        data-testid="copy"
        type="button"
        class="px-2 py-2 rounded-md hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
        onClick={writeToClipboard}
      >
        <span class="sr-only">Copy to Clipboard</span>
        <GoCopy class="w-5 h-5 " />
      </button>
    </Tooltip>
  );
}
