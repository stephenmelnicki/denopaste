import { useRef } from "preact/hooks";
import { useSignal } from "@preact/signals";
import type { JSX } from "preact";

export default function PasteForm() {
  const textarea = useRef<HTMLTextAreaElement>(null);
  const contents = useSignal<string>("");

  function onInput(event: JSX.TargetedEvent<HTMLTextAreaElement>): void {
    contents.value = event.currentTarget.value;
    textarea.current?.setCustomValidity("");
  }

  function validate(contents: string): boolean {
    if (contents.trim().length === 0) {
      textarea.current?.setCustomValidity("Paste can not be empty.");
    } else if (contents.length > 1024 * 64) {
      textarea.current?.setCustomValidity(
        "Paste is too long. Size limit is 64 KiB.",
      );
    } else {
      textarea.current?.setCustomValidity("");
    }

    return textarea.current?.checkValidity() ?? false;
  }

  function onKeyDown(event: KeyboardEvent): void {
    if (event.ctrlKey && event.key === "Enter") {
      textarea.current?.form?.requestSubmit();
    }
  }

  function onSubmit(event: SubmitEvent): boolean {
    if (!validate(contents.value)) {
      textarea.current?.reportValidity();
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
      <label class="sr-only" for="contents">Content</label>
      <textarea
        ref={textarea}
        id="contents"
        name="contents"
        type="text"
        class="block w-full h-56 px-4 py-2 border-0 rounded-md shadow-sm ring-1 ring-inset ring-gray-300 font-mono focus:ring-2 focus:ring-inset focus:ring-green-600 disabled:opacity-75"
        value={contents.value}
        onInput={onInput}
        onKeyDown={onKeyDown}
        autoFocus
        required
      />
      <div class="flex justify-between mt-4">
        <p>Pastes expire in one hour</p>
        <button
          type="submit"
          class="px-4 py-2 font-semibold rounded-md bg-green-600 text-white shadow-sm hover:bg-green-500 disabled:opacity-75"
        >
          Submit
        </button>
      </div>
    </form>
  );
}
