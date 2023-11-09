import { Handlers } from "$fresh/server.ts";

import { Entry } from "utils/types.ts";
import { getEntryById } from "utils/db.ts";

export const handler: Handlers<Entry> = {
  async GET(_req, ctx) {
    const entry = await getEntryById(ctx.params.id);

    if (entry === null) {
      return new Response("entry not found", { status: 404 });
    }

    return new Response(entry.contents, { status: 200 });
  },
};
