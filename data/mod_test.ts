import { assertSpyCallArg, assertSpyCalls, spy, stub } from "@std/testing/mock";
import { expect } from "@std/expect";

import Paste, { PasteTooLargeError } from "./paste.ts";
import PasteDatabase from "./mod.ts";

const testPaste = new Paste("test");

const kvMock = {
  get: (args: [string, string] | null) => {
    if (args?.[1] === testPaste.id) {
      return Promise.resolve({ value: testPaste });
    }

    return Promise.resolve({ value: null });
  },
  set: (_args: [string, string], paste: Paste) => {
    if (paste.contents === "too large") {
      throw new TypeError("value too large");
    }

    return Promise.resolve();
  },
} as unknown as Deno.Kv;

Deno.test("PasteDatabase.getInstance() should open a kv instance", async () => {
  using log = stub(console, "log");
  using openKv = stub(Deno, "openKv", () => Promise.resolve(kvMock));
  const result = await PasteDatabase.getInstance();

  expect(result).toBeDefined();
  assertSpyCalls(log, 2);
  assertSpyCallArg(log, 0, 0, "connecting to database...");
  assertSpyCallArg(log, 1, 0, "connected.");
  assertSpyCalls(openKv, 1);
});

Deno.test("getPasteById() should return null when paste is not found", async () => {
  using _log = stub(console, "log");
  using _openKv = stub(Deno, "openKv", () => Promise.resolve(kvMock));
  using get = spy(kvMock, "get");

  const db = await PasteDatabase.getInstance();
  const id = "keyboardcat";
  const result = await db.getPasteById(id);

  expect(result).toBeNull();
  assertSpyCalls(get, 1);
  assertSpyCallArg(get, 0, 0, ["pastes", id]);
});

Deno.test("getPasteById() should return paste when found", async () => {
  using _log = stub(console, "log");
  using _openKv = stub(Deno, "openKv", () => Promise.resolve(kvMock));
  using get = spy(kvMock, "get");

  const db = await PasteDatabase.getInstance();
  const result = await db.getPasteById(testPaste.id);

  expect(result).toEqual(testPaste);
  assertSpyCalls(get, 1);
  assertSpyCallArg(get, 0, 0, ["pastes", testPaste.id]);
});

Deno.test("insertPaste() should insert a paste that expires in one hour by default", async () => {
  using _log = stub(console, "log");
  using _openKv = stub(Deno, "openKv", () => Promise.resolve(kvMock));
  using set = spy(kvMock, "set");

  const db = await PasteDatabase.getInstance();
  await db.insertPaste(testPaste);

  assertSpyCalls(set, 1);
  assertSpyCallArg(set, 0, 0, ["pastes", testPaste.id]);
  assertSpyCallArg(set, 0, 1, testPaste);
  assertSpyCallArg(set, 0, 2, { expireIn: 60 * 60 * 1000 });
});

Deno.test("insertPaste() should insert a paste that expires in the specified time", async () => {
  using _log = stub(console, "log");
  using _openKv = stub(Deno, "openKv", () => Promise.resolve(kvMock));
  using set = spy(kvMock, "set");

  const db = await PasteDatabase.getInstance();
  await db.insertPaste(testPaste, 1000);

  assertSpyCalls(set, 1);
  assertSpyCallArg(set, 0, 0, ["pastes", testPaste.id]);
  assertSpyCallArg(set, 0, 1, testPaste);
  assertSpyCallArg(set, 0, 2, { expireIn: 1000 });
});

Deno.test("insertPaste() should throw a PasteTooLargeError when the paste is too large", async () => {
  using _log = stub(console, "log");
  using _openKv = stub(Deno, "openKv", () => Promise.resolve(kvMock));
  using set = spy(kvMock, "set");

  const db = await PasteDatabase.getInstance();
  const tooLargePaste = new Paste("too large");

  try {
    await db.insertPaste(tooLargePaste);
    expect(true).toBe(false); // expected error to be thrown
  } catch (err) {
    expect(err).toBeInstanceOf(PasteTooLargeError);
    assertSpyCalls(set, 1);
    assertSpyCallArg(set, 0, 0, ["pastes", tooLargePaste.id]);
    assertSpyCallArg(set, 0, 1, tooLargePaste);
    assertSpyCallArg(set, 0, 2, { expireIn: 60 * 60 * 1000 });
  }
});
