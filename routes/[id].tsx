import { Handler, HandlerContext, PageProps } from "$fresh/server.ts";

import ContentMeta from "@/components/ContentMeta.tsx";
import Header from "@/components/Header.tsx";
import Entry from "@/components/Entry.tsx";
import Footer from "@/components/Footer.tsx";

import db from "@/utils/database.ts";

const TITLE = "Deno Paste";

interface Data {
  contents: string;
}

export const handler: Handler<Data> = async (
  _req: Request,
  ctx: HandlerContext<Data>,
): Promise<Response> => {
  const contents = await db.getEntry(ctx.params.id);
  if (contents === undefined) {
    return ctx.renderNotFound();
  }

  return ctx.render({ contents });
};

interface EntryPageProps extends PageProps {
  contents: string;
}

export default function EntryPage(props: EntryPageProps) {
  return (
    <body class="flex flex-col w-full h-full max-w-screen-sm mx-auto py-6 px-4 text-gray-900">
      <ContentMeta title={TITLE} url={props.url} />
      <Header />
      <Entry contents={props.data.contents} />
      <Footer />
    </body>
  );
}
