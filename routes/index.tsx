import { type FreshContext, HttpError, page } from "fresh";
import PasteForm from "../islands/PasteForm.tsx";
import Paste, { PasteEmptyError, PasteTooLargeError } from "../data/paste.ts";
import { define, type State } from "../utils/define.ts";

export const handler = define.handlers({
  GET(ctx: FreshContext<State>) {
    ctx.state.title =
      "Denopaste - A simple paste service built with Deno 🦕 and Fresh 🍋";

    return page();
  },
  async POST(ctx: FreshContext<State>) {
    const formData = await ctx.req.formData();
    console.log("form", formData);
    const contents = formData.get("contents")?.toString() ?? "";
    console.log("contents", contents);

    try {
      const { db } = ctx.state;
      const paste = new Paste(contents);
      await db.insertPaste(paste);

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
    <main class="mt-6 mb-16">
      <PasteForm />
    </main>
  );
}

export default define.page(Home);
