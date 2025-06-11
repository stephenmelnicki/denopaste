import { type FreshContext } from "fresh";

import { define, type State } from "utils/fresh.ts";
import { getPasteById } from "data/pastes.ts";

async function GET(ctx: FreshContext<State>) {
  const paste = await getPasteById(ctx.params.id);

  if (!paste) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(paste.contents, { status: 200 });
}

export const handler = define.handlers({ GET });
