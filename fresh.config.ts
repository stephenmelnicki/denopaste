import { defineConfig } from "$fresh/server.ts";

import tailwind from "$fresh/plugins/tailwind.ts";
import pirschPlugin, {
  type PirschPluginOptions,
} from "@/plugins/pirsch/mod.ts";

const options: PirschPluginOptions = {
  hostname: Deno.env.get("PIRSCH_HOSTNAME")!,
  id: Deno.env.get("PIRSCH_CLIENT_ID")!,
  secret: Deno.env.get("PIRSCH_CLIENT_SECRET")!,
};

export default defineConfig({
  plugins: [
    tailwind(),
    pirschPlugin(options),
  ],
});
