import "@std/dotenv/load";

import { App, fsRoutes, staticFiles, trailingSlashes } from "fresh";

import logger from "./middlewares/logger.ts";
import pirsch from "./middlewares/pirsch.ts";

export const app = new App({ root: import.meta.url })
  .use(staticFiles())
  .use(trailingSlashes("never"))
  .use(logger())
  .use(pirsch());

await fsRoutes(app, {
  loadIsland: (path) => import(`./islands/${path}`),
  loadRoute: (path) => import(`./routes/${path}`),
});

if (import.meta.main) {
  await app.listen();
}
