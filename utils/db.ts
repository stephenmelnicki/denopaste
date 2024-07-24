import { ulid } from "@std/ulid";

export interface Paste {
  id: string;
  contents: string;
  createdAt: Date;
}

export const getDatabase: () => Promise<Database> = (() => {
  let database: Database;

  return async () => {
    if (!database) {
      const kv = Deno.env.get("DB_PATH")
        ? await Deno.openKv(Deno.env.get("DB_PATH"))
        : await Deno.openKv();

      database = new Db(kv);
    }

    return database;
  };
})();

interface Database {
  getPasteById(id: string): Promise<Paste | null>;
  insertPaste(contents: string): Promise<string>;
}

class Db implements Database {
  private readonly kv: Deno.Kv;

  constructor(kv: Deno.Kv) {
    this.kv = kv;
  }

  async getPasteById(id: string): Promise<Paste | null> {
    const result = await this.kv.get<Paste>(["pastes", id]);
    return result.value;
  }

  async insertPaste(contents: string): Promise<string> {
    const paste: Paste = {
      id: ulid(),
      contents,
      createdAt: new Date(),
    };

    await this.kv.set(["pastes", paste.id], paste, {
      expireIn: 60 * 60 * 1000, // ONE HOUR IN MS
    });

    return paste.id;
  }
}
