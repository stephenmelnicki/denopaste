import { Handlers, PageProps } from "$fresh/server.ts";

import db from "@/utils/database.ts";
import { generateId } from "@/utils/random.ts";

import ContentMeta from "@/components/ContentMeta.tsx";
import UploadForm from "@/islands/UploadForm.tsx";

const TITLE = "Deno Paste";
const MAX_TEXT_LENGTH = 262144000;

export const handler: Handlers = {
  async POST(req, _ctx) {
    const contents = await req.text();

    if (contents.length > MAX_TEXT_LENGTH) {
      return new Response("contents exceed maximum length", { status: 400 });
    }

    const id = generateId();
    try {
      await db.insertEntry(id, contents);
      return new Response(id, { status: 201 });
    } catch (err) {
      console.error(err);
      return new Response("server error", { status: 500 });
    }
  },
};

export default function MainPage(props: PageProps) {
  return (
    <div>
      <ContentMeta title="Deno Paste" url={props.url} />
      <UploadForm />
    </div>
  );
}
