import { useCallback } from "preact/hooks";
import { GoDownload } from "@preact-icons/go";

interface Props {
  id: string;
  contents: string;
}

export default function DownloadButton({ id, contents }: Props) {
  const writeToFile = useCallback(() => {
    try {
      const anchor = document.createElement("a");
      anchor.setAttribute("download", `${id}.txt`);
      const href = URL.createObjectURL(
        new Blob([contents], { type: "text/plain" }),
      );
      anchor.href = href;
      anchor.setAttribute("target", "_blank");
      anchor.click();
      setTimeout(() => {
        URL.revokeObjectURL(href);
        document.removeChild(anchor);
      }, 0);
    } catch (err) {
      console.error("error downloading paste", err);
    }
  }, [id, contents]);

  return (
    <button
      data-testid="download"
      title="Download raw file"
      type="button"
      class="px-2 py-2 rounded-md hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
      onClick={writeToFile}
    >
      <span class="sr-only">Download raw file</span>
      <GoDownload class="w-5 h-5 " />
    </button>
  );
}
