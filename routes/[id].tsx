import { Handlers } from "$fresh/server.ts";
import { getPasteById } from "utils/db.ts";

export const handler: Handlers = {
  async GET(_req, ctx) {
    const paste = await getPasteById(ctx.params.id);

    if (paste === null) {
      return new Response("paste not found", { status: 404 });
    }

    return new Response(paste, { status: 200 });
  },
};
