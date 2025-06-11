import { estimateSize } from "@deno/kv-utils";
import { ulid } from "@std/ulid";

const db = await Deno.openKv();

export interface Paste {
  id: string;
  contents: string;
  createdAt: Date;
}

export class PasteEmptyError extends Error {
  override readonly message = "Paste can not be empty.";
}

export class PasteTooLargeError extends Error {
  override readonly message = "Paste is too large. Size limit is 64 KiB.";
}

export function createPaste(contents: string): Paste {
  if (contents.trim().length === 0) {
    throw new PasteEmptyError();
  }

  if (estimateSize(contents) > 64 * 1024) { // KV has a value size limit of 64KB
    throw new PasteTooLargeError();
  }

  const id = ulid();
  const createdAt = new Date();

  return {
    id,
    contents,
    createdAt,
  };
}

function pasteKey(id: string): [string, string] {
  return ["pastes", id];
}

export async function getPasteById(id: string): Promise<Paste | null> {
  const result = await db.get<Paste>(pasteKey(id));
  return result.value;
}

export async function addPaste(
  paste: Paste,
  expireIn: number = 60 * 60 * 1000, // One hour in ms
) {
  try {
    await db.set(pasteKey(paste.id), paste, { expireIn });
  } catch (err: unknown) {
    // The size check on paste creation is only an estimation. This is a fallback to
    // catch a KV Value too large error and provide a helpful message to the user.
    if (err instanceof TypeError && err.message.includes("value too large")) {
      throw new PasteTooLargeError();
    }

    throw err;
  }
}
