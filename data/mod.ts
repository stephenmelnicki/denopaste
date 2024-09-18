import Paste, { PasteTooLargeError } from "./paste.ts";

let dbInstance: PasteDatabase | undefined;

/**
 * A paste database that can be used to store and retrieve paste data.
 */
export default class PasteDatabase {
  private readonly client: Deno.Kv;

  /**
   * Construct a PasteDatabase object
   *
   * @param client The client to use for database operations
   */
  protected constructor(client: Deno.Kv) {
    this.client = client;
  }

  /**
   * Retrieves a paste from the database with the given id. If no paste
   * exists with that id, null is returned.
   *
   * @example Usage
   * ```ts
   * import PasteDatabase from "./mod.ts";
   *
   * const db = await PasteDatabase.getDbInstance();
   * const paste = await db.getPasteById("abc123");
   * paste; // { id: "abc123", contents: ..., createdAt: ... }
   * ```
   *
   * @example Not Found
   * ```ts
   * import PasteDatabase from "./mod.ts";
   *
   * const db = await PasteDatabase.getDbInstance();
   * const notFound = await db.getPasteById("notfound");
   * notFound; // null
   * ```
   *
   * @param id The id of the paste to retrieve
   * @returns Paste object if found, null otherwise
   */
  async getPasteById(id: string): Promise<Paste | null> {
    const result = await this.client.get<Paste>(["pastes", id]);
    return result.value;
  }

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
  async insertPaste(
    paste: Paste,
    expireIn: number = 60 * 60 * 1000,
  ): Promise<void> {
    try {
      await this.client.set(["pastes", paste.id], paste, { expireIn });
    } catch (err: unknown) {
      if (err instanceof TypeError && err.message.includes("value too large")) {
        throw new PasteTooLargeError();
      }

      throw err;
    }
  }

  /**
   * Retrieves the singleton instance of PasteDatabase.
   *
   * @example Usage
   * ```ts
   * import PasteDatabase from "./mod.ts";
   *
   * const db = await PasteDatabase.getInstance();
   * ```
   *
   * @returns The singleton PasteDatabase instance
   */
  static async getInstance(): Promise<PasteDatabase> {
    if (!dbInstance) {
      console.log("connecting to database...");
      const kv = await Deno.openKv(Deno.env.get("DB_PATH"));
      dbInstance = new PasteDatabase(kv);
      console.log("connected.");
    }

    return dbInstance;
  }
}
