import { Handlers } from "$fresh/server.ts";

import ContentMeta from "components/ContentMeta.tsx";
import Header from "components/Header.tsx";
import Footer from "components/Footer.tsx";
import UploadForm from "islands/UploadForm.tsx";

import { createEntry } from "utils/db.ts";
import { createId } from "utils/id.ts";
import type { Entry } from "utils/types.ts";

const MAX_TEXT_LENGTH = 262144000;

export const handler: Handlers = {
  async POST(req, _ctx) {
    const contents = await req.text();

    if (contents.length > MAX_TEXT_LENGTH) {
      return new Response("contents exceed maximum length", {
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
      console.log("entry created", entry);
      return new Response(JSON.stringify({ "id": entry.id }), {
        headers: { "Content-Type": "application/json" },
        status: 201,
      });
    } catch (err) {
      console.error("failed to create entry", err, entry);
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
