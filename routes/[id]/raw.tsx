import { Handlers } from "$fresh/server.ts";
import { getPasteById } from "@/utils/db.ts";

export const handler: Handlers = {
  GET(_req, ctx) {
    const contents = getPasteById(ctx.params.id);

    return contents === undefined
      ? new Response("paste not found", { status: 404 })
      : new Response(contents, { status: 200 });
  },
};
