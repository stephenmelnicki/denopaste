import { Handlers, PageProps } from "$fresh/server.ts";

import Paste from "@/components/Paste.tsx";
import { getPasteById } from "@/utils/db.ts";

interface Paste {
  id: string;
  contents: string;
}

export const handler: Handlers<Paste> = {
  async GET(_req, ctx) {
    const id = ctx.params.id;
    const contents = await getPasteById(id);

    return contents === null
      ? ctx.renderNotFound()
      : ctx.render({ id, contents });
  },
};

export default function PasteById(props: PageProps<Paste>) {
  return (
    <>
      <Paste
        id={props.params.id}
        contents={props.data.contents}
      />
      <script type="text/javascript" src="/copyToClipboard.js" />
    </>
  );
}
