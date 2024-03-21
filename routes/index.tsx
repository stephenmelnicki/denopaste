import { Handlers } from "$fresh/server.ts";
import { createNewPaste } from "@/utils/db.ts";

export const handler: Handlers = {
  async POST(req, _ctx) {
    const data = await req.formData();
    const contents = data.get("contents");

    if (typeof contents !== "string" || contents.length === 0) {
      return new Response("bad request", { status: 400 });
    }

    const id = createNewPaste(contents);
    return new Response("", {
      headers: { "location": `/${id}` },
      status: 302,
    });
  },
};

export default function Home() {
  return (
    <main class="my-8">
      <form id="form" class="flex flex-col" method="post" name="form">
        <label class="sr-only" for="contents">
          Content
        </label>
        <textarea
          class="min-w-full h-44 px-4 py-2 border rounded-md border-gray-300 dark:border-gray-500 font-mono text-gray-900 dark:text-white"
          id="contents"
          name="contents"
          type="text"
          autoFocus
          required
        />
        <p class="mt-3 text-sm text-gray-600 dark:text-gray-400">
          Pastes expire in one hour.
        </p>
        <div class="flex justify-end mt-8">
          <button
            class="px-4 py-2 font-semibold rounded-md bg-blue-600 text-white hover:bg-blue-500"
            type="submit"
          >
            Submit
          </button>
        </div>
      </form>
    </main>
  );
}
