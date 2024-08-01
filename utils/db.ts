import { ulid } from "@std/ulid";

export interface Paste {
  id: string;
  contents: string;
  createdAt: Date;
}

export interface Database {
  getPasteById(id: string): Promise<Paste | null>;
  insertPaste(contents: string): Promise<string>;
}

export const database: () => Promise<Database> = (() => {
  let database: Database;

  return async () => {
    if (!database) {
      console.log("connecting to database...");
      const kv = await Deno.openKv(Deno.env.get("DB_PATH"));
      database = new Db(kv);
      console.log("connected.");
    }

    return database;
  };
})();

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
    const paste = this.createPaste(contents);

    await this.kv.set(["pastes", paste.id], paste, {
      expireIn: 60 * 60 * 1000, // ONE HOUR IN MS
    });

    return paste.id;
  }

  private createPaste(contents: string): Paste {
    const paste: Paste = {
      id: ulid(),
      contents,
      createdAt: new Date(),
    };

    return paste;
  }
}
