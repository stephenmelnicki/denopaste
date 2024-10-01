import { useCallback } from "preact/hooks";
import { useSignal } from "@preact/signals";
import { GoDownload } from "@preact-icons/go";

interface Props {
  id: string;
  contents: string;
}

export default function DownloadButton({ id, contents }: Props) {
  const wiggle = useSignal<boolean>(false);

  const writeToFile = useCallback(() => {
    wiggle.value = true;

    try {
      const anchor = document.createElement("a");
      anchor.setAttribute("download", `${id}.txt`);
      const href = URL.createObjectURL(
        new Blob([contents], { type: "text/plain" }),
      );
      anchor.href = href;
      anchor.setAttribute("target", "_blank");
      anchor.click();
      URL.revokeObjectURL(href);
    } catch (err) {
      console.error(err);
    }
  }, [wiggle]);

  const onAnimationEnd = useCallback(() => wiggle.value = false, [wiggle]);

  return (
    <button
      data-testid="download"
      type="button"
      title="Download raw file"
      class={`${
        wiggle.value && "animate-wiggle"
      } px-2 py-2 rounded-md hover:bg-gray-50 focus:z-20 focus:outline-offset-0`}
      onClick={writeToFile}
      onAnimationEnd={onAnimationEnd}
    >
      <span class="sr-only">Download raw file</span>
      <GoDownload class="w-5 h-5 " />
    </button>
  );
}
