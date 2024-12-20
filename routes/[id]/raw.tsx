import { type FreshContext } from "fresh";

import { define, type State } from "../../utils/define.ts";
import { getById } from "../../data/mod.ts";

async function GET(ctx: FreshContext<State>) {
  const paste = await getById(ctx.state.kv, ctx.params.id);

  if (!paste) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(paste.contents, { status: 200 });
}

export const handler = define.handlers({ GET });
