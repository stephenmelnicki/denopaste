import { type FreshContext, HttpError } from "fresh";
import { define, type State } from "../../utils/define.ts";

export const handler = define.handlers({
  async GET(ctx: FreshContext<State>) {
    const { db } = ctx.state;
    const paste = await db.getPasteById(ctx.params.id);

    if (!paste) {
      throw new HttpError(404);
    }

    return new Response(paste.contents, { status: 200 });
  },
});
