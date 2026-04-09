import { chromium } from "playwright";

(async () => {
  const browser = await chromium.launch({
    headless: false,
    slowMo: 500,
  });

  const context1 = await browser.newContext();
  const context2 = await browser.newContext();

  const hostPage = await context1.newPage();
  const joinerPage = await context2.newPage();

  await hostPage.goto("http://localhost:8000");
  await joinerPage.goto("http://localhost:8000");

  await hostPage.locator("#username").fill("Sanket");
  await hostPage.getByRole("button", { name: /check in/i }).click();

  await joinerPage.locator("#username").fill("Pawar");
  await joinerPage.getByRole("button", { name: /check in/i }).click();

  await hostPage.locator(".create").click();
  await joinerPage.locator(".join").click();

  await hostPage.locator(".host").click();

  await joinerPage.locator('input[name="roomId"]').fill("1000");
  await joinerPage.getByRole("button", { name: /join/i }).click();
})();
