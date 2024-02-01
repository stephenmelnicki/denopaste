import { Handlers } from "$fresh/server.ts";

import Form from "components/Form.tsx";
import { createNewPaste } from "utils/db.ts";

const MAX_SIZE = 64 * 1024; // 64 KiB

export const handler: Handlers = {
  async POST(req, _ctx) {
    const data = await req.formData();
    const contents = data.get("content");

    if (typeof contents !== "string" || contents.length === 0) {
      return new Response("invalid request", { status: 400 });
    }

    const id = await createNewPaste(contents);
    return new Response("", {
      headers: { "location": `/${id}` },
      status: 302,
    });
  },
};

export default function Home() {
  return <Form />;
}
