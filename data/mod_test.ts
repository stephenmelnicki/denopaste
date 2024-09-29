import {
  assertSpyCallArg,
  assertSpyCallArgs,
  assertSpyCalls,
  spy,
  stub,
} from "@std/testing/mock";
import { expect } from "@std/expect";
import Paste, { PasteTooLargeError } from "./paste.ts";
import PasteDatabase from "./mod.ts";

Deno.test("PasteDatabase", async (t) => {
  const testPaste = new Paste("test");

  const mockKv = {
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

  const db = new PasteDatabase(mockKv);

  await t.step(
    "getInstance() should open a kv connection and return the same instance on subsequent calls",
    async () => {
      using openKv = stub(Deno, "openKv", () => Promise.resolve(mockKv));

      [
        await PasteDatabase.getInstance(),
        await PasteDatabase.getInstance(),
        await PasteDatabase.getInstance(),
      ].forEach((instance, _index, instances) => {
        assertSpyCalls(openKv, 1);
        expect(instance).toBeDefined();
        expect(instances.every((i) => i === instance)).toBe(true);
      });
    },
  );

  await t.step(
    "getPasteById() should return null when paste is not found",
    async () => {
      using getSpy = spy(mockKv, "get");

      const id = "keyboardcat";
      const result = await db.getPasteById(id);

      expect(result).toBeNull();
      assertSpyCalls(getSpy, 1);
      assertSpyCallArg(getSpy, 0, 0, ["pastes", id]);
    },
  );

  await t.step("getPasteById() should return paste when found", async () => {
    using getSpy = spy(mockKv, "get");

    const result = await db.getPasteById(testPaste.id);

    expect(result).toEqual(testPaste);
    assertSpyCalls(getSpy, 1);
    assertSpyCallArg(getSpy, 0, 0, ["pastes", testPaste.id]);
  });

  await t.step(
    "insertPaste() should insert a paste that expires in one hour by default",
    async () => {
      using setSpy = spy(mockKv, "set");

      await db.insertPaste(testPaste);

      assertSpyCalls(setSpy, 1);
      assertSpyCallArgs(setSpy, 0, [
        ["pastes", testPaste.id],
        testPaste,
        { expireIn: 60 * 60 * 1000 },
      ]);
    },
  );

  await t.step(
    "insertPaste() should insert a paste that expires in the specified time",
    async () => {
      using setSpy = spy(mockKv, "set");

      await db.insertPaste(testPaste, 1000);

      assertSpyCalls(setSpy, 1);
      assertSpyCallArgs(setSpy, 0, [
        ["pastes", testPaste.id],
        testPaste,
        { expireIn: 1000 },
      ]);
    },
  );

  await t.step(
    "insertPaste() should throw 'PasteTooLargeError' when kv throws 'TypeError' with 'value too large' in the message",
    async () => {
      using setSpy = spy(mockKv, "set");
      const tooLargePaste = new Paste("too large");

      try {
        await db.insertPaste(tooLargePaste);
        expect(true).toBe(false); // expected error to be thrown
      } catch (err) {
        expect(err).toBeInstanceOf(PasteTooLargeError);
        assertSpyCalls(setSpy, 1);
        assertSpyCallArgs(setSpy, 0, [
          ["pastes", tooLargePaste.id],
          tooLargePaste,
          { expireIn: 60 * 60 * 1000 },
        ]);
      }
    },
  );
});
