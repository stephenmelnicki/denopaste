import { useEffect, useRef } from "preact/hooks";
import { Signal, useSignal } from "@preact/signals";

export default function UploadForm() {
  const textarea = useRef<HTMLTextAreaElement>(null);
  const text: Signal<string> = useSignal("");
  const inProgress: Signal<boolean> = useSignal(false);
  const error: Signal<string | undefined> = useSignal(undefined);

  useEffect(() => {
    if (textarea && textarea.current) {
      textarea.current.focus();
    }
  }, []);

  const onInput = (e: Event) => {
    if (e.target instanceof HTMLTextAreaElement) {
      e.preventDefault();
      text.value = e.target.value;
      error.value = undefined;
    }
  };

  const createEntry = async (contents: string) => {
    const response = await fetch("/", {
      method: "POST",
      body: contents,
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(message);
    }

    const data = await response.json();
    return data.id;
  };

  const onSubmit = async (e: Event) => {
    e.preventDefault();
    error.value = undefined;

    if (text.value.length === 0) {
      return;
    }

    inProgress.value = true;
    try {
      const entry = await createEntry(text.value);
      window.location.pathname = `/${entry.id}`;
    } catch (err) {
      error.value = err.message !== "server error"
        ? "Pastes are limited to a maximum size of 64 KiB."
        : "Failed to save entry. Please try again.";
    } finally {
      inProgress.value = false;
    }
  };

  return (
    <form class="flex flex-col my-6" onSubmit={onSubmit}>
      <label class="sr-only" for="upload-textarea">
        Contents
      </label>
      <textarea
        ref={textarea}
        id="upload-textarea"
        name="upload-textarea"
        aria-label="upload textarea"
        class="min-w-full h-44 p-2 border rounded-md border-gray-200 hover:border-gray-400 font-mono"
        type="text"
        placeholder="Your text goes here..."
        value={text.value}
        onInput={onInput}
        autoFocus
        required
      >
      </textarea>
      {error.value && (
        <p class="pt-1 text-right text-sm text-red-500">
          {error.value}
        </p>
      )}

      <p class="py-1 text-right text-sm text-gray-600">
        Pastes expire in one hour.
      </p>
      <div class="ml-auto my-4">
        <button
          type="submit"
          class="px-4 py-2 text-sm border rounded border-blue-600 font-semibold text-white bg-blue-600 hover:bg-white hover:text-blue-600"
          disabled={inProgress.value}
        >
          Paste
        </button>
      </div>
    </form>
  );
}
