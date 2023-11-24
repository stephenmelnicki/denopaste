import { Paste } from "utils/types.ts";

const kv = await Deno.openKv();

const ONE_HOUR_IN_MS = 60 * 60 * 1000;

export async function createNewPaste(
  paste: Paste,
  expireIn: number = ONE_HOUR_IN_MS,
) {
  await kv.set(["pastes", paste.id], paste, { expireIn });
}

export async function getPasteById(id: string) {
  const res = await kv.get<Paste>(["pastes", id]);
  return res.value;
}
