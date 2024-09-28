import { expect } from "@std/expect";

import {
  baseUrl,
  createEmptyPaste,
  createPaste,
  createTooLargePaste,
} from "./utils.ts";

Deno.test("GET /", async () => {
  const response = await fetch(baseUrl);
  const data = await response.arrayBuffer();

  expect(response.status).toBe(200);
  expect(response.headers.get("content-type")).toContain("text/html");
  expect(data.byteLength).toBeGreaterThan(0);
});

Deno.test("GET / 404 Not found", async () => {
  const response = await fetch(`${baseUrl}/notaroute`);
  const text = await response.text();

  expect(response.ok).toBe(false);
  expect(response.status).toBe(404);
  expect(response.headers.get("content-type")).toContain("text/html");
  expect(text).toContain("404");
  expect(text).toContain("Couldn't find what you're looking for");
  expect(text).toContain("Back to the Homepage");
});

Deno.test("GET /:id", async () => {
  const response = await createPaste();
  expect(response.ok).toBe(true);

  const bytes = await response.bytes();
  expect(bytes.byteLength).toBeGreaterThan(0);

  const id = response.url.split("/").pop();
  const result = await fetch(`${baseUrl}/${id}`);

  expect(result.status).toBe(200);
  expect(result.headers.get("content-type")).toContain("text/html");
  expect(await result.text()).toContain("Hello, denopaste!");
});

Deno.test("GET /:id/raw", async () => {
  const response = await createPaste();
  expect(response.ok).toBe(true);

  const bytes = await response.bytes();
  expect(bytes.byteLength).toBeGreaterThan(0);

  const id = response.url.split("/").pop();
  const result = await fetch(`${baseUrl}/${id}/raw`);

  expect(result.status).toBe(200);
  expect(result.headers.get("content-type")).toContain("text/plain");
  expect(await result.text()).toEqual("Hello, denopaste!");
});

Deno.test("GET /:id 404 Not found", async () => {
  const response = await fetch(`${baseUrl}/notanid`);
  const text = await response.text();

  expect(response.ok).toBe(false);
  expect(response.status).toBe(404);
  expect(response.headers.get("content-type")).toContain("text/html");
  expect(text).toContain("404");
  expect(text).toContain("Couldn't find what you're looking for");
  expect(text).toContain("Back to the Homepage");
});

Deno.test("POST /", async () => {
  const response = await createPaste();
  const bytes = await response.bytes();

  expect(bytes.byteLength).toBeGreaterThan(0);
  expect(response.ok).toBe(true);
  expect(response.redirected).toBe(true);
  expect(response.status).toBe(200);
  expect(response.url).not.toEqual(baseUrl);
  expect(response.headers.get("content-type")).toContain("text/html");
});

Deno.test("POST / 400 Bad request", async () => {
  const response = await createEmptyPaste();
  const text = await response.text();

  expect(response.ok).toBe(false);
  expect(response.status).toBe(400);
  expect(response.headers.get("content-type")).toContain("text/html");
  expect(text).toContain("400");
  expect(text).toContain("Paste can not be empty");
  expect(text).toContain("Back to the Homepage");
});

Deno.test("POST / 413 Content too large", async () => {
  const response = await createTooLargePaste();
  const text = await response.text();

  expect(response.ok).toBe(false);
  expect(response.status).toBe(413);
  expect(response.headers.get("content-type")).toContain("text/html");
  expect(text).toContain("413");
  expect(text).toContain("Paste is too large. Size limit is 64 KiB.");
  expect(text).toContain("Back to the Homepage");
});
