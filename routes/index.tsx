import { Handlers } from "$fresh/server.ts";

import Header from "components/Header.tsx";
import Form from "../components/Form.tsx";
import Footer from "components/Footer.tsx";

import { createNewPaste } from "utils/db.ts";

const MAX_SIZE = 64 * 1024; // 64 KiB

export const handler: Handlers = {
  async POST(req, _ctx) {
    try {
      const data = await req.formData();
      const contents = data.get("content");

      if (typeof contents !== "string" || contents.length === 0) {
        return new Response("invalid request", { status: 400 });
      }

      if (new TextEncoder().encode(contents).length > MAX_SIZE) {
        return new Response("paste contents cannot exceed 64 KiB", {
          status: 400,
        });
      }

      const id = await createNewPaste(contents);
      return new Response("", {
        headers: { "location": `/${id}` },
        status: 302,
      });
    } catch (err) {
      return new Response("server error", { status: 500 });
    }
  },
};

export default function Home() {
  return (
    <body class="px-4 py-8 mx-auto max-w-screen-sm">
      <Header />
      <Form />
      <Footer />
    </body>
  );
}
