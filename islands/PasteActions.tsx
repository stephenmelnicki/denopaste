import { useMemo } from "preact/hooks";

import Paste from "../data/paste.ts";
import CopyToClipboardButton from "./CopyToClipboardButton.tsx";
import DownloadButton from "./DownloadButton.tsx";
import { bytesSize } from "../utils/size.ts";

interface Props {
  paste: Paste;
}

export default function PasteActions({ paste }: Props) {
  const lineCount = useMemo(() => paste.contents.trim().split("\n").length, [
    paste,
  ]);

  const byteCount = useMemo(
    () => bytesSize(paste.contents),
    [paste],
  );

  return (
    <div class="flex items-center justify-between border rounded-t-md bg-gray-100 border-gray-300">
      <div class="pl-3 py-3 flex items-center gap-2">
        <p>{`${lineCount} lines`}</p>
        <span>&bull;</span>
        <p>{byteCount}</p>
      </div>
      <nav class="px-2 flex items-center justify-end">
        <a
          data-testid="view-raw"
          class="p-2 hover:underline"
          href={`/${paste.id}/raw`}
        >
          View Raw
        </a>
        <CopyToClipboardButton contents={paste.contents} />
        <DownloadButton id={paste.id} contents={paste.contents} />
      </nav>
    </div>
  );
}
