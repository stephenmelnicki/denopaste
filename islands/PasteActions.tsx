import { useMemo } from "preact/hooks";

import Paste from "../data/paste.ts";
import CopyToClipboardButton from "../islands/CopyToClipboardButton.tsx";
import DownloadButton from "../islands/DownloadButton.tsx";
import { byteSize } from "../utils/bytes.ts";

interface Props {
  paste: Paste;
}

export default function PasteActions({ paste }: Props) {
  const lines = useMemo(
    () => paste.contents.trim().split("\n").length,
    [paste],
  );

  const bytes = useMemo(
    () => byteSize(paste.contents),
    [paste],
  );

  return (
    <div class="flex items-center justify-between border rounded-t-md bg-gray-100 border-gray-300">
      <div class="pl-3 py-3 flex items-center gap-2">
        <p>{`${lines} lines`}</p>
        <span>&bull;</span>
        <p>{bytes}</p>
      </div>
      <nav class="px-2 flex items-center justify-end">
        <a
          data-testid="view-raw"
          class="p-2 hover:underline hover:text-blue-600"
          href={`/${paste.id}/raw`}
        >
          View Raw
        </a>
        <CopyToClipboardButton contents={paste.contents} />
        <DownloadButton {...paste} />
      </nav>
    </div>
  );
}
