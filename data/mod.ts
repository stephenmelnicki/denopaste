import Paste, { PasteTooLargeError } from "./paste.ts";

export interface PasteDatabase {
  /**
   * Retrieves a paste from the database with the given id. If no paste
   * exists with that id, null is returned.
   *
   * @example Usage
   * ```ts
   * import { getDbInstance } from "./mod.ts";
   *
   * const db = await getDbInstance();
   * await db.getPasteById("abc123"); // { id: "abc123", contents: ..., createdAt: ... }
   * await db.getPasteById("notfound"); // null
   * ```
   *
   * @param id The id of the paste to retrieve
   * @returns Paste object if found, null otherwise
   */
  getPasteById(id: string): Promise<Paste | null>;
  /**
   * Inserts a new paste into the database. If a paste with the same id
   * already exists, it will be overwritten.
   *
   * @example Usage
   * ```ts
   * import PasteDatabase from "./mod.ts";
   *
   * const db = await PasteDatabase.getDbInstance();
   * const paste = new Paste("Hello, world!");
   * await db.insertPaste(paste);
   * ```
   *
   * @param paste The paste to insert
   * @param expireIn The time, in milliseconds, until the paste expires. Defaults to 1 hour.
   * @throws {PasteTooLargeError} If the paste is too large to store in to the database
   */
  insertPaste(paste: Paste, expireIn?: number): Promise<void>;
}

export const getPasteDb: () => Promise<PasteDatabase> = (() => {
  let db: PasteDatabase | undefined;

  return async () => {
    if (!db) {
      const kv = await Deno.openKv(Deno.env.get("DB_PATH"));
      db = new Database(kv);
    }

    return db;
  };
})();

export class Database implements PasteDatabase {
  #kv: Deno.Kv;

  constructor(kv: Deno.Kv) {
    this.#kv = kv;
  }

  async getPasteById(id: string): Promise<Paste | null> {
    const result = await this.#kv.get<Paste>(["pastes", id]);
    return result.value;
  }

  async insertPaste(
    paste: Paste,
    expireIn: number = 60 * 60 * 1000,
  ): Promise<void> {
    try {
      await this.#kv.set(["pastes", paste.id], paste, { expireIn });
    } catch (err: unknown) {
      // NOTE: The validation checks on Paste object creation are only an
      // approximation of the KV value insertion limits. This is a fallback to
      // catch such an error and still give a helpful error message.
      if (err instanceof TypeError && err.message.includes("value too large")) {
        throw new PasteTooLargeError();
      }

      throw err;
    }
  }
}
