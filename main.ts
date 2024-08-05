import "@std/dotenv/load";

import { App, fsRoutes, staticFiles, trailingSlashes } from "fresh";
import { type State } from "./utils/define.ts";

export const app = new App<State>({ root: import.meta.url })
  .use(staticFiles())
  .use(trailingSlashes("never"));

await fsRoutes(app, {
  loadIsland: (path) => import(`./islands/${path}`),
  loadRoute: (path) => import(`./routes/${path}`),
});

if (import.meta.main) {
  await app.listen();
}
