import { Handlers } from "$fresh/server.ts";

import { Paste } from "utils/types.ts";
import { getPasteById } from "utils/db.ts";

export const handler: Handlers<Paste> = {
  async GET(_req, ctx) {
    const paste = await getPasteById(ctx.params.id);

    if (paste === null) {
      return new Response("paste not found", { status: 404 });
    }

    return new Response(paste.contents, { status: 200 });
  },
};
