export default function Form() {
  return (
    <main class="my-6">
      <form id="form" class="flex flex-col" method="post" name="form">
        <label class="sr-only" for="content">
          Content
        </label>
        <textarea
          class="min-w-full h-44 p-2 font-mono border rounded-md border-gray-600"
          id="content"
          name="content"
          type="text"
          autoFocus
          required
        />
        <p class="mt-2 leading-6 text-sm text-gray-600">
          Pastes expire in one hour.
        </p>
        <button
          type="submit"
          class="mt-8 px-4 py-2 ml-auto font-semibold border rounded-md bg-blue-600 border-blue-600 text-white hover:bg-white hover:text-blue-600"
        >
          Submit
        </button>
      </form>
    </main>
  );
}
