export default function Form() {
  return (
    <main class="my-6">
      <form id="form" class="flex flex-col" method="post" name="form">
        <label class="sr-only" for="content">
          Content
        </label>
        <textarea
          class="min-w-full h-44 px-3 py-2 font-mono shadow-sm border-0 rounded-md ring-1 ring-inset ring-gray-600"
          id="content"
          name="content"
          type="text"
          autoFocus
          required
        />
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Pastes expire in one hour.
        </p>
        <button
          type="submit"
          class="mt-8 ml-auto px-4 py-2 font-semibold rounded-md bg-blue-600 text-white hover:bg-blue-500 focus:ring-1 focus:ring-offset-1"
        >
          Submit
        </button>
      </form>
    </main>
  );
}
