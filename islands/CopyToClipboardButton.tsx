import { useCallback } from "preact/hooks";
import { useSignal } from "@preact/signals";
import { GoCopy } from "@preact-icons/go";

interface Props {
  contents: string;
}

export default function CopyToClipboardButton({ contents }: Props) {
  const title = useSignal<string>("Copy to Clipboard");
  const wiggle = useSignal<boolean>(false);

  const writeToClipboard = useCallback(async () => {
    wiggle.value = true;

    try {
      await navigator.clipboard.writeText(contents);
      title.value = "Copied!";
      setTimeout(() => title.value = "Copy to Clipboard", 2000);
      console.log("copied");
    } catch (err) {
      console.error("error copying to clipboard", err);
    }
  }, [wiggle]);

  const onAnimationEnd = useCallback(() => wiggle.value = false, [wiggle]);

  return (
    <button
      data-testid="copy"
      type="button"
      title={title.value}
      class={`${
        wiggle.value && "animate-wiggle"
      } px-2 py-2 rounded-md hover:bg-gray-50 focus:z-20 focus:outline-offset-0`}
      onClick={writeToClipboard}
      onAnimationEnd={onAnimationEnd}
    >
      <span class="sr-only">Copy to Clipboard</span>
      <GoCopy class="w-5 h-5 " />
    </button>
  );
}
