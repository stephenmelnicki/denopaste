import { assertSpyCallArg, assertSpyCalls, stub } from "@std/testing/mock";
import { FreshContext, HttpError } from "fresh";
import PirschReporter from "./mod.ts";
import report from "./report.ts";

Deno.test("report()", async (t) => {
  const reporterInstance = {
    pageView: () => {},
    pasteEvent: () => {},
    errorEvent: () => {},
  } as unknown as PirschReporter;

  const context = {
    error: null,
  } as unknown as FreshContext;

  await t.step("returns when there's no reporter instance", () => {
    using _ = stub(PirschReporter, "getInstance", () => undefined);
    using pageView = stub(reporterInstance, "pageView");
    using pasteEvent = stub(reporterInstance, "pasteEvent");
    using errorEvent = stub(reporterInstance, "errorEvent");

    report(new Request("https://denopaste.com/"), context, new Response());

    assertSpyCalls(pageView, 0);
    assertSpyCalls(pasteEvent, 0);
    assertSpyCalls(errorEvent, 0);
  });

  await t.step("tracks only GET & POST requests", () => {
    using _ = stub(PirschReporter, "getInstance", () => reporterInstance);
    using pageView = stub(reporterInstance, "pageView");
    using pasteEvent = stub(reporterInstance, "pasteEvent");
    using errorEvent = stub(reporterInstance, "errorEvent");

    report(
      new Request("https://denopaste.com/", { method: "PUT" }),
      context,
      new Response(),
    );

    report(
      new Request("https://denopaste.com/1234", { method: "DELETE" }),
      context,
      new Response(),
    );

    assertSpyCalls(pageView, 0);
    assertSpyCalls(pasteEvent, 0);
    assertSpyCalls(errorEvent, 0);
  });

  await t.step("does not track asset requests", () => {
    using _ = stub(PirschReporter, "getInstance", () => reporterInstance);
    using pageView = stub(reporterInstance, "pageView");
    using pasteEvent = stub(reporterInstance, "pasteEvent");
    using errorEvent = stub(reporterInstance, "errorEvent");

    [
      new Request("https://denopaste.com/favicon.ico"),
      new Request("https://denopaste.com/fonts.woff2"),
      new Request("https://denopaste.com/styles.css"),
      new Request("https://denopaste.com/denopaste.js"),
    ].forEach((req) => {
      report(req, context, new Response());
    });

    assertSpyCalls(pageView, 0);
    assertSpyCalls(pasteEvent, 0);
    assertSpyCalls(errorEvent, 0);
  });

  await t.step("tracks errors", () => {
    using _ = stub(PirschReporter, "getInstance", () => reporterInstance);
    using errorEvent = stub(reporterInstance, "errorEvent");

    const request = new Request("https://denopaste.com/");
    const error = new HttpError(400);
    report(
      request,
      context,
      new Response(),
      error,
    );

    assertSpyCalls(errorEvent, 1);
    assertSpyCallArg(errorEvent, 0, 0, request);
    assertSpyCallArg(errorEvent, 0, 1, context);
    assertSpyCallArg(errorEvent, 0, 2, error);
  });

  await t.step("tracks context errors", () => {
    using _ = stub(PirschReporter, "getInstance", () => reporterInstance);
    using errorEvent = stub(reporterInstance, "errorEvent");

    const request = new Request("https://denopaste.com/");
    const errorContext = {
      error: new HttpError(400),
    } as unknown as FreshContext;

    report(
      request,
      errorContext,
      new Response(),
    );

    assertSpyCalls(errorEvent, 1);
    assertSpyCallArg(errorEvent, 0, 0, request);
    assertSpyCallArg(errorEvent, 0, 1, errorContext);
    assertSpyCallArg(errorEvent, 0, 2, errorContext.error);
  });

  await t.step("tracks page views", () => {
    using _ = stub(PirschReporter, "getInstance", () => reporterInstance);
    using pageView = stub(reporterInstance, "pageView");

    const request = new Request("https://denopaste.com/");
    report(request, context, new Response());

    assertSpyCalls(pageView, 1);
    assertSpyCallArg(pageView, 0, 0, request);
    assertSpyCallArg(pageView, 0, 1, context);
  });

  await t.step("tracks paste events", () => {
    using _ = stub(PirschReporter, "getInstance", () => reporterInstance);
    using pasteEvent = stub(reporterInstance, "pasteEvent");

    const request = new Request("https://denopaste.com/", { method: "POST" });
    const response = new Response();
    report(request, context, response);

    assertSpyCalls(pasteEvent, 1);
    assertSpyCallArg(pasteEvent, 0, 0, request);
    assertSpyCallArg(pasteEvent, 0, 1, response);
    assertSpyCallArg(pasteEvent, 0, 2, context);
  });
});
