import { useSignal } from "@preact/signals";
import { useCallback, useRef } from "preact/hooks";
import { JSX } from "preact/jsx-runtime";

import ErrorNotification from "@/islands/ErrorNotification.tsx";

export default function PasteForm() {
  const loading = useSignal<boolean>(false);
  const contents = useSignal<string>("");
  const errorMessage = useSignal<string | null>(null);
  const textarea = useRef<HTMLTextAreaElement>(null);

  // Focus the textarea when the component mounts
  useCallback(() => {
    if (textarea.current !== null) {
      textarea.current.focus();
    }
  }, []);

  function onChange(event: JSX.TargetedEvent<HTMLTextAreaElement>) {
    contents.value = event.currentTarget.value;
  }

  async function onSubmit(event: Event) {
    event.preventDefault();

    loading.value = true;
    errorMessage.value = null;

    const form = new FormData();
    form.append("contents", contents.value);

    try {
      const response = await fetch("/", {
        method: "POST",
        body: form,
      });

      if (!response.ok) {
        let message;

        switch (response.status) {
          case 400:
            message = await response.text();
            break;
          case 413:
            message = "Paste is too long.";
            break;
          default:
            message = "An error occurred. Please try again.";
            break;
        }

        throw new Error(message);
      }

      window.location.href = response.url;
    } catch (err) {
      errorMessage.value = err.message;
    } finally {
      loading.value = false;
    }
  }

  return (
    <form id="form" class="flex flex-col" name="form" onSubmit={onSubmit}>
      {errorMessage.value && <ErrorNotification message={errorMessage} />}
      <label class="sr-only" for="contents">Content</label>
      <textarea
        ref={textarea}
        class="min-w-full h-44 px-4 py-2 border rounded-md border-gray-300 dark:border-gray-500 font-mono text-gray-900 dark:text-white"
        id="contents"
        name="contents"
        type="text"
        value={contents.value}
        onChange={onChange}
        required
      />
      <p class="mt-3 text-sm text-gray-600 dark:text-gray-400">
        Pastes expire in one hour.
      </p>
      <div class="flex justify-end mt-8">
        <button
          class="px-4 py-2 font-semibold rounded-md bg-blue-600 text-white hover:bg-blue-500"
          type="submit"
          disabled={loading.value}
        >
          Submit
        </button>
      </div>
    </form>
  );
}
