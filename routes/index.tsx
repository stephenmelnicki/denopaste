import { Handlers, PageProps } from "$fresh/server.ts";

import db from "@/utils/database.ts";
import { generateId } from "@/utils/random.ts";

import ContentMeta from "@/components/ContentMeta.tsx";
import Header from "@/components/Header.tsx";
import Footer from "@/components/Footer.tsx";
import UploadForm from "@/islands/UploadForm.tsx";

const TITLE = "Deno Paste";
const MAX_TEXT_LENGTH = 262144000;

export const handler: Handlers = {
  async POST(req, _ctx) {
    const id = generateId();
    const contents = await req.text();

    if (contents.length > MAX_TEXT_LENGTH) {
      return new Response("contents exceed maximum length", { status: 400 });
    }

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
    <body class="max-w-screen-sm mx-auto my-6 text-gray-900">
      <ContentMeta title={TITLE} url={props.url} />
      <Header />
      <UploadForm />
      <Footer />
    </body>
  );
}
