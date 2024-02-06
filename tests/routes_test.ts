import { createHandler, ServeHandlerInfo } from "$fresh/server.ts";
import { assertEquals, assertExists } from "$std/assert/mod.ts";

import manifest from "@/fresh.gen.ts";
import config from "@/fresh.config.ts";

const CONNECTION_INFO: ServeHandlerInfo = {
  remoteAddr: {
    hostname: "127.0.0.1",
    port: 53496,
    transport: "tcp",
  },
};

const handler = await createHandler(manifest, config);

Deno.test("GET /", async () => {
  const response = await handler(
    new Request("http://127.0.0.1/"),
    CONNECTION_INFO,
  );

  assertEquals(response.status, 200);
});

Deno.test("POST /", async () => {
  const formData = new FormData();
  formData.append("content", "Hello, Deno!");

  const response = await handler(
    new Request("http://127.0.0.1/", { method: "POST", body: formData }),
    CONNECTION_INFO,
  );

  assertEquals(response.status, 302);
  assertExists(response.headers.get("Location"));
});

Deno.test("POST / bad request", async () => {
  const formData = new FormData();

  const response = await handler(
    new Request("http://127.0.0.1/", { method: "POST", body: formData }),
    CONNECTION_INFO,
  );

  assertEquals(response.status, 400);
  const body = await response.text();
  assertEquals(body, "bad request");
});

Deno.test("GET /:id", async () => {
  const formData = new FormData();
  formData.append("content", "Hello, Deno!");

  let response = await handler(
    new Request("http://127.0.0.1/", { method: "POST", body: formData }),
    CONNECTION_INFO,
  );

  const id = response.headers.get("Location")?.split("/").pop();
  assertExists(id);

  response = await handler(
    new Request(`http://127.0.0.1/${id}`),
    CONNECTION_INFO,
  );

  assertEquals(response.status, 200);
});

Deno.test("GET /:id not found", async () => {
  const response = await handler(
    new Request(`http://127.0.0.1/1234`),
    CONNECTION_INFO,
  );

  assertEquals(response.status, 404);
});

Deno.test("GET /:id/raw", async () => {
  const formData = new FormData();
  formData.append("content", "Hello, Deno!");

  let response = await handler(
    new Request("http://127.0.0.1/", { method: "POST", body: formData }),
    CONNECTION_INFO,
  );

  const id = response.headers.get("Location")?.split("/").pop();
  assertExists(id);

  response = await handler(
    new Request(`http://127.0.0.1/${id}/raw`),
    CONNECTION_INFO,
  );

  assertEquals(response.status, 200);
  const text = await response.text();
  assertEquals(text, "Hello, Deno!");
});

Deno.test("GET /:id/raw not found", async () => {
  const response = await handler(
    new Request(`http://127.0.0.1/1234/raw`),
    CONNECTION_INFO,
  );

  assertEquals(response.status, 404);
  const text = await response.text();
  assertEquals(text, "paste not found");
});
