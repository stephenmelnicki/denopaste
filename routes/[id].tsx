import { Handlers, PageProps } from "$fresh/server.ts";

import ContentMeta from "@/components/ContentMeta.tsx";
import Entry from "@/components/Entry.tsx";

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
    <div>
      <ContentMeta title="Deno Paste" url={props.url} />
      <Entry contents={props.data.contents} />
    </div>
  );
}
