import { HttpError } from "fresh";

import { define } from "../../utils/state.ts";
import { getDatabase } from "../../utils/db.ts";

export const handler = define.handlers({
  async GET(ctx) {
    const db = await getDatabase();
    const paste = await db.getPasteById(ctx.params.id);

    if (!paste) {
      throw new HttpError(404);
    }

    return new Response(paste.contents, { status: 200 });
  },
});
