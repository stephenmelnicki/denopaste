import { expect } from "@std/expect";
import {
  assertSpyCallArg,
  assertSpyCallArgs,
  assertSpyCalls,
  spy,
} from "@std/testing/mock";
import { FreshContext, HttpError } from "fresh";
import { PirschNodeApiClient } from "pirsch";
import PirschReporter from "./mod.ts";
import { PasteEmptyError } from "../data/paste.ts";

Deno.test("PirschReporter", async (t) => {
  const mockPirsch = {
    hit: () => Promise.resolve(),
    event: () => Promise.resolve(),
  } as unknown as PirschNodeApiClient;

  const reporter = new PirschReporter(mockPirsch);

  await t.step(
    "getInstance() should return undefined when environment variables are not set",
    () => {
      const result = PirschReporter.getInstance();

      expect(result).toBeUndefined();
    },
  );

  await t.step(
    "pageView() should send a 'hit' to the pirsch client",
    () => {
      using hitSpy = spy(mockPirsch, "hit");

      const request = new Request("https://denopaste.com");
      const ctx = {
        info: {
          remoteAddr: {
            hostname: "0.0.0.0",
          },
        },
      } as FreshContext;

      reporter.pageView(request, ctx);

      assertSpyCalls(hitSpy, 1);
      assertSpyCallArgs(hitSpy, 0, [{
        url: request.url,
        ip: (ctx.info.remoteAddr as Deno.NetAddr).hostname,
        user_agent: "",
        accept_language: undefined,
        sec_ch_ua: undefined,
        sec_ch_ua_mobile: undefined,
        sec_ch_ua_platform: undefined,
        sec_ch_ua_platform_version: undefined,
        sec_ch_width: undefined,
        sec_ch_viewport_width: undefined,
        referrer: undefined,
      }]);
    },
  );

  await t.step(
    "pasteEvent() should send an 'event' to the pirsch client",
    () => {
      using eventSpy = spy(mockPirsch, "event");

      const request = new Request("https://denopaste.com");
      request.headers.set("content-length", "42");
      const response = new Response();
      response.headers.set("location", "/abc123");
      const ctx = {
        info: {
          remoteAddr: {
            hostname: "0.0.0.0",
          },
        },
      } as FreshContext;

      reporter.pasteEvent(request, response, ctx);

      assertSpyCalls(eventSpy, 1);
      assertSpyCallArgs(eventSpy, 0, [
        "Create Paste",
        {
          url: request.url,
          ip: (ctx.info.remoteAddr as Deno.NetAddr).hostname,
          user_agent: "",
          accept_language: undefined,
          sec_ch_ua: undefined,
          sec_ch_ua_mobile: undefined,
          sec_ch_ua_platform: undefined,
          sec_ch_ua_platform_version: undefined,
          sec_ch_width: undefined,
          sec_ch_viewport_width: undefined,
          referrer: undefined,
        },
        undefined,
        {
          id: "abc123",
          size: "42 bytes",
        },
      ]);
    },
  );

  await t.step(
    "errorEvent() should send an 'event' to the pirsch client",
    () => {
      using eventSpy = spy(mockPirsch, "event");

      const request = new Request("https://denopaste.com");
      const ctx = {
        info: {
          remoteAddr: {
            hostname: "0.0.0.0",
          },
        },
      } as FreshContext;
      const error = new PasteEmptyError();

      reporter.errorEvent(request, ctx, error);

      assertSpyCalls(eventSpy, 1);
      assertSpyCallArgs(eventSpy, 0, [
        "500 Server error",
        {
          url: request.url,
          ip: (ctx.info.remoteAddr as Deno.NetAddr).hostname,
          user_agent: "",
          accept_language: undefined,
          sec_ch_ua: undefined,
          sec_ch_ua_mobile: undefined,
          sec_ch_ua_platform: undefined,
          sec_ch_ua_platform_version: undefined,
          sec_ch_width: undefined,
          sec_ch_viewport_width: undefined,
          referrer: undefined,
        },
        undefined,
        {
          code: 500,
          method: request.method,
          url: request.url,
        },
      ]);
    },
  );

  await t.step(
    "errorEvent() should assign the correct name to the event",
    () => {
      using eventSpy = spy(mockPirsch, "event");

      const request = new Request("https://denopaste.com");
      const ctx = {
        info: {
          remoteAddr: {
            hostname: "0.0.0.0",
          },
        },
      } as FreshContext;

      const errors = [
        new HttpError(400),
        new HttpError(404),
        new HttpError(413),
        new HttpError(500),
        new Error(),
      ];

      errors.forEach((error) => {
        reporter.errorEvent(request, ctx, error);
      });

      assertSpyCalls(eventSpy, 5);
      assertSpyCallArg(eventSpy, 0, 0, "400 Bad request");
      assertSpyCallArg(eventSpy, 1, 0, "404 Paste not found");
      assertSpyCallArg(eventSpy, 2, 0, "413 Paste too large");
      assertSpyCallArg(eventSpy, 3, 0, "500 Server error");
      assertSpyCallArg(eventSpy, 4, 0, "500 Server error");
    },
  );
});
