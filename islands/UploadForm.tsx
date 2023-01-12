import { Signal, useSignal } from "@preact/signals";

import UploadButton from "./UploadButton.tsx";
import { MAX_PASTE_CHARACTERS, uploadText } from "@/utils/data.ts";

export default function UploadForm() {
  const text: Signal<string | undefined> = useSignal(undefined);

  const onInput = (event: Event) => {
    if (event.target instanceof HTMLTextAreaElement) {
      event.preventDefault();
      text.value = event.target.value;
    }
  };

  const upload = async () => {
    if (text.value && text.value.length > 0) {
      return await uploadText(text.value);
    }
  };

  return (
    <div class="flex flex-col flex-1 w-full mb-2">
      <textarea
        type="text"
        class="min-w-full font-mono h-44 rounded box-border px-2 py-2 border(gray-500 2)"
        value={text.value || ""}
        onInput={onInput}
        autoFocus
      />
      <p
        class={`text-xs text-right ${
          (text.value || "").length < MAX_PASTE_CHARACTERS
            ? "text-gray-500"
            : "text-red-500"
        }`}
      >
        {`${(text.value || "").length} / ${MAX_PASTE_CHARACTERS}`}
      </p>
      <div class="ml-auto mt-4 mb-4">
        <UploadButton onClick={upload} />
      </div>
    </div>
  );
}
