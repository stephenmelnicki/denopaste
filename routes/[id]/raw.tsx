import { FreshContext } from "$fresh/server.ts";
import { State } from "@/utils/types.ts";

export const handler = {
  GET(_req: Request, ctx: FreshContext<State>) {
    const paste = ctx.state.db.getPasteById(ctx.params.id);

    return paste === undefined
      ? new Response("paste not found", { status: 404 })
      : new Response(paste.contents, { status: 200 });
  },
};
