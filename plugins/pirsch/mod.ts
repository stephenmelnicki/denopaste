import { type Plugin, type PluginMiddleware } from "$fresh/server.ts";

import { createReporter } from "@/plugins/pirsch/src/reporter.ts";
import { PirschPluginOptions } from "@/plugins/pirsch/src/types.ts";

export type { PirschPluginOptions };

export default function pirschPlugin(options: PirschPluginOptions): Plugin {
  const report = createReporter(options);

  const middleware: PluginMiddleware = {
    path: "/",
    middleware: {
      handler: async (req, ctx) => {
        let res;
        let err;

        try {
          res = await ctx.next();
        } catch (error) {
          err = error;
          throw err;
        } finally {
          report(req, ctx);
        }

        return res;
      },
    },
  };

  return {
    name: "pirsch-plugin",
    middlewares: [middleware],
  };
}
