import { Handlers } from "$fresh/server.ts";

import Header from "components/Header.tsx";
import Footer from "components/Footer.tsx";
import UploadForm from "islands/UploadForm.tsx";

import { createNewPaste } from "utils/db.ts";
import { createId } from "utils/id.ts";
import type { Paste } from "utils/types.ts";

const MAX_SIZE = 64 * 1024; // 64 KiB

export const handler: Handlers = {
  OPTIONS(req, _ctx) {
    const origin = req.headers.get("Origin") || "*";
    const resp = new Response(null, { status: 204 });
    const headers = resp.headers;

    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Access-Control-Allow-Headers", "Accept, Content-Type");
    headers.set("Access-Control-Allow-Methods", "OPTIONS, GET, POST");

    return resp;
  },
  async POST(req, _ctx) {
    try {
      const contents = await req.text();

      if (contents.length === 0) {
        console.log("request body was empty.");
        return new Response("request body empty", { status: 400 });
      }

      // values in KV have a maximum size limit of 64 KiB
      if (new TextEncoder().encode(contents).length > MAX_SIZE) {
        console.log("request body too large.");
        return new Response(
          "request body cannot exceed maximum size of 64 KiB",
          {
            status: 400,
          },
        );
      }

      const paste: Paste = {
        id: createId(),
        contents,
      };

      await createNewPaste(paste);
      console.log(
        `paste "${paste.id}" saved (${paste.contents.length} characters).`,
      );
      return new Response(JSON.stringify({ id: paste.id }), {
        headers: { "Content-Type": "application/json" },
        status: 201,
      });
    } catch (err) {
      console.log("failed to save paste:", err);
      return new Response("server error", { status: 500 });
    }
  },
};

export default function Home() {
  return (
    <body class="px-4 py-8 mx-auto max-w-screen-sm">
      <Header />
      <UploadForm />
      <Footer />
    </body>
  );
}
