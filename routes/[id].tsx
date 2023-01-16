import { Handlers, PageProps } from "$fresh/server.ts";

import ContentMeta from "@/components/ContentMeta.tsx";
import Header from "@/components/Header.tsx";
import Entry from "@/components/Entry.tsx";
import Footer from "@/components/Footer.tsx";

import db from "@/utils/database.ts";

interface Entry {
  contents: string;
}

export const handler: Handlers<Entry> = {
  async GET(_req, ctx) {
    const contents = await db.getEntry(ctx.params.id);
    if (contents === undefined) {
      return ctx.renderNotFound();
    }

    return ctx.render(contents);
  },
};

export default function EntryPage(props: PageProps<Entry>) {
  return (
    <body class="w-full max-w-screen-sm mx-auto py-6 px-4 text-gray-900">
      <ContentMeta title={"Deno Paste"} url={props.url} />
      <Header />
      <Entry contents={props.data.contents} />
      <Footer />
    </body>
  );
}
