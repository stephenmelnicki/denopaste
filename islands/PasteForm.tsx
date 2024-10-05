import { useCallback, useRef } from "preact/hooks";
import { useSignal } from "@preact/signals";
import type { JSX } from "preact";

import Paste from "../data/paste.ts";

export default function PasteForm() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const contents = useSignal<string>("");

  const onInput = useCallback(
    (event: JSX.TargetedEvent<HTMLTextAreaElement>): void => {
      contents.value = event.currentTarget.value;
      textareaRef.current?.setCustomValidity("");
    },
    [contents, textareaRef],
  );

  const onKeyDown = useCallback(
    (event: KeyboardEvent): void => {
      if (event.ctrlKey && event.key === "Enter") {
        textareaRef.current?.form?.requestSubmit();
      }
    },
    [textareaRef],
  );

  const validate = useCallback(
    (): boolean => {
      if (!textareaRef.current) {
        return false;
      }

      const result = Paste.validate(textareaRef.current.value);
      if (result.ok) {
        textareaRef.current.setCustomValidity("");
      } else {
        textareaRef.current.setCustomValidity(result.message);
      }

      return textareaRef.current.reportValidity();
    },
    [textareaRef],
  );

  const onSubmit = useCallback(
    (event: SubmitEvent): boolean => {
      if (!validate()) {
        event.preventDefault();
        return false;
      }

      return true;
    },
    [validate],
  );

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
