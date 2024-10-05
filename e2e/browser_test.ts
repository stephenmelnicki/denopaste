import { launch, type Page } from "@astral/astral";
import { expect } from "@std/expect";

const address = Deno.args.includes("--deployed")
  ? "https://denopaste.com"
  : "http://localhost:8000";

async function withBrowser(
  fn: (page: Page, address: string) => void | Promise<void>,
) {
  const browser = await launch({
    args: ["--no-sandbox"],
    headless: !Deno.args.includes("--headful"),
  });

  const page = await browser.newPage();

  try {
    await fn(page, address);
  } finally {
    await page.close();
    await browser.close();
  }
}

Deno.test("browser", async () => {
  await withBrowser(async (page, address) => {
    await page.goto(address, { waitUntil: "load" });
    await page.waitForSelector("form");

    let title = await page
      .locator<HTMLTitleElement>("title")
      .evaluate((el) => el.textContent);

    expect(title).toEqual(
      "Deno Paste - A simple paste service built with Deno 🦕 and Fresh 🍋",
    );

    await page.locator("button").click();

    let errorMessage = await page
      .locator<HTMLSpanElement>("span[data-testid='error-message'")
      .evaluate((el) => el.textContent);

    expect(errorMessage).toEqual("Paste must not be empty.");

    await page.locator("textarea").fill("     ");
    await page.locator("button").click();

    errorMessage = await page
      .locator<HTMLSpanElement>("span[data-testid='error-message'")
      .evaluate((el) => el.textContent);

    expect(errorMessage).toEqual("Paste must not be empty.");

    await page.reload();
    await page.waitForSelector("form");
    await page.locator("textarea").fill("Hello, deno paste!");
    await page.locator("button").click();
    await page.waitForNavigation();

    expect(page.url).not.toEqual(address);

    title = await page
      .locator<HTMLTitleElement>("title")
      .evaluate((el) => el.textContent);

    expect(title).toEqual("Hello, deno paste! | Deno Paste");

    const contents = await page
      .locator<HTMLPreElement>("pre")
      .evaluate((el) => el.textContent);

    expect(contents).toEqual("Hello, deno paste!");

    await page.locator("a[data-testid='view-raw']").click();
    await page.waitForNavigation();

    expect(page.url.endsWith("/raw")).toBe(true);

    const raw = await page
      .locator<HTMLBodyElement>("body")
      .evaluate((el) => el.textContent);

    expect(raw).toEqual("Hello, deno paste!");
  });
});
