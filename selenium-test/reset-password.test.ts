import { Builder, By, until, WebDriver } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome";

const BASE_URL = "http://localhost:5173"; // Change if using a different port
const RESET_TOKEN = "mocked-token"; // Replace with actual token from API

async function testResetPassword() {
  let driver: WebDriver;

  try {
    const options = new chrome.Options();
    options.addArguments("--headless");

    driver = await new Builder().forBrowser("chrome").setChromeOptions(options).build();

    await driver.get(`${BASE_URL}/reset-password?token=${RESET_TOKEN}`);

    const passwordInput = await driver.wait(until.elementLocated(By.css('input[type="password"]')), 5000);
    await passwordInput.sendKeys("NewPass@1234");

    const submitButton = await driver.findElement(By.css("button"));
    await submitButton.click();

    await driver.wait(until.urlIs(`${BASE_URL}/sign-in`), 5000);

    console.log("✅ Reset Password test passed!");
  } catch (error) {
    console.error("❌ Reset Password test failed:", error);
  } finally {
    await driver?.quit();
  }
}

testResetPassword();
