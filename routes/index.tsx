import { Handlers } from "$fresh/server.ts";

import PasteForm from "@/islands/PasteForm.tsx";
import { createNewPaste } from "@/utils/db.ts";

const CHARS_PER_MB = 1024 * 1024;
const MAX_PASTE_LIMIT = 2 * CHARS_PER_MB;

export const handler: Handlers = {
  async POST(req, _ctx) {
    const form = await req.formData();
    const contents = form.get("contents")?.toString();

    if (contents === undefined || contents.trim().length === 0) {
      return new Response("Paste can not be empty.", { status: 400 });
    }

    if (contents.length > MAX_PASTE_LIMIT) {
      return new Response("Paste is too long.", { status: 400 });
    }

    const id = createNewPaste(contents);
    return new Response(undefined, {
      headers: { "location": `/${id}` },
      status: 302,
    });
  },
};

export default function Home() {
  return (
    <main class="my-8 relative">
      <PasteForm />
    </main>
  );
}
