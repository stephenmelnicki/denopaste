import { Database } from "$sqlite";
import { createId } from "@/utils/id.ts";

function db() {
  let database: Database | undefined;

  return function () {
    if (database) {
      return database;
    }

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
  }();
}

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
  const result = db()
    .prepare("select contents, createdOn from pastes where id = :id")
    .get<{ contents: string; createdOn: string }>({ id });

  return result && isRecent(result.createdOn) ? result.contents : undefined;
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
