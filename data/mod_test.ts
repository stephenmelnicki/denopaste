import {
  assertSpyCallArg,
  assertSpyCallArgs,
  assertSpyCalls,
  spy,
  stub,
} from "@std/testing/mock";
import { expect } from "@std/expect";

import Paste, { PasteTooLargeError } from "./paste.ts";
import { getById, getKvInstance, insert } from "./mod.ts";

Deno.test("getKvInstance returns a singleton instance of Deno.Kv", async () => {
  using openKv = stub(Deno, "openKv", () => Promise.resolve({} as Deno.Kv));

  [await getKvInstance(), await getKvInstance(), await getKvInstance()].forEach(
    (instance, _index, instances) => {
      assertSpyCalls(openKv, 1);
      expect(instance).toBeDefined();
      expect(instances.every((i) => i === instance)).toBe(true);
    },
  );
});

Deno.test("getById returns null when paste is not found", async () => {
  using kv = await Deno.openKv(":memory:");
  using getSpy = spy(kv, "get");

  const result = await getById(kv, "notfound");

  expect(result).toBeNull();
  assertSpyCalls(getSpy, 1);
  assertSpyCallArg(getSpy, 0, 0, ["pastes", "notfound"]);
});

Deno.test("getById returns paste when found", async () => {
  using kv = await Deno.openKv(":memory:");
  using getSpy = spy(kv, "get");

  const paste = new Paste("test");
  kv.set(["pastes", paste.id], paste);
  const result = await getById(kv, paste.id);

  expect(result).toEqual(paste);
  assertSpyCalls(getSpy, 1);
  assertSpyCallArg(getSpy, 0, 0, ["pastes", paste.id]);
});

Deno.test("insert adds paste to the database", async () => {
  using kv = await Deno.openKv(":memory:");
  using setSpy = spy(kv, "set");

  const paste = new Paste("test");
  await insert(kv, paste);

  assertSpyCalls(setSpy, 1);
  assertSpyCallArgs(setSpy, 0, [["pastes", paste.id], paste, {
    expireIn: 60 * 60 * 1000,
  }]);
});

Deno.test("insert adds paste with custom expiration time", async () => {
  using kv = await Deno.openKv(":memory:");
  using setSpy = spy(kv, "set");

  const paste = new Paste("test");
  await insert(kv, paste, 1000);

  assertSpyCalls(setSpy, 1);
  assertSpyCallArgs(setSpy, 0, [["pastes", paste.id], paste, {
    expireIn: 1000,
  }]);
});

Deno.test("insert throws 'PasteTooLargeError' when Kv throws a TypeError with a message indicating the value is too large", async () => {
  const kv = {
    set: () => {
      throw new TypeError("value too large");
    },
  } as unknown as Deno.Kv;
  const paste = new Paste("hello world!");

  try {
    await insert(kv, paste);
    expect(true).toBe(false); // expected error to be thrown
  } catch (err) {
    expect(err).toBeInstanceOf(PasteTooLargeError);
  }
});

Deno.test("insert should throw all other errors", async () => {
  const error = new TypeError("test error");
  const kv = {
    set: () => {
      throw error;
    },
  } as unknown as Deno.Kv;
  const paste = new Paste("hello world!");

  try {
    await insert(kv, paste);
    expect(true).toBe(false); // expected error to be thrown
  } catch (err) {
    expect(err).not.toBeInstanceOf(PasteTooLargeError);
    expect(err).toEqual(error);
  }
});
