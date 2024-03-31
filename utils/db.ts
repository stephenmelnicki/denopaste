import { Database } from "$sqlite";
import { createId } from "@/utils/id.ts";

export function createNewPaste(contents: string): string {
  const statement = writeDb().prepare(
    "INSERT INTO pastes (id, contents) VALUES (:id, :contents)",
  );

  const createPaste = writeDb().transaction((id: string, contents: string) => {
    statement.run({ id, contents });
  });

  const id = createId();
  createPaste.immediate(id, contents);
  return id;
}

const writeDb = (function () {
  let db: Database;

  return function () {
    if (!db) {
      db = initializeDb();
    }

    return db;
  };
})();

function initializeDb(readonly = false) {
  const path = Deno.env.get("DB_PATH") ?? "data/pastes.db";
  const database = new Database(path, { readonly });

  // litestream recommended sqlite settings
  // https://litestream.io/tips/
  database.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA busy_timeout = 5000;
    PRAGMA synchronous = NORMAL;
    PRAGMA wal_autocheckpoint = 0;
  `);

  // ensure pastes table exists
  database.exec(`
    CREATE TABLE IF NOT EXISTS pastes (
      id TEXT PRIMARY KEY NOT NULL,
      contents TEXT NOT NULL,
      createdOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
    ) STRICT;
  `);

  return database;
}

export function getPasteById(id: string): Paste | undefined {
  const statement = readDb().prepare(
    "SELECT id, contents, createdOn FROM pastes WHERE id = :id",
  );

  const getPaste = readDb().transaction((id: string) => {
    return statement.get<Paste>({ id });
  });

  const paste = getPaste.immediate(id);
  return paste && isRecent(paste.createdOn) ? paste : undefined;
}

export type Paste = {
  id: string;
  contents: string;
  createdOn: string;
};

const readDb = (function () {
  let db: Database;

  return function () {
    if (!db) {
      db = initializeDb(true);
    }

    return db;
  };
})();

function isRecent(dateString: string) {
  const now = new Date().getTime();
  const createdOn = Date.parse(dateString);
  const ONE_HOUR_IN_MS = 60 * 60 * 1000;

  return (now - createdOn) <= ONE_HOUR_IN_MS;
}

// ensure db connections are closed on exit
Deno.addSignalListener("SIGINT", () => {
  try {
    writeDb().close();
    readDb().close();
  } catch (err) {
    console.error(err);
  } finally {
    Deno.exit();
  }
});
