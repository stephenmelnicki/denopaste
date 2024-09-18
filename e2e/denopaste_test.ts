import { expect } from "@std/expect";

const baseUrl = "http://localhost:8000";

Deno.test("GET", async () => {
  const response = await fetch(baseUrl);
  const data = await response.arrayBuffer();

  expect(response.status).toBe(200);
  expect(data.byteLength).toBeGreaterThan(0);
});

Deno.test("POST", async () => {
  const contents = "Hello, denopaste!";
  const formData = new FormData();
  formData.append("contents", contents);

  const response = await fetch(baseUrl, {
    method: "POST",
    body: formData,
  });

  const text = await response.text();

  expect(response.redirected).toBe(true);
  expect(response.status).toBe(200);
  expect(response.headers.get("Content-Type")).toBe("text/html; charset=utf-8");
  expect(response.url).not.toEqual(baseUrl);
  expect(text.length).toBeGreaterThan(0);
  expect(text).toContain(contents);
});
