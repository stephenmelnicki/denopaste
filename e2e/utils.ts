export const baseUrl = "http://localhost:8000";

export function createPaste(): Promise<Response> {
  const contents = "Hello, denopaste!";
  const formData = new FormData();
  formData.append("contents", contents);

  return fetch(baseUrl, {
    method: "POST",
    body: formData,
  });
}

export function createEmptyPaste(): Promise<Response> {
  const formData = new FormData();
  formData.append("contents", "");

  return fetch(baseUrl, {
    method: "POST",
    body: formData,
  });
}

export function createTooLargePaste(): Promise<Response> {
  const contents = "A".repeat(1024 * 64 + 1);
  const formData = new FormData();
  formData.append("contents", contents);

  return fetch(baseUrl, {
    method: "POST",
    body: formData,
  });
}
