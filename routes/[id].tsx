import { Handler, HandlerContext } from "$fresh/server.ts";

import db from "@/utils/database.ts";

interface Data {
  contents: string;
}

export const handler: Handler<Data> = async (
  _req: Request,
  ctx: HandlerContext<Data>,
): Promise<Response> => {
  try {
    const contents = await db.getEntry(ctx.params.id);

    if (contents === undefined) {
      return new Response("entry not found", { status: 404 });
    }

    return new Response(contents, { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("server error", { status: 500 });
  }
};
