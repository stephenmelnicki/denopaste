import { App, fsRoutes, staticFiles } from "fresh";

import logger from "middlewares/logger.ts";
import type { State } from "utils/fresh.ts";

export const app = new App<State>()
  .use(staticFiles())
  .use(logger());

await fsRoutes(app, {
  dir: "./",
  loadIsland: (path) => import(`./islands/${path}`),
  loadRoute: (path) => import(`./routes/${path}`),
});

if (import.meta.main) {
  await app.listen();
}
