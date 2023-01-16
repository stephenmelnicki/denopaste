import { Signal, useSignal } from "@preact/signals";

import Alert, { Message } from "./Alert.tsx";

const MAX_TEXT_LENGTH = 262144000;

export default function UploadForm() {
  const text: Signal<string> = useSignal("");
  const isUploading: Signal<boolean> = useSignal(false);
  const message: Signal<Message | undefined> = useSignal(undefined);

  const onInput = (event: Event) => {
    if (event.target instanceof HTMLTextAreaElement) {
      event.preventDefault();
      text.value = event.target.value;
    }
  };

  const createNewEntry = async (contents: string): Promise<string> => {
    const response = await fetch("/", {
      method: "POST",
      body: contents,
    });

    const id = await response.text();

    if (!response.ok) {
      throw new Error(id);
    }

    return id;
  };

  const onSubmit = async (e: Event) => {
    e.preventDefault();

    if (text.value.length > 0) {
      message.value = undefined;
      isUploading.value = true;

      return await createNewEntry(text.value)
        .then((id) =>
          message.value = {
            type: "success",
            contents: "Saved.",
            url: new URL(`${document.location}${id}`),
          }
        )
        .catch((err) => {
          console.error(err);
          message.value = {
            type: "error",
            contents: "Failed to save text. Please try again.",
          } as Message;
        })
        .finally(() => isUploading.value = false);
    }
  };

  return (
    <main class="relative">
      <Alert message={message.value} />
      <form
        class="flex flex-col flex-1 w-full py-6 relative"
        onSubmit={onSubmit}
      >
        <label class="sr-only" for="upload-textarea">
          Content
        </label>
        <textarea
          id="upload-textarea"
          name="upload-textarea"
          aria-label="upload textarea"
          class="min-w-full h-44 p-2 border-2 border-black rounded font-mono"
          type="text"
          placeholder="Enter your text here."
          maxLength={MAX_TEXT_LENGTH}
          value={text.value}
          onInput={onInput}
          autoFocus
          required
        />
        <small class="py-1 text-xs text-right">
          Saved text is wiped every few hours.
        </small>
        <div class="ml-auto py-4">
          <button
            type="submit"
            class="px-3 py-2 border-2 border-black rounded hover:underline focus:underline disabled:(opacity-40 cursor-not-allowed)"
            disabled={isUploading.value}
          >
            {isUploading.value ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </main>
  );
}
