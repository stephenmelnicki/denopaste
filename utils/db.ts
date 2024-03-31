import { Database } from "$sqlite";

import { createId } from "@/utils/id.ts";
import { Paste } from "@/utils/types.ts";

export class Db {
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

  public getPasteById(id: string): Paste | undefined {
    const statement = this.readDb.prepare(
      "SELECT id, contents, createdOn FROM pastes WHERE id = :id",
    );

    const getPaste = this.readDb.transaction((id: string) => {
      return statement.get<Paste>({ id });
    });

    const paste = getPaste.immediate(id);
    return paste && this.isRecent(paste) ? paste : undefined;
  }

  public createPaste(contents: string): string {
    const statement = this.writeDb.prepare(
      "INSERT INTO pastes (id, contents) VALUES (:id, :contents)",
    );

    const createPaste = this.writeDb.transaction(
      (id: string, contents: string) => {
        return statement.run({ id, contents });
      },
    );

    const id = createId();
    createPaste.immediate(id, contents);
    return id;
  }

  private createDbConnection(path: string, readonly: boolean = false) {
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

  private isRecent({ createdOn }: Paste) {
    const now = new Date().getTime();
    const then = Date.parse(createdOn);
    const ONE_HOUR_IN_MS = 60 * 60 * 1000;

    return (now - then) <= ONE_HOUR_IN_MS;
  }
}
