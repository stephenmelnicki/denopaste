import { Handlers } from "$fresh/server.ts";

import { createNewPaste } from "@/utils/db.ts";
import { event } from "@/analytics/pirsch.ts";
import PasteForm from "@/islands/PasteForm.tsx";
import {
  ERROR_EMPTY,
  ERROR_SIZE_LIMIT,
  MAX_PASTE_LIMIT,
} from "@/utils/constants.ts";

export const handler: Handlers = {
  async POST(req, ctx) {
    const form = await req.formData();
    const contents = form.get("contents")?.toString();

    if (contents === undefined || contents.trim().length === 0) {
      return new Response(ERROR_EMPTY, { status: 400 });
    }

    if (contents.length > MAX_PASTE_LIMIT) {
      return new Response(ERROR_SIZE_LIMIT, { status: 413 });
    }

    const id = createNewPaste(contents);
    await event(req, ctx, "Create Paste", {
      id,
      "size": `${contents.length} bytes.`,
    });

    return new Response(undefined, {
      headers: { "location": `/${id}` },
      status: 302,
    });
  },
};

export default function Home() {
  return (
    <main class="my-8">
      <PasteForm />
    </main>
  );
}
