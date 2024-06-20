import { Database } from "$sqlite";

import { Paste, PasteDb } from "@/utils/types.ts";
import { createId } from "@/utils/id.ts";

export const getDbInstance: () => PasteDb = (() => {
  let database: PasteDb;

  return () => {
    if (!database) {
      const path = Deno.env.get("DB_PATH") ?? "data/pastes.db";
      database = new Db(path);
    }

    return database;
  };
})();

class Db implements PasteDb {
  private readonly writeDb;
  private readonly readDb;

  constructor(path: string) {
    this.writeDb = this.createDbConnection(path);
    this.readDb = this.createDbConnection(path, true);

    // ensure db connections are closed on exit
    Deno.addSignalListener("SIGINT", () => {
      try {
        this.writeDb.close();
        this.readDb.close();
      } catch (err) {
        console.error(err);
      } finally {
        Deno.exit();
      }
    });
  }

  private createDbConnection(
    path: string,
    isReadOnly: boolean = false,
  ): Database {
    const database = new Database(path, { readonly: isReadOnly });

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

  getPasteById(id: string): Paste | undefined {
    const statement = this.readDb.prepare(`
      SELECT id, contents, createdOn FROM pastes 
      WHERE id = :id 
      AND createdOn >= datetime('now', '-1 hour')
    `);

    return this.readDb
      .transaction((id: string) => statement.get<Paste>({ id }))
      .immediate(id);
  }

  insertPaste(contents: string): string {
    const statement = this.writeDb.prepare(
      "INSERT INTO pastes (id, contents) VALUES (:id, :contents)",
    );

    const id = createId();
    this.writeDb
      .transaction((id: string, contents: string) =>
        statement.run({ id, contents })
      )
      .immediate(id, contents);

    return id;
  }
}
