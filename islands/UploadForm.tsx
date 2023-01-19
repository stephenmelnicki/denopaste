import { Signal, useSignal } from "@preact/signals";
import Alert from "@/components/Alert.tsx";

const MAX_TEXT_LENGTH = 262144000;

export default function UploadForm() {
  const text: Signal<string> = useSignal("");
  const message: Signal<string | undefined> = useSignal(undefined);
  const isUploading: Signal<boolean> = useSignal(false);

  const onInput = (e: Event) => {
    if (e.target instanceof HTMLTextAreaElement) {
      e.preventDefault();
      text.value = e.target.value;
    }
  };

  const createNewEntry = async (contents: string): Promise<string> => {
    const response = await fetch("/", {
      method: "POST",
      body: contents,
    });

    const id = await response.text();

    if (!response.ok) {
      throw new Error(id);
    }

    return id;
  };

  const onSubmit = async (e: Event) => {
    e.preventDefault();

    if (text.value.length > 0) {
      isUploading.value = true;
      message.value = undefined;

      return await createNewEntry(text.value)
        .then((id) => window.location.pathname = `/${id}`)
        .catch((err) => {
          console.error(err);
          message.value = "Failed to save text. Please try again.";
        })
        .finally(() => isUploading.value = false);
    }
  };

  return (
    <main class="relative">
      <Alert message={message.value} />
      <form
        class="flex flex-col flex-1 w-full py-8 relative"
        onSubmit={onSubmit}
      >
        <label class="sr-only" for="upload-textarea">
          Content
        </label>
        <textarea
          id="upload-textarea"
          name="upload-textarea"
          aria-label="upload textarea"
          class="min-w-full h-44 p-2 border-2 border-black rounded font-mono"
          type="text"
          placeholder="Enter your text here."
          maxLength={MAX_TEXT_LENGTH}
          value={text.value}
          onInput={onInput}
          autoFocus
          required
        />
        <small class="py-1 text-right">
          Stored text is wiped every few hours.
        </small>
        <div class="ml-auto py-4">
          <button
            type="submit"
            class="px-3 py-2 border-2 border-black rounded hover:underline focus:underline disabled:(opacity-40 cursor-not-allowed)"
            disabled={isUploading.value}
          >
            {isUploading.value ? "Pasting..." : "Paste"}
          </button>
        </div>
      </form>
    </main>
  );
}
