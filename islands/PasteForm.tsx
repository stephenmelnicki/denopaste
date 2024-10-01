import { useRef } from "preact/hooks";
import { useSignal } from "@preact/signals";
import type { JSX } from "preact";

import Paste from "../data/paste.ts";

export default function PasteForm() {
  const textarea = useRef<HTMLTextAreaElement>(null);
  const contents = useSignal<string>("");

  function onInput(event: JSX.TargetedEvent<HTMLTextAreaElement>): void {
    contents.value = event.currentTarget.value;
    textarea.current?.setCustomValidity("");
  }

  function onKeyDown(event: KeyboardEvent): void {
    if (event.ctrlKey && event.key === "Enter") {
      textarea.current?.form?.requestSubmit();
    }
  }

  function validate(textarea: HTMLTextAreaElement | null): boolean {
    if (!textarea) {
      return false;
    }

    const result = Paste.validate(textarea.value);
    if (result.ok) {
      textarea.setCustomValidity("");
    } else {
      textarea.setCustomValidity(result.message);
    }

    return textarea.reportValidity();
  }

  function onSubmit(event: SubmitEvent): boolean {
    if (!validate(textarea.current)) {
      event.preventDefault();
      return false;
    }

    return true;
  }

  return (
    <form
      name="form"
      method="post"
      onSubmit={onSubmit}
    >
      <label class="sr-only" for="contents">Contents</label>
      <textarea
        ref={textarea}
        id="contents"
        name="contents"
        type="text"
        class="block w-full h-56 px-4 py-2 border-0 rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-green-600"
        value={contents.value}
        onInput={onInput}
        onKeyDown={onKeyDown}
        autoFocus
        required
      />
      <p class="mt-2">Pastes expire in one hour.</p>
      <div class="flex justify-end mt-2">
        <button
          type="submit"
          class="px-4 py-2 font-semibold rounded-md bg-green-600 text-white shadow-sm hover:bg-green-500"
        >
          Submit
        </button>
      </div>
    </form>
  );
}
