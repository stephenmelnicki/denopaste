import { App, fsRoutes, staticFiles, trailingSlashes } from "fresh";
import logger from "./middlewares/logger.ts";

import "@std/dotenv/load";

export const app = new App({ root: import.meta.url })
  .use(staticFiles())
  .use(trailingSlashes("never"));

await fsRoutes(app, {
  loadIsland: (path) => import(`./islands/${path}`),
  loadRoute: (path) => import(`./routes/${path}`),
});

app.use(logger);

if (import.meta.main) {
  await app.listen();
}
