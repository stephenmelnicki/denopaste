import { defineConfig } from "$fresh/server.ts";
import tailwind from "$fresh/plugins/tailwind.ts";
import { pirschPlugin, PirschPluginOptions } from "$pirsch";

const options: PirschPluginOptions = {
  hostname: Deno.env.get("PIRSCH_HOSTNAME"),
  accessToken: Deno.env.get("PIRSCH_ACCESS_TOKEN"),
  protocol: "https",
  filter: (req) => {
    return !req.url.includes(".ico") &&
      !req.url.includes(".woff2") &&
      !req.url.includes(".css") &&
      !req.url.includes(".js");
  },
};

export default defineConfig({
  plugins: [
    pirschPlugin(options),
    tailwind(),
  ],
});
