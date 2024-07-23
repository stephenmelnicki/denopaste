import { useRef } from "preact/hooks";
import { useSignal } from "@preact/signals";
import { JSX } from "preact/jsx-runtime";

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
        class="block w-full h-56 px-4 py-2 border-0 rounded-md shadow-sm ring-1 ring-inset ring-gray-300 font-mono focus:ring-2 focus:ring-inset focus:ring-green-600 disabled:opacity-75"
        id="contents"
        name="contents"
        type="text"
        value={contents.value}
        disabled={loading.value}
        onInput={onInput}
        autoFocus
        required
      />

      <div class="flex justify-between items-start mt-4">
        <p>Pastes expire in one hour</p>
        <button
          class="px-4 py-2 font-semibold rounded-md bg-green-600 text-white shadow-sm hover:bg-green-500 disabled:opacity-75"
          type="submit"
          disabled={loading.value}
        >
          Submit
        </button>
      </div>
    </form>
  );
}
