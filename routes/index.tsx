import { Handlers } from "$fresh/server.ts";

import ContentMeta from "components/ContentMeta.tsx";
import Header from "components/Header.tsx";
import Footer from "components/Footer.tsx";
import UploadForm from "islands/UploadForm.tsx";

import { createEntry } from "utils/db.ts";
import { createId } from "utils/id.ts";
import type { Entry } from "utils/types.ts";
import { exceedsStorageLimit } from "utils/limit.ts";

export const handler: Handlers = {
  async POST(req, _ctx) {
    const contents = await req.text();

    if (exceedsStorageLimit(contents)) {
      console.log("error saving text. request body too large.");
      return new Response("request body exceeds limit of 64 KiB", {
        headers: { "Content-Type": "text/plain; charset=UTF-8" },
        status: 400,
      });
    }

    const entry: Entry = {
      id: createId(),
      contents,
    };

    try {
      await createEntry(entry);
      console.log(
        `entry "${entry.id}" saved (${entry.contents.length} characters).`,
      );
      return new Response(JSON.stringify({ "id": entry.id }), {
        headers: { "Content-Type": "application/json" },
        status: 201,
      });
    } catch (err) {
      console.log("failed to save entry:", err);
      return new Response("server error", {
        headers: { "Content-Type": "text/plain; charset=UTF-8" },
        status: 500,
      });
    }
  },
};

export default function Home() {
  return (
    <body class="px-4 py-8 mx-auto max-w-screen-sm">
      <ContentMeta />
      <Header />
      <UploadForm />
      <Footer />
    </body>
  );
}
