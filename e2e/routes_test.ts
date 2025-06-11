import { expect } from "@std/expect";

const address = Deno.args.includes("--deployed")
  ? "https://denopaste.deno.dev"
  : "http://localhost:8000";

function createPaste(
  contents: string = "Hello, denopaste!",
): Promise<Response> {
  const formData = new FormData();
  formData.append("contents", contents);

  return fetch(address, {
    method: "POST",
    body: formData,
  });
}

Deno.test("GET / 200 OK", async () => {
  const response = await fetch(address);
  const text = await response.text();

  expect(response.ok).toBe(true);
  expect(response.status).toBe(200);
  expect(text).toContain("Deno Paste");
  expect(text).toContain(
    "A simple plain text storage service built with Deno 🦕 and Fresh 🍋",
  );
});

Deno.test("GET / 404 Not found", async () => {
  const response = await fetch(`${address}/notaroute`);
  const text = await response.text();

  expect(response.ok).toBe(false);
  expect(response.status).toBe(404);
  expect(text).toContain("404");
  expect(text).toContain("Couldn't find what you're looking for");
  expect(text).toContain("Back to the Homepage");
});

Deno.test("POST / 302 Found", async () => {
  const response = await createPaste();
  const text = await response.text();

  expect(response.ok).toBe(true);
  expect(response.status).toBe(200);
  expect(response.redirected).toBe(true);
  expect(response.url).not.toEqual(address);
  expect(text).toContain("Hello, denopaste!");
});

Deno.test("POST / 400 Bad request", async () => {
  const response = await createPaste("");
  const text = await response.text();

  expect(response.ok).toBe(false);
  expect(response.status).toBe(400);
  expect(text).toContain("400");
  expect(text).toContain("Paste can not be empty");
  expect(text).toContain("Back to the Homepage");
});

Deno.test("POST / 413 Content too large", async () => {
  const response = await createPaste("A".repeat(1024 * 64 + 1));
  const text = await response.text();

  expect(response.ok).toBe(false);
  expect(response.status).toBe(413);
  expect(text).toContain("413");
  expect(text).toContain("Paste is too large. Size limit is 64 KiB.");
  expect(text).toContain("Back to the Homepage");
});

Deno.test("GET /:id 200 OK", async () => {
  const response = await createPaste();
  await response.body?.cancel();
  const id = response.url.split("/").pop();
  const result = await fetch(`${address}/${id}`);
  const text = await result.text();

  expect(result.ok).toBe(true);
  expect(result.status).toBe(200);
  expect(text).toContain("Hello, denopaste!");
});

Deno.test("GET /:id 404 Not found", async () => {
  const response = await fetch(`${address}/notanid`);
  const text = await response.text();

  expect(response.ok).toBe(false);
  expect(response.status).toBe(404);
  expect(text).toContain("404");
  expect(text).toContain("Couldn't find what you're looking for");
  expect(text).toContain("Back to the Homepage");
});

Deno.test("GET /:id/raw 200 OK", async () => {
  const response = await createPaste();
  await response.body?.cancel();
  const id = response.url.split("/").pop();
  const result = await fetch(`${address}/${id}/raw`);
  const text = await result.text();

  expect(result.status).toBe(200);
  expect(result.headers.get("content-type")).toContain("text/plain");
  expect(text).toEqual("Hello, denopaste!");
});

Deno.test("GET /:id/raw 404 Not found", async () => {
  const response = await fetch(`${address}/notanid/raw`);
  const text = await response.text();

  expect(response.ok).toBe(false);
  expect(response.status).toBe(404);
  expect(text).toEqual("Not found");
});
