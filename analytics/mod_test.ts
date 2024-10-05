import {
  assertSpyCallArg,
  assertSpyCallArgs,
  assertSpyCalls,
  stub,
} from "@std/testing/mock";
import { FreshContext, HttpError } from "fresh";
import { PirschNodeApiClient } from "pirsch";

import { errorEvent, hit, pasteEvent } from "./mod.ts";

const mockClient = {
  hit: () => Promise.resolve(),
  event: () => Promise.resolve(),
} as unknown as PirschNodeApiClient;

const mockCtx = {
  req: new Request("https://denopaste.com"),
  info: {
    remoteAddr: {
      hostname: "0.0.0.0",
    },
  },
} as FreshContext;

Deno.test("pageView should send a 'hit' to the pirsch client", () => {
  using hitSpy = stub(mockClient, "hit");

  hit(mockClient, mockCtx);

  assertSpyCalls(hitSpy, 1);
  assertSpyCallArgs(hitSpy, 0, [{
    url: mockCtx.req.url,
    ip: (mockCtx.info.remoteAddr as Deno.NetAddr).hostname,
    user_agent: "unknown",
    accept_language: undefined,
    sec_ch_ua: undefined,
    sec_ch_ua_mobile: undefined,
    sec_ch_ua_platform: undefined,
    sec_ch_ua_platform_version: undefined,
    sec_ch_width: undefined,
    sec_ch_viewport_width: undefined,
    referrer: undefined,
  }]);
});

Deno.test("pasteEvent should send an 'event' to the pirsch client", () => {
  using eventSpy = stub(mockClient, "event");

  const response = new Response();
  response.headers.set("location", "/abc123");

  pasteEvent(mockClient, mockCtx, response);

  assertSpyCalls(eventSpy, 1);
  assertSpyCallArgs(eventSpy, 0, [
    "Create Paste",
    {
      url: mockCtx.req.url,
      ip: (mockCtx.info.remoteAddr as Deno.NetAddr).hostname,
      user_agent: "unknown",
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
      size: "0 bytes",
    },
  ]);
});

Deno.test("errorEvent should send an 'event' to the pirsch client", () => {
  using eventSpy = stub(mockClient, "event");

  const errorCtx = {
    ...mockCtx,
    error: new HttpError(400),
  };

  errorEvent(mockClient, errorCtx);

  assertSpyCalls(eventSpy, 1);
  assertSpyCallArgs(eventSpy, 0, [
    "400 Bad request",
    {
      url: errorCtx.req.url,
      ip: (mockCtx.info.remoteAddr as Deno.NetAddr).hostname,
      user_agent: "unknown",
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
      code: 400,
      method: errorCtx.req.method,
      url: errorCtx.req.url,
    },
  ]);
});

Deno.test("errorEvent should assign the correct name to the event", () => {
  using eventSpy = stub(mockClient, "event");

  [
    { ...mockCtx, error: new HttpError(400) },
    { ...mockCtx, error: new HttpError(404) },
    { ...mockCtx, error: new HttpError(413) },
    { ...mockCtx, error: new HttpError(500) },
    { ...mockCtx, error: new Error() },
  ].forEach((ctx) => {
    errorEvent(mockClient, ctx);
  });

  assertSpyCalls(eventSpy, 5);
  assertSpyCallArg(eventSpy, 0, 0, "400 Bad request");
  assertSpyCallArg(eventSpy, 1, 0, "404 Paste not found");
  assertSpyCallArg(eventSpy, 2, 0, "413 Paste too large");
  assertSpyCallArg(eventSpy, 3, 0, "500 Server error");
  assertSpyCallArg(eventSpy, 4, 0, "500 Server error");
});
