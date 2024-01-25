import { createId } from "utils/id.ts";

const kv = await Deno.openKv();

const ONE_HOUR_IN_MS = 60 * 60 * 1000;

export async function createNewPaste(
  contents: string,
  expireIn: number = ONE_HOUR_IN_MS,
) {
  const id = createId();
  await kv.set(["pastes", id], contents, { expireIn });
  return id;
}

export async function getPasteById(id: string) {
  const res = await kv.get<string>(["pastes", id]);
  return res.value;
}
