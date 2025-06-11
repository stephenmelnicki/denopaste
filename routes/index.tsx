import { type FreshContext, HttpError, page } from "fresh";

import PasteForm from "islands/PasteForm.tsx";
import { define, type State } from "utils/fresh.ts";
import {
  addPaste,
  createPaste,
  PasteEmptyError,
  PasteTooLargeError,
} from "data/pastes.ts";
import { pageTitle } from "utils/title.ts";

function GET(ctx: FreshContext<State>) {
  ctx.state.title = pageTitle("");
  return page();
}

async function POST(ctx: FreshContext<State>) {
  const formData = await ctx.req.formData();
  const contents = formData.get("contents")?.toString() ?? "";

  try {
    const paste = createPaste(contents);
    await addPaste(paste);

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
}

export const handler = define.handlers({
  GET,
  POST,
});

function Home() {
  return (
    <main class="mt-4 mb-12">
      <PasteForm />
    </main>
  );
}

export default define.page<typeof handler>(Home);
