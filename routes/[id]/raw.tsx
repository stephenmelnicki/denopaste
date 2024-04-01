import { FreshContext, Handlers } from "$fresh/server.ts";
import { State } from "@/utils/types.ts";

// deno-lint-ignore no-explicit-any
export const handler: Handlers<any, State> = {
  GET(_req: Request, ctx: FreshContext<State>) {
    const paste = ctx.state.db.getPasteById(ctx.params.id);

    return paste === undefined
      ? new Response("paste not found", { status: 404 })
      : new Response(paste.contents, { status: 200 });
  },
};
