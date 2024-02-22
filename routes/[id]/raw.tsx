import { Handlers } from "$fresh/server.ts";
import { getPasteById } from "@/utils/db.ts";

export const handler: Handlers = {
  async GET(_req, ctx) {
    const id = ctx.params.id;
    const contents = await getPasteById(id);

    return contents === null
      ? new Response("paste not found", { status: 404 })
      : new Response(contents, { status: 200 });
  },
};
