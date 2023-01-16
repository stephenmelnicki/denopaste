import { createClient, SupabaseClient } from "supabase";

class Database {
  private readonly client: SupabaseClient;

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

  async getEntry(id: string) {
    const { data, error } = await this.client
      .from("entries")
      .select("contents")
      .eq("id", id)
      .limit(1);

    if (error) {
      throw new Error(error.message);
    }

    return data[0];
  }
}

const db = new Database();
export default db;
