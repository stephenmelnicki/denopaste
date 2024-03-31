import { useRef } from "preact/hooks";
import { useSignal } from "@preact/signals";
import { JSX } from "preact/jsx-runtime";
import IconLoader2 from "$icons/loader-2.tsx";

import {
  ERROR_EMPTY,
  ERROR_SIZE_LIMIT,
  MAX_PASTE_LIMIT,
} from "@/utils/constants.ts";

export default function PasteForm() {
  const textarea = useRef<HTMLTextAreaElement>(null);
  const loading = useSignal<boolean>(false);
  const contents = useSignal<string>("");

  function onInput(event: JSX.TargetedEvent<HTMLTextAreaElement>) {
    contents.value = event.currentTarget.value;
    textarea.current?.setCustomValidity("");
  }

  function validate(contents: string) {
    if (contents.trim().length === 0) {
      textarea.current?.setCustomValidity(ERROR_EMPTY);
    } else if (contents.length > MAX_PASTE_LIMIT) {
      textarea.current?.setCustomValidity(ERROR_SIZE_LIMIT);
    } else {
      textarea.current?.setCustomValidity("");
    }
  }

  function onSubmit(event: Event) {
    validate(contents.value);

    if (textarea.current && textarea.current.checkValidity() === false) {
      textarea.current?.reportValidity();
      event.preventDefault();
      return false;
    }

    return true;
  }

  return (
    <form
      id="form"
      class="flex flex-col"
      name="form"
      method="post"
      onSubmit={onSubmit}
    >
      <label class="sr-only" for="contents">Content</label>
      <textarea
        ref={textarea}
        class="min-w-full h-44 px-4 py-2 border rounded-md border-gray-300 dark:border-gray-500 font-mono text-gray-900 dark:text-white shadow-sm disabled:opacity-75"
        id="contents"
        name="contents"
        type="text"
        value={contents.value}
        disabled={loading.value}
        onInput={onInput}
        autoFocus
        required
      />
      <p class="mt-3 text-sm text-gray-600 dark:text-gray-400">
        Pastes expire in one hour.
      </p>
      <div class="flex justify-end mt-8">
        <button
          class="flex gap-2 items-center px-4 py-2 font-semibold rounded-md bg-blue-600 text-white shadow-sm hover:bg-blue-500 disabled:opacity-75"
          type="submit"
          disabled={loading.value}
        >
          <IconLoader2
            class={`w-5 h-5 animate-spin ${!loading.value && "hidden"}`}
          />
          {loading.value ? "Processing..." : "Submit"}
        </button>
      </div>
    </form>
  );
}
