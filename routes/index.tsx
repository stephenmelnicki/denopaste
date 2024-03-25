import { Handlers } from "$fresh/server.ts";

import { createNewPaste } from "@/utils/db.ts";
import { event } from "@/analytics/pirsch.ts";
import PasteForm from "@/islands/PasteForm.tsx";

const MAX_PASTE_LIMIT = 1024 * 1024; // 1MB

export const handler: Handlers = {
  async POST(req, ctx) {
    const form = await req.formData();
    const contents = form.get("contents")?.toString();

    if (contents === undefined || contents.trim().length === 0) {
      return new Response("Paste can not be empty.", { status: 400 });
    }

    if (contents.length > MAX_PASTE_LIMIT) {
      return new Response("Paste is too long.", { status: 413 });
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
