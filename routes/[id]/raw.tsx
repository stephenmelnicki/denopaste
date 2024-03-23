import { Handlers } from "$fresh/server.ts";
import { getPasteById } from "@/utils/db.ts";

export const handler: Handlers = {
  GET(_req, ctx) {
    const paste = getPasteById(ctx.params.id);

    return paste === undefined
      ? new Response("Paste not found.", { status: 404 })
      : new Response(paste.contents, { status: 200 });
  },
};
