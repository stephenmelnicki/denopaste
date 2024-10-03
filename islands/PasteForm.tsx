import { useRef } from "preact/hooks";
import { useSignal } from "@preact/signals";
import type { JSX } from "preact";

import Paste from "../data/paste.ts";

export default function PasteForm() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const contents = useSignal<string>("");

  function onInput(event: JSX.TargetedEvent<HTMLTextAreaElement>): void {
    contents.value = event.currentTarget.value;
    textareaRef.current?.setCustomValidity("");
  }

  function onKeyDown(event: KeyboardEvent): void {
    if (event.ctrlKey && event.key === "Enter") {
      textareaRef.current?.form?.requestSubmit();
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
    if (!validate(textareaRef.current)) {
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
        ref={textareaRef}
        id="contents"
        name="contents"
        type="text"
        class="font-mono block w-full h-56 px-4 py-2 border rounded-md shadow-sm border-gray-300 hover:border-gray-500 focus:border-gray-500 transition-colors"
        placeholder="Paste your content here..."
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
          class="px-4 py-2 rounded-md transition-colors duration-150 ease-in-out border-blue-700 bg-blue-600 text-white hover:bg-blue-700 hover:border-blue-800 shadow-sm"
        >
          Paste
        </button>
      </div>
    </form>
  );
}
