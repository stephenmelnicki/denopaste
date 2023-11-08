import { Signal, useSignal } from "@preact/signals";

import type { Entry } from "utils/types.ts";

const MAX_INPUT_LENGTH = 262144000;

export default function UploadForm() {
  const text: Signal<string> = useSignal("");
  const inProgress: Signal<boolean> = useSignal(false);

  const onInput = (e: Event) => {
    if (e.target instanceof HTMLTextAreaElement) {
      e.preventDefault();
      text.value = e.target.value;
    }
  };

  const createEntry = async (contents: string) => {
    const response = await fetch("/", {
      method: "POST",
      body: contents,
    });

    if (!response.ok) {
      throw new Error("server error");
    }

    const entry: Entry = await response.json();
    return entry;
  };

  const onSubmit = async (e: Event) => {
    e.preventDefault();

    if (text.value.length === 0) {
      return;
    }

    inProgress.value = true;
    const entry = await createEntry(text.value);
    inProgress.value = false;
    window.location.pathname = `/${entry.id}`;
  };

  return (
    <form class="flex flex-col my-6" onSubmit={onSubmit}>
      <label class="sr-only" for="upload-textarea">
        Content
      </label>
      <textarea
        id="upload-textarea"
        name="upload-textarea"
        aria-label="upload textarea"
        class="min-w-full h-44 p-2 border rounded-md"
        type="text"
        placeholder="Enter your text here"
        maxLength={MAX_INPUT_LENGTH}
        value={text.value}
        onInput={onInput}
        autoFocus
        required
      >
      </textarea>
      <div class="ml-auto mt-4">
        <button
          type="submit"
          class="px-4 py-2 text-sm text-white font-semibold bg-blue-500 rounded"
          disabled={inProgress.value}
        >
          Submit
        </button>
      </div>
    </form>
  );
}
