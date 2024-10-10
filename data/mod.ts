import Paste, { PasteTooLargeError } from "./paste.ts";

/**
 * Retrieves a singleton instance of the Deno.Kv database. The connection is
 * opened on the first call to this function.
 *
 * @example Usage
 * ```ts
 * import Paste from "./paste.ts";
 *
 * using kv = await getKvInstance();
 * kv.list<Paste>({ prefix: ["pastes"]}) // []
 * ```
 *
 * @returns The Deno.Kv instance
 */
export const getKvInstance: () => Promise<Deno.Kv> = (() => {
  let db: Deno.Kv;

  return async () => {
    if (!db) {
      db = await Deno.openKv(Deno.env.get("DB_PATH"));
    }

    return db;
  };
})();

/**
 * Retrieves a paste from the database with the given id. If no paste
 * exists with that id, null is returned.
 *
 * @example Usage
 * ```ts
 * using kv = await Deno.openKv(":memory:");
 * const paste = await getById(kv, "1");
 * paste?.id // "1"
 * paste?.contents // "Hello, world!"
 * paste?.createdAt // Date object
 * ```
 *
 * @param kv The Deno.Kv instance to retrieve the paste from
 * @param id The id of the paste to retrieve
 * @returns Paste object if found, null otherwise
 */
export async function getById(kv: Deno.Kv, id: string): Promise<Paste | null> {
  const result = await kv.get<Paste>(["pastes", id]);
  return result.value;
}

/**
 * Inserts a new paste into the database. If a paste with the same id
 * already exists, it will be overwritten.
 *
 * @example Usage
 * ```ts
 * import Paste from "./paste.ts";
 *
 * using kv = await Deno.openKv(":memory:");
 * const paste = new Paste("Hello, world!");
 * await insert(kv, paste);
 * ```
 *
 * @param kv The Deno.Kv instance to insert the paste into
 * @param paste The paste to insert
 * @param expireIn The time, in milliseconds, until the paste expires. Defaults to 1 hour.
 * @throws {PasteTooLargeError} If the paste is too large to store in to the database
 */
export async function insert(
  kv: Deno.Kv,
  paste: Paste,
  expireIn: number = 60 * 60 * 1000,
): Promise<void> {
  try {
    await kv.set(["pastes", paste.id], paste, { expireIn });
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
