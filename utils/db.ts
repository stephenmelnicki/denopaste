import { Database } from "$sqlite";
import { createId } from "@/utils/id.ts";

const db = (function () {
  let database: Database;

  function initializeDb() {
    const path = Deno.env.get("DB_PATH") ?? "data/pastes.db";
    database = new Database(path);

    // litestream recommended sqlite settings
    // https://litestream.io/tips/
    database.exec(`
      pragma busy_timeout = 5000;
      pragma synchronous = NORMAL;
      pragma journal_mode = WAL;
      pragma wal_autocheckpoint = 0;
    `);

    // ensure pastes table exists
    database.exec(`
      create table if not exists pastes (
        id text primary key not null,
        contents text not null,
        createdOn timestamp default current_timestamp not null
      )
    `);

    return database;
  }

  return function () {
    if (!database) {
      database = initializeDb();
    }

    return database;
  };
})();

export type Paste = {
  id: string;
  contents: string;
  createdOn: string;
};

export function createNewPaste(contents: string) {
  const id = createId();

  db()
    .prepare("insert into pastes (id, contents) values (:id, :contents)")
    .run({ id, contents });

  return id;
}

function isRecent(dateString: string) {
  const now = new Date().getTime();
  const createdOn = Date.parse(dateString);
  const ONE_HOUR_IN_MS = 60 * 60 * 1000;

  return (now - createdOn) <= ONE_HOUR_IN_MS;
}

export function getPasteById(id: string) {
  const paste = db()
    .prepare("select id, contents, createdOn from pastes where id = :id")
    .get<Paste>({ id });

  return paste && isRecent(paste.createdOn) ? paste : undefined;
}

Deno.addSignalListener("SIGINT", () => {
  try {
    db().close();
  } catch (err) {
    console.error(err);
  } finally {
    Deno.exit();
  }
});
