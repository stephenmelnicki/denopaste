export default function Form() {
  return (
    <main>
      <form class="flex flex-col my-6" action="/" method="post">
        <label class="sr-only" for="content">
          Enter your text here
        </label>
        <textarea
          class="min-w-full h-44 p-2 font-mono border rounded-md border-gray-200 hover:border-gray-400"
          name="content"
          type="text"
          placeholder="Your text goes here..."
          autoFocus
          required
        />
        <p class="py-1 text-right text-sm text-gray-600">
          Pastes expire in one hour.
        </p>
        <div class="ml-auto my-4">
          <button
            type="submit"
            class="px-4 py-2 text-sm border rounded border-blue-600 font-semibold text-white bg-blue-600 hover:bg-white hover:text-blue-600"
          >
            Submit
          </button>
        </div>
      </form>
    </main>
  );
}
