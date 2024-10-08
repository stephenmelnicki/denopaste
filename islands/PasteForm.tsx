import { useCallback, useRef } from "preact/hooks";
import { useSignal } from "@preact/signals";
import type { JSX } from "preact";
import { GoAlert, GoUpload } from "@preact-icons/go";

export default function PasteForm() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const contents = useSignal<string>("");
  const error = useSignal<string | null>(null);

  const onInput = useCallback(
    (event: JSX.TargetedEvent<HTMLTextAreaElement>): void => {
      contents.value = event.currentTarget.value;
      error.value = null;
    },
    [contents, error],
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
      if (contents.value.trim() === "") {
        error.value = "Paste must not be empty.";
        textareaRef.current?.focus();
        return false;
      }

      if (new TextEncoder().encode(contents.value).length > 64 * 1024) {
        error.value = "Paste size must not exceed 64 KiB.";
        textareaRef.current?.focus();
        return false;
      }

      error.value = null;
      return true;
    },
    [contents, error, textareaRef],
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
      <label for="contents">
        <h3 class="font-semibold">Paste</h3>
      </label>
      <textarea
        ref={textareaRef}
        id="contents"
        name="contents"
        type="text"
        class="font-mono block w-full h-56 mt-1 px-4 py-2 border rounded-md shadow-sm outline-none border-gray-200 hover:border-gray-600 focus:border-gray-600 transition-colors"
        value={contents.value}
        onInput={onInput}
        onKeyDown={onKeyDown}
        autoFocus
      />
      {error.value && (
        <span
          class="flex items-center mt-2 gap-1 text-sm font-semibold text-red-600"
          data-testid="error-message"
        >
          <GoAlert />
          <span>{error.value}</span>
        </span>
      )}
      <span class="block mt-2 text-sm text-gray-600">
        Pastes expire in one hour.
      </span>
      <div class="flex justify-end mt-4">
        <button
          type="submit"
          class="px-4 py-2 inline-flex flex-shrink-0 whitespace-nowrap items-center gap-2 font-medium rounded-md transition-colors duration-150 ease-in-out border-green-800 bg-green-700 text-white hover:bg-green-800 hover:border-green-900 shadow-sm"
        >
          <GoUpload class="h-4 w-4" />
          Upload
        </button>
      </div>
    </form>
  );
}
