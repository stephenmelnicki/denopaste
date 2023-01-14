import { createClient, SupabaseClient } from "supabase";

export interface Database {
  insertEntry(id: string, contents: string): Promise<string>;
  getEntry(id: string): Promise<string | undefined>;
}

class Db implements Database {
  private client: SupabaseClient;

  constructor() {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_KEY = Deno.env.get("SUPABASE_KEY")!;
    this.client = createClient(SUPABASE_URL, SUPABASE_KEY);
  }

  async insertEntry(id: string, contents: string) {
    const { error } = await this.client
      .from("entries")
      .insert({
        id,
        contents,
      });

    if (error) {
      throw new Error(error.message);
    }

    return id;
  }

  async getEntry(id: string): Promise<string | undefined> {
    const { data, error } = await this.client
      .from("entries")
      .select("contents")
      .eq("id", id);

    if (error) {
      throw new Error(error.message);
    }

    return data.length === 0 ? undefined : data[0].contents;
  }
}

const db: Database = new Db();
export default db;
