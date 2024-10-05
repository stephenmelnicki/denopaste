import { type FreshContext, HttpError, page } from "fresh";

import { define, type State } from "../utils/define.ts";
import { insert } from "../data/mod.ts";
import Paste, { PasteEmptyError, PasteTooLargeError } from "../data/paste.ts";
import PasteForm from "../islands/PasteForm.tsx";

export const handler = define.handlers({
  GET(ctx: FreshContext<State>) {
    ctx.state.title =
      "Deno Paste - A simple paste service built with Deno 🦕 and Fresh 🍋";

    return page();
  },
  async POST(ctx: FreshContext<State>) {
    const formData = await ctx.req.formData();
    const contents = formData.get("contents")?.toString() ?? "";

    try {
      const paste = new Paste(contents);
      await insert(ctx.state.kv, paste);

      return new Response(undefined, {
        headers: { "location": `/${paste.id}` },
        status: 302,
      });
    } catch (err: unknown) {
      if (err instanceof PasteEmptyError) {
        throw new HttpError(400, err.message);
      }

      if (err instanceof PasteTooLargeError) {
        throw new HttpError(413, err.message);
      }

      throw err;
    }
  },
});

function Home() {
  return (
    <main class="mt-4 mb-12">
      <PasteForm />
    </main>
  );
}

export default define.page(Home);
