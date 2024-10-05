import "@std/dotenv/load";

import { App, fsRoutes, staticFiles, trailingSlashes } from "fresh";

import logger from "./middlewares/logger.ts";
import reporter from "./middlewares/reporter.ts";

export const app = new App({ root: import.meta.url })
  .use(logger())
  .use(reporter())
  .use(staticFiles())
  .use(trailingSlashes("never"));

await fsRoutes(app, {
  loadIsland: (path) => import(`./islands/${path}`),
  loadRoute: (path) => import(`./routes/${path}`),
});

if (import.meta.main) {
  await app.listen();
}
