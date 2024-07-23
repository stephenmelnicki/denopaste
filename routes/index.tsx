import { FreshContext, Handlers } from "$fresh/server.ts";

import { State } from "@/utils/types.ts";
import PasteForm from "@/islands/PasteForm.tsx";
import {
  ERROR_EMPTY,
  ERROR_SIZE_LIMIT,
  MAX_PASTE_LIMIT,
} from "@/utils/constants.ts";

// deno-lint-ignore no-explicit-any
export const handler: Handlers<any, State> = {
  async POST(req: Request, ctx: FreshContext<State>) {
    const form = await req.formData();
    const contents = form.get("contents")?.toString();

    if (contents === undefined || contents.trim().length === 0) {
      return new Response(ERROR_EMPTY, { status: 400 });
    }

    if (contents.length > MAX_PASTE_LIMIT) {
      return new Response(ERROR_SIZE_LIMIT, { status: 413 });
    }

    const { db, analytics } = ctx.state;

    const id = db.insertPaste(contents);
    await analytics.trackEvent(req, "Create Paste", {
      id,
      size: `${contents.length} bytes.`,
    });

    return new Response(undefined, {
      headers: { "location": `/${id}` },
      status: 302,
    });
  },
};

export default function Home() {
  return (
    <main class="mt-4 mb-8">
      <PasteForm />
    </main>
  );
}
