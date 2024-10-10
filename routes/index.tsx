import { type FreshContext, HttpError, page } from "fresh";

import { define, type State } from "../utils/define.ts";
import { pageTitle } from "../utils/title.ts";
import { insert } from "../data/mod.ts";
import Paste, { PasteEmptyError, PasteTooLargeError } from "../data/paste.ts";
import PasteForm from "../islands/PasteForm.tsx";

export const handler = define.handlers({
  GET(ctx: FreshContext<State>) {
    ctx.state.title = pageTitle("");
    return page();
  },
  async POST(ctx: FreshContext<State>) {
    const formData = await ctx.req.formData();
    const contents = formData.get("contents")?.toString() ?? "";

    try {
      const paste = new Paste(contents);
      await insert(ctx.state.kv, paste);

      const headers = new Headers();
      headers.set("location", `/${paste.id}`);
      return new Response(null, {
        status: 303,
        headers,
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
