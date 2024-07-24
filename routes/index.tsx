import { HttpError, page } from "fresh";

import PasteForm from "../islands/PasteForm.tsx";

import { getDatabase } from "../utils/db.ts";
import { define } from "../utils/state.ts";

export const handler = define.handlers({
  GET(ctx) {
    ctx.state.title =
      "Denopaste - A simple paste service built with Deno 🦕 and Fresh 🍋";

    return page();
  },
  async POST(ctx) {
    const form = await ctx.req.formData();
    const contents = form.get("contents")?.toString();

    if (contents === undefined || contents.trim().length === 0) {
      throw new HttpError(400);
    }

    try {
      const db = await getDatabase();
      const id = await db.insertPaste(contents);

      return new Response(undefined, {
        headers: { "location": `/${id}` },
        status: 302,
      });
    } catch (err) {
      if (err instanceof TypeError && err.message.includes("value too large")) {
        throw new HttpError(413);
      }

      throw err;
    }
  },
});

export default define.page<typeof handler>(function Home() {
  return (
    <main class="mt-6 mb-16">
      <PasteForm />
    </main>
  );
});
