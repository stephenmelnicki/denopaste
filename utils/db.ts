import { Entry } from "utils/types.ts";

const db = await Deno.openKv();

const ONE_HOUR_IN_MS = 60 * 60 * 1000;

export async function createEntry(
  entry: Entry,
  expireIn: number = ONE_HOUR_IN_MS,
) {
  await db.set(["entries", entry.id], entry, { expireIn });
  return entry.id;
}

export async function getEntryById(id: string) {
  const res = await db.get<Entry>(["entries", id]);
  return res.value;
}
