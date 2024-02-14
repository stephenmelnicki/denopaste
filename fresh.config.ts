import { defineConfig } from "$fresh/server.ts";
import tailwind from "$fresh/plugins/tailwind.ts";

import { pirschPlugin, PirschPluginOptions } from "freshPirsch";

const options: PirschPluginOptions = {
  hostname: Deno.env.get("PIRSCH_HOSTNAME"),
  accessToken: Deno.env.get("PIRSCH_TOKEN"),
  protocol: "https",
  filter: (req: Request) => {
    return !req.url.includes(".ico") &&
      !req.url.includes(".css") &&
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
