import { Handlers } from "$fresh/server.ts";
import { MAX_PASTE_CHARACTERS } from "@/utils/data.ts";

export const handler: Handlers = {
  GET(req, ctx) {
    if (ctx.params.id !== "hello") {
      return ctx.renderNotFound();
    }

    return new Response("hello");
  },
  OPTIONS(req, ctx) {
    return new Response(undefined, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, PUT",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  },
  //PUT(req, ctx){}
  //POST(_req: Request, _ctx: HandlerContext){}
};
