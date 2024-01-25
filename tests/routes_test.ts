import { createHandler, ServeHandlerInfo } from "$fresh/server.ts";
import manifest from "../fresh.gen.ts";
import config from "../fresh.config.ts";
import { assertEquals, assertExists } from "$std/assert/mod.ts";

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

Deno.test("POST / invalid request", async () => {
  const formData = new FormData();
  formData.append("content", new Blob([JSON.stringify({ hello: "deno" })]));

  const response = await handler(
    new Request("http://127.0.0.1/", { method: "POST", body: formData }),
    CONNECTION_INFO,
  );

  assertEquals(response.status, 400);
  const body = await response.text();
  assertEquals(body, "invalid request");
});

Deno.test("POST / request body too large", async () => {
  const formData = new FormData();
  const paste = await new Blob(["deno".repeat(64 * 1024)]).text();
  formData.append("content", paste);

  const response = await handler(
    new Request("http://127.0.0.1/", { method: "POST", body: formData }),
    CONNECTION_INFO,
  );

  assertEquals(response.status, 400);
  const body = await response.text();
  assertEquals(body, "paste contents cannot exceed 64 KiB");
});

Deno.test("POST / error", async () => {
  const response = await handler(
    new Request("http://127.0.0.1/", { method: "POST" }),
    CONNECTION_INFO,
  );

  assertEquals(response.status, 500);
  const body = await response.text();
  assertEquals(body, "server error");
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
  const body = await response.text();
  assertEquals(body, "Hello, Deno!");
});

Deno.test("GET /:id not found", async () => {
  const response = await handler(
    new Request(`http://127.0.0.1/1234`),
    CONNECTION_INFO,
  );

  assertEquals(response.status, 404);
  const body = await response.text();
  assertEquals(body, "paste not found");
});
