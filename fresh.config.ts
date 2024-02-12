import { defineConfig } from "$fresh/server.ts";

import tailwind from "$fresh/plugins/tailwind.ts";
import pirschPlugin, {
  type PirschPluginOptions,
} from "@/plugins/pirsch/mod.ts";

const options: PirschPluginOptions = {
  hostname: Deno.env.get("PIRSCH_HOSTNAME"),
  id: Deno.env.get("PIRSCH_CLIENT_ID"),
  secret: Deno.env.get("PIRSCH_CLIENT_SECRET"),
  filter: (req) => {
    return !req.url.includes(".css") &&
      !req.url.includes(".js") &&
      !req.url.includes(".woff2");
  },
};

export default defineConfig({
  plugins: [
    tailwind(),
    pirschPlugin(options),
  ],
});
