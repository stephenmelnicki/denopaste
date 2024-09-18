import { type FreshContext } from "fresh";
import { define, type State } from "../../utils/define.ts";

export const handler = define.handlers({
  async GET(ctx: FreshContext<State>) {
    const { db } = ctx.state;
    const paste = await db.getPasteById(ctx.params.id);

    if (!paste) {
      return new Response("Not found", { status: 404 });
    }

    return new Response(paste.contents, { status: 200 });
  },
});
